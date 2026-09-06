-- =============================================================================
-- TRIGGERS, AUDIT TRAIL, STORAGE
-- =============================================================================

-- ============================ updated_at =====================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'team_members', 'case_types', 'leads', 'cases', 'documents',
    'appointments', 'payments', 'tasks', 'articles', 'notification_preferences'
  ]
  loop
    execute format(
      'create trigger %I_touch before update on public.%I
         for each row execute function public.touch_updated_at()',
      t, t
    );
  end loop;
end;
$$;

-- ============================ AUDIT TRAIL ====================================
-- SECURITY DEFINER so the trigger can write to a table nobody may insert into.

create or replace function public.write_audit()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_case_id uuid;
  v_diff    jsonb;
  v_action  public.audit_action;
begin
  v_action := lower(tg_op)::public.audit_action;

  -- Resolve the case this row belongs to, whatever the table.
  v_case_id := case tg_table_name
    when 'cases'     then coalesce(new.id, old.id)
    when 'documents' then coalesce(new.case_id, old.case_id)
    when 'messages'  then coalesce(new.case_id, old.case_id)
    when 'case_events' then coalesce(new.case_id, old.case_id)
    else null
  end;

  -- Record changed fields only. Never document contents, never full rows on
  -- delete: the audit log must not become a second copy of the data.
  if tg_op = 'UPDATE' then
    select jsonb_object_agg(key, jsonb_build_object('de', old_row.value, 'a', new_row.value))
      into v_diff
    from jsonb_each(to_jsonb(old)) old_row
    join jsonb_each(to_jsonb(new)) new_row using (key)
    where old_row.value is distinct from new_row.value
      and key not in ('updated_at', 'extracted');
  elsif tg_op = 'INSERT' then
    v_diff := jsonb_build_object('creado', true);
  else
    v_diff := jsonb_build_object('eliminado', true);
  end if;

  -- An update that changed nothing auditable is not worth a row.
  if v_diff is null or v_diff = '{}'::jsonb then
    return coalesce(new, old);
  end if;

  insert into public.audit_logs (actor_id, actor_role, action, table_name, record_id, case_id, diff)
  values (
    auth.uid(),
    public.current_role(),
    v_action,
    tg_table_name,
    coalesce(new.id, old.id)::text,
    v_case_id,
    v_diff
  );

  return coalesce(new, old);
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'cases', 'documents', 'document_reviews', 'payments', 'invoices',
    'team_members', 'profiles', 'data_requests'
  ]
  loop
    execute format(
      'create trigger %I_audit after insert or update or delete on public.%I
         for each row execute function public.write_audit()',
      t, t
    );
  end loop;
end;
$$;

-- ============================ CASE REFERENCES ================================
-- Opaque, sequential, never derived from personal data.

create sequence if not exists public.case_reference_seq start 2001;

create or replace function public.assign_case_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference is null or new.reference = '' then
    new.reference := 'ES-' || nextval('public.case_reference_seq');
  end if;
  return new;
end;
$$;

create trigger cases_assign_reference
  before insert on public.cases
  for each row execute function public.assign_case_reference();

-- ============================ DOCUMENT EXPIRY ================================
-- A document that has passed its validity date is `caducado`, automatically.
-- Losing an expediente because nobody noticed a date is the failure mode this
-- whole product exists to prevent.

create or replace function public.expire_documents()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected integer;
begin
  update public.documents
     set state = 'caducado',
         issue_title = 'El documento está caducado',
         issue_detail = 'Ha perdido vigencia. Necesitamos una versión emitida recientemente.'
   where deleted_at is null
     and expires_at is not null
     and expires_at < current_date
     and state <> 'caducado';
  get diagnostics affected = row_count;
  return affected;
end;
$$;

-- ============================ CASE EVENT ON STAGE CHANGE =====================

create or replace function public.log_stage_change()
returns trigger
language plpgsql
as $$
begin
  if new.stage is distinct from old.stage then
    insert into public.case_events (case_id, actor_id, kind, title, detail, client_visible)
    values (
      new.id,
      auth.uid(),
      'stage_change',
      'Tu expediente ha cambiado de fase',
      format('De %s a %s', old.stage, new.stage),
      true
    );
  end if;
  return new;
end;
$$;

create trigger cases_log_stage_change
  after update on public.cases
  for each row execute function public.log_stage_change();

-- ============================ PROFILE BOOTSTRAP ==============================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  insert into public.notification_preferences (profile_id)
  values (new.id)
  on conflict (profile_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- STORAGE
--
-- One private bucket. No public bucket exists in this project, so a document
-- cannot be made public by accident. Access is by signed URL only, minted
-- server-side after the same case-access check the tables use.
--
-- Object key convention:  cases/<case_id>/<document_id>/<version>-<filename>
-- The case id is the first path segment so policies can check access with a
-- single split_part, and so a leaked key reveals nothing about the person.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'case-documents',
  'case-documents',
  false,
  20971520,
  array[
    'application/pdf',
    'image/jpeg', 'image/png', 'image/heic', 'image/webp'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "case documents: read with case access"
  on storage.objects for select
  using (
    bucket_id = 'case-documents'
    and public.has_document_access((split_part(name, '/', 2))::uuid)
  );

create policy "case documents: upload with case access"
  on storage.objects for insert
  with check (
    bucket_id = 'case-documents'
    and split_part(name, '/', 1) = 'cases'
    and public.has_document_access((split_part(name, '/', 2))::uuid)
  );

-- Objects are immutable once written: a new version is a new object. That
-- keeps the document history auditable and stops silent substitution.
create policy "case documents: no overwrite"
  on storage.objects for update
  using (false);

-- Only admins may delete an object, and only for erasure requests.
create policy "case documents: delete admin only"
  on storage.objects for delete
  using (bucket_id = 'case-documents' and public.current_role() = 'admin');

-- Invoices live in their own private bucket: the finance role needs them,
-- the case team does not.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invoices', 'invoices', false, 5242880, array['application/pdf'])
on conflict (id) do update set public = false;

create policy "invoices: read own or finance"
  on storage.objects for select
  using (
    bucket_id = 'invoices'
    and (
      split_part(name, '/', 2) = auth.uid()::text
      or public.current_role() in ('admin', 'gestor')
    )
  );
