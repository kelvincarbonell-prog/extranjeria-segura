-- =============================================================================
-- ROW LEVEL SECURITY
--
-- The rule this file exists to enforce:
--   A client can only ever reach their own case. Staff reach a case only when
--   they are assigned to it, or hold a role that legitimately needs breadth.
--   A commercial profile never reaches immigration documents at all.
--
-- Nothing in the application is trusted to filter. Every policy below is
-- written so that a missing `where` clause in application code is a bug, not
-- a breach.
-- =============================================================================

-- ============================ HELPER FUNCTIONS ===============================
-- SECURITY DEFINER so policies can consult team_members without recursing
-- through that table's own RLS. Search path is pinned to defeat shadowing.

create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(
    (select tm.role from public.team_members tm
      where tm.profile_id = auth.uid() and tm.active),
    'cliente'::public.app_role
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.team_members tm
    where tm.profile_id = auth.uid() and tm.active
  );
$$;

create or replace function public.current_team_member_id()
returns uuid
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select tm.id from public.team_members tm
  where tm.profile_id = auth.uid() and tm.active;
$$;

-- The single access predicate the whole system is built on.
create or replace function public.has_case_access(target_case uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.cases c
    left join public.team_members tm
      on tm.profile_id = auth.uid() and tm.active
    where c.id = target_case
      and c.deleted_at is null
      and (
        -- The client, always, for their own case.
        c.client_id = auth.uid()
        -- Admins and lawyers: full operational breadth.
        or tm.role in ('admin', 'abogado')
        -- Managers and paralegals: only what they are assigned.
        or (tm.role in ('gestor', 'paralegal')
            and (c.manager_id = tm.id or c.lawyer_id = tm.id))
      )
  );
$$;

-- Documents are the sharpest edge: commercial staff are excluded outright,
-- even for cases they sourced.
create or replace function public.has_document_access(target_case uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select public.has_case_access(target_case)
     and public.current_role() <> 'comercial';
$$;

-- ============================ ENABLE RLS =====================================

alter table public.profiles                 enable row level security;
alter table public.team_members             enable row level security;
alter table public.case_types               enable row level security;
alter table public.document_types           enable row level security;
alter table public.case_type_documents      enable row level security;
alter table public.leads                    enable row level security;
alter table public.cases                    enable row level security;
alter table public.case_events              enable row level security;
alter table public.documents                enable row level security;
alter table public.document_reviews         enable row level security;
alter table public.messages                 enable row level security;
alter table public.notifications            enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.appointments             enable row level security;
alter table public.payments                 enable row level security;
alter table public.invoices                 enable row level security;
alter table public.tasks                    enable row level security;
alter table public.questionnaires           enable row level security;
alter table public.eligibility_results      enable row level security;
alter table public.questionnaire_answers    enable row level security;
alter table public.articles                 enable row level security;
alter table public.reviews                  enable row level security;
alter table public.consents                 enable row level security;
alter table public.audit_logs               enable row level security;
alter table public.data_requests            enable row level security;

-- Force RLS for table owners too, so a compromised service role in
-- application code cannot quietly read everything.
alter table public.documents      force row level security;
alter table public.cases          force row level security;
alter table public.messages       force row level security;
alter table public.audit_logs     force row level security;

-- ============================ PROFILES =======================================

create policy profiles_select_self on public.profiles
  for select using (id = auth.uid());

create policy profiles_select_staff on public.profiles
  for select using (
    public.current_role() in ('admin', 'abogado', 'gestor', 'paralegal')
  );

-- Commercial staff see only profiles attached to leads they own.
create policy profiles_select_comercial on public.profiles
  for select using (
    public.current_role() = 'comercial'
    and exists (
      select 1 from public.leads l
      where l.profile_id = profiles.id
        and l.assigned_to = public.current_team_member_id()
    )
  );

create policy profiles_update_self on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy profiles_update_admin on public.profiles
  for update using (public.current_role() = 'admin');

create policy profiles_insert_self on public.profiles
  for insert with check (id = auth.uid());

-- ============================ TEAM ===========================================

create policy team_select_staff on public.team_members
  for select using (public.is_staff());

create policy team_write_admin on public.team_members
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- ============================ CATALOGUE (public read) ========================

create policy case_types_read on public.case_types
  for select using (true);

create policy case_types_write_admin on public.case_types
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy document_types_read on public.document_types
  for select using (true);

create policy document_types_write_admin on public.document_types
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy case_type_documents_read on public.case_type_documents
  for select using (true);

create policy case_type_documents_write_admin on public.case_type_documents
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- ============================ LEADS ==========================================

create policy leads_select_own on public.leads
  for select using (profile_id = auth.uid());

create policy leads_select_staff on public.leads
  for select using (
    public.current_role() in ('admin', 'comercial', 'gestor', 'abogado')
  );

create policy leads_write_staff on public.leads
  for all using (public.current_role() in ('admin', 'comercial', 'gestor'))
  with check (public.current_role() in ('admin', 'comercial', 'gestor'));

-- ============================ CASES ==========================================

create policy cases_select on public.cases
  for select using (public.has_case_access(id));

-- Commercial staff can see that a case exists (for pipeline value) but the
-- documents policy keeps them out of its contents.
create policy cases_select_comercial on public.cases
  for select using (public.current_role() = 'comercial');

create policy cases_insert_staff on public.cases
  for insert with check (
    public.current_role() in ('admin', 'abogado', 'gestor')
  );

create policy cases_update_staff on public.cases
  for update using (
    public.has_case_access(id) and public.current_role() in ('admin', 'abogado', 'gestor')
  )
  with check (public.current_role() in ('admin', 'abogado', 'gestor'));

-- Only admins may soft-delete a case; nobody may hard-delete one.
create policy cases_delete_none on public.cases
  for delete using (false);

-- ============================ CASE EVENTS ====================================

create policy case_events_select on public.case_events
  for select using (
    public.has_case_access(case_id)
    and (client_visible or public.is_staff())
  );

create policy case_events_insert_staff on public.case_events
  for insert with check (public.has_case_access(case_id) and public.is_staff());

-- History is not editable. Corrections are new events.
create policy case_events_no_update on public.case_events for update using (false);
create policy case_events_no_delete on public.case_events for delete using (false);

-- ============================ DOCUMENTS ======================================

create policy documents_select on public.documents
  for select using (public.has_document_access(case_id) and deleted_at is null);

-- The client may upload against their own case, and only into rows the team
-- has created for them (no inventing document slots).
create policy documents_update_client on public.documents
  for update using (
    deleted_at is null
    and exists (
      select 1 from public.cases c
      where c.id = documents.case_id and c.client_id = auth.uid()
    )
  )
  with check (
    -- A client can move a document to `subido`, never to `correcto`.
    state in ('pendiente', 'subido')
  );

create policy documents_write_staff on public.documents
  for all using (
    public.has_document_access(case_id)
    and public.current_role() in ('admin', 'abogado', 'gestor', 'paralegal')
  )
  with check (
    public.has_document_access(case_id)
    and public.current_role() in ('admin', 'abogado', 'gestor', 'paralegal')
  );

-- ============================ DOCUMENT REVIEWS ===============================

create policy document_reviews_select on public.document_reviews
  for select using (
    exists (
      select 1 from public.documents d
      where d.id = document_reviews.document_id
        and public.has_document_access(d.case_id)
    )
  );

-- Only a lawyer (or admin) may record a final verdict. Paralegals raise
-- issues on the document row; they do not sign it off.
create policy document_reviews_insert on public.document_reviews
  for insert with check (
    public.current_role() in ('admin', 'abogado')
    and reviewer_id = public.current_team_member_id()
  );

create policy document_reviews_no_update on public.document_reviews for update using (false);
create policy document_reviews_no_delete on public.document_reviews for delete using (false);

-- ============================ MESSAGES =======================================

create policy messages_select on public.messages
  for select using (public.has_case_access(case_id));

create policy messages_insert_client on public.messages
  for insert with check (
    author_kind = 'cliente'
    and author_id = auth.uid()
    and exists (
      select 1 from public.cases c
      where c.id = messages.case_id and c.client_id = auth.uid()
    )
  );

create policy messages_insert_staff on public.messages
  for insert with check (
    public.is_staff()
    and public.has_case_access(case_id)
    and author_kind in ('equipo', 'asistente', 'sistema')
  );

create policy messages_no_update on public.messages for update using (false);
create policy messages_no_delete on public.messages for delete using (false);

-- ============================ NOTIFICATIONS ==================================

create policy notifications_select_own on public.notifications
  for select using (profile_id = auth.uid());

create policy notifications_update_own on public.notifications
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

create policy notifications_insert_staff on public.notifications
  for insert with check (public.is_staff());

create policy notification_prefs_own on public.notification_preferences
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ============================ APPOINTMENTS ===================================

create policy appointments_select on public.appointments
  for select using (
    client_id = auth.uid()
    or (case_id is not null and public.has_case_access(case_id))
    or public.current_role() in ('admin', 'abogado', 'gestor', 'comercial')
  );

create policy appointments_insert on public.appointments
  for insert with check (client_id = auth.uid() or public.is_staff());

create policy appointments_update on public.appointments
  for update using (client_id = auth.uid() or public.is_staff());

-- ============================ BILLING ========================================

create policy payments_select_own on public.payments
  for select using (client_id = auth.uid());

create policy payments_select_staff on public.payments
  for select using (public.current_role() in ('admin', 'gestor'));

create policy payments_write_admin on public.payments
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy invoices_select_own on public.invoices
  for select using (client_id = auth.uid());

create policy invoices_select_staff on public.invoices
  for select using (public.current_role() in ('admin', 'gestor'));

create policy invoices_write_admin on public.invoices
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- ============================ TASKS ==========================================

create policy tasks_staff on public.tasks
  for all using (public.is_staff()) with check (public.is_staff());

-- ============================ IMMIGRATION CHECK ==============================

create policy questionnaires_read on public.questionnaires
  for select using (active or public.is_staff());

create policy questionnaires_write_admin on public.questionnaires
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

create policy eligibility_select_own on public.eligibility_results
  for select using (profile_id = auth.uid());

create policy eligibility_select_staff on public.eligibility_results
  for select using (public.current_role() in ('admin', 'abogado', 'gestor', 'comercial'));

create policy eligibility_insert_own on public.eligibility_results
  for insert with check (profile_id = auth.uid() or profile_id is null);

create policy answers_select on public.questionnaire_answers
  for select using (
    exists (
      select 1 from public.eligibility_results r
      where r.id = questionnaire_answers.eligibility_result_id
        and (r.profile_id = auth.uid()
             or public.current_role() in ('admin', 'abogado', 'gestor'))
    )
  );

create policy answers_insert on public.questionnaire_answers
  for insert with check (
    exists (
      select 1 from public.eligibility_results r
      where r.id = questionnaire_answers.eligibility_result_id
        and (r.profile_id = auth.uid() or r.profile_id is null)
    )
  );

-- ============================ CONTENT ========================================

create policy articles_read_published on public.articles
  for select using (published_at is not null or public.is_staff());

create policy articles_write_staff on public.articles
  for all using (public.current_role() in ('admin', 'abogado'))
  with check (public.current_role() in ('admin', 'abogado'));

create policy reviews_read_published on public.reviews
  for select using (published_at is not null or public.is_staff());

create policy reviews_write_admin on public.reviews
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');

-- ============================ COMPLIANCE =====================================

create policy consents_select_own on public.consents
  for select using (profile_id = auth.uid());

create policy consents_select_admin on public.consents
  for select using (public.current_role() = 'admin');

create policy consents_insert_own on public.consents
  for insert with check (profile_id = auth.uid());

-- The consent register is evidence. It is append-only, for everyone.
create policy consents_no_update on public.consents for update using (false);
create policy consents_no_delete on public.consents for delete using (false);

-- A person can read their own audit trail: that is the point of it.
create policy audit_select_own on public.audit_logs
  for select using (
    actor_id = auth.uid()
    or (case_id is not null and exists (
      select 1 from public.cases c where c.id = audit_logs.case_id and c.client_id = auth.uid()
    ))
  );

create policy audit_select_admin on public.audit_logs
  for select using (public.current_role() = 'admin');

-- Nobody writes audit rows by hand; triggers do, running as definer.
create policy audit_no_insert on public.audit_logs for insert with check (false);
create policy audit_no_update on public.audit_logs for update using (false);
create policy audit_no_delete on public.audit_logs for delete using (false);

create policy data_requests_own on public.data_requests
  for select using (profile_id = auth.uid());

create policy data_requests_insert_own on public.data_requests
  for insert with check (profile_id = auth.uid());

create policy data_requests_admin on public.data_requests
  for all using (public.current_role() = 'admin')
  with check (public.current_role() = 'admin');
