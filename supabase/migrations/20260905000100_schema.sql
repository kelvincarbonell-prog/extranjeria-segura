-- =============================================================================
-- EXTRANJERÍA SEGURA — CORE SCHEMA
--
-- Design notes that matter:
--   · Everything lives in `public` and is owned by RLS. There is no
--     "trusted" path that bypasses row-level checks.
--   · Personal identity data (passport numbers, criminal-record content) is
--     never stored in a column that appears in a URL, a slug or an index we
--     expose. Case references are opaque and separate from primary keys.
--   · Every table that touches a case carries `case_id` so a single policy
--     shape ("do you have access to this case?") governs the whole system.
--   · Deletions are soft where retention law applies (`deleted_at`), hard
--     where the data subject has an unconditional right to erasure.
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ============================== ENUMS ========================================

create type public.app_role as enum (
  'admin', 'abogado', 'gestor', 'paralegal', 'comercial', 'cliente'
);

create type public.case_stage as enum (
  'lead', 'diagnostico', 'consulta', 'contratado', 'documentacion',
  'revision', 'listo_presentar', 'presentado', 'requerimiento',
  'resolucion', 'archivado'
);

create type public.case_outcome as enum (
  'pendiente', 'favorable', 'desfavorable', 'desistido', 'archivado'
);

create type public.document_state as enum (
  'pendiente', 'subido', 'revision', 'correcto', 'cambios', 'caducado'
);

create type public.document_owner as enum ('cliente', 'equipo', 'administracion');

create type public.review_verdict as enum ('aprobado', 'rechazado', 'correcciones');

create type public.appointment_state as enum ('propuesta', 'confirmada', 'cancelada', 'pasada');

create type public.payment_state as enum (
  'pendiente', 'programado', 'pagado', 'fallido', 'reembolsado'
);

create type public.message_author as enum ('cliente', 'equipo', 'asistente', 'sistema');

create type public.notification_kind as enum (
  'documento', 'cita', 'expediente', 'mensaje', 'pago', 'requerimiento'
);

create type public.notification_channel as enum ('in_app', 'email', 'push', 'sms', 'whatsapp');

create type public.consent_purpose as enum (
  'gestion_expediente', 'comunicaciones_comerciales', 'estadisticas_anonimas',
  'canal_whatsapp', 'canal_sms', 'canal_push'
);

create type public.audit_action as enum (
  'insert', 'update', 'delete', 'select_sensitive', 'download', 'login', 'export'
);

-- ============================== IDENTITY =====================================

-- Mirrors auth.users. One row per authenticated person.
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  full_name     text,
  email         text not null,
  phone         text,
  locale        text not null default 'es',
  timezone      text not null default 'Europe/Madrid',
  avatar_url    text,
  -- Nationality and country of residence drive eligibility; they are not
  -- special-category data under Art. 9 GDPR, but they are still restricted.
  nationality   text,
  country       text,
  birth_date    date,
  -- Two-factor readiness. Enforcement lives in the auth layer.
  mfa_enabled   boolean not null default false,
  onboarded_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

comment on table public.profiles is
  'Perfil de la persona usuaria. Datos de identidad mínimos; la documentación va en storage privado.';

-- Staff membership and role. A person without a row here is a client.
create table public.team_members (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null unique references public.profiles (id) on delete cascade,
  role         public.app_role not null,
  -- Colegio de abogados registration, required to sign expedientes.
  bar_id       text,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint team_members_role_not_client check (role <> 'cliente'),
  -- A profile can only sign as abogado if a bar id is recorded.
  constraint team_members_abogado_requires_bar_id
    check (role <> 'abogado' or bar_id is not null)
);

-- ============================== CATALOGUE ====================================

create table public.case_types (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  category      text not null,
  fee_cents     integer,
  active        boolean not null default true,
  -- Content is only publishable once a colegiado signs it off.
  legal_review_by  uuid references public.team_members (id),
  legal_reviewed_at timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint case_types_fee_non_negative check (fee_cents is null or fee_cents >= 0)
);

create table public.document_types (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  owner          public.document_owner not null default 'cliente',
  -- Retention in days from case closure. Drives the erasure job.
  retention_days integer not null default 2555,
  -- Documents whose content is special-category or highly sensitive.
  sensitive      boolean not null default false,
  created_at     timestamptz not null default now()
);

-- Which documents a given trámite requires.
create table public.case_type_documents (
  case_type_id     uuid not null references public.case_types (id) on delete cascade,
  document_type_id uuid not null references public.document_types (id) on delete cascade,
  required         boolean not null default true,
  position         integer not null default 0,
  note             text,
  primary key (case_type_id, document_type_id)
);

-- ============================== LEADS & CASES ================================

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid references public.profiles (id) on delete set null,
  email         text,
  full_name     text,
  phone         text,
  source        text,
  objective     text,
  -- Result of the Immigration Check, if the person ran it.
  eligibility_id uuid,
  assigned_to   uuid references public.team_members (id) on delete set null,
  stage         public.case_stage not null default 'lead',
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create table public.cases (
  id            uuid primary key default gen_random_uuid(),
  -- Human-facing reference. Opaque: never derived from personal data.
  reference     text not null unique,
  client_id     uuid not null references public.profiles (id) on delete restrict,
  case_type_id  uuid not null references public.case_types (id) on delete restrict,
  stage         public.case_stage not null default 'contratado',
  outcome       public.case_outcome not null default 'pendiente',
  -- Assigned staff. `lawyer_id` is the professional who signs.
  lawyer_id     uuid references public.team_members (id) on delete set null,
  manager_id    uuid references public.team_members (id) on delete set null,
  progress      smallint not null default 0,
  fee_cents     integer not null default 0,
  -- The administrative deadline that matters right now, if any.
  sla_due_at    timestamptz,
  opened_at     timestamptz not null default now(),
  submitted_at  timestamptz,
  resolved_at   timestamptz,
  closed_at     timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz,
  constraint cases_progress_range check (progress between 0 and 100),
  constraint cases_fee_non_negative check (fee_cents >= 0)
);

create index cases_client_idx    on public.cases (client_id) where deleted_at is null;
create index cases_stage_idx     on public.cases (stage)     where deleted_at is null;
create index cases_sla_idx       on public.cases (sla_due_at) where deleted_at is null and sla_due_at is not null;
create index cases_lawyer_idx    on public.cases (lawyer_id);
create index cases_manager_idx   on public.cases (manager_id);

-- Immutable-by-policy history of everything that happened to a case.
create table public.case_events (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases (id) on delete cascade,
  actor_id    uuid references public.profiles (id) on delete set null,
  kind        text not null,
  title       text not null,
  detail      text,
  -- Visible to the client, or internal only.
  client_visible boolean not null default true,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index case_events_case_idx on public.case_events (case_id, created_at desc);

-- ============================== DOCUMENTS ====================================

create table public.documents (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases (id) on delete cascade,
  document_type_id uuid references public.document_types (id) on delete set null,
  name             text not null,
  state            public.document_state not null default 'pendiente',
  owner            public.document_owner not null default 'cliente',
  -- Object key inside the PRIVATE storage bucket. Never a public URL.
  storage_path     text,
  mime_type        text,
  size_bytes       bigint,
  pages            integer,
  -- Document validity. `expires_at` powers the caducado state.
  issued_at        date,
  expires_at       date,
  -- Structured fields read from the document. Never the full text.
  extracted        jsonb not null default '{}'::jsonb,
  -- What is wrong, in the client's language, when state needs action.
  issue_title      text,
  issue_detail     text,
  version          integer not null default 1,
  uploaded_by      uuid references public.profiles (id) on delete set null,
  uploaded_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz,
  constraint documents_size_limit check (size_bytes is null or size_bytes <= 20971520)
);

create index documents_case_idx    on public.documents (case_id) where deleted_at is null;
create index documents_state_idx   on public.documents (state)   where deleted_at is null;
create index documents_expiry_idx  on public.documents (expires_at) where expires_at is not null;

-- A review is a signed act by a named professional. Append-only.
create table public.document_reviews (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references public.documents (id) on delete cascade,
  reviewer_id   uuid not null references public.team_members (id) on delete restrict,
  verdict       public.review_verdict not null,
  comment       text,
  -- The document version this verdict applies to.
  document_version integer not null,
  created_at    timestamptz not null default now()
);

create index document_reviews_doc_idx on public.document_reviews (document_id, created_at desc);

-- ============================== COMMUNICATION ================================

create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  case_id     uuid not null references public.cases (id) on delete cascade,
  author_kind public.message_author not null,
  author_id   uuid references public.profiles (id) on delete set null,
  body        text not null,
  -- Attachment lives in the same private bucket as documents.
  attachment_path text,
  attachment_name text,
  -- Set when the assistant escalated to a human.
  escalated   boolean not null default false,
  read_at     timestamptz,
  created_at  timestamptz not null default now(),
  constraint messages_body_not_empty check (length(btrim(body)) > 0)
);

create index messages_case_idx on public.messages (case_id, created_at);

create table public.notifications (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  case_id     uuid references public.cases (id) on delete cascade,
  kind        public.notification_kind not null,
  title       text not null,
  body        text,
  href        text,
  read_at     timestamptz,
  -- Which channels this was actually delivered on.
  delivered   public.notification_channel[] not null default '{in_app}',
  created_at  timestamptz not null default now()
);

create index notifications_profile_idx on public.notifications (profile_id, created_at desc);

create table public.notification_preferences (
  profile_id  uuid primary key references public.profiles (id) on delete cascade,
  -- email stays true: deadline notices are contractually necessary.
  email       boolean not null default true,
  push        boolean not null default true,
  sms         boolean not null default false,
  whatsapp    boolean not null default false,
  updated_at  timestamptz not null default now()
);

-- ============================== SCHEDULING ===================================

create table public.appointments (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid references public.cases (id) on delete cascade,
  client_id    uuid not null references public.profiles (id) on delete cascade,
  staff_id     uuid references public.team_members (id) on delete set null,
  title        text not null,
  starts_at    timestamptz not null,
  duration_min integer not null default 45,
  mode         text not null default 'videollamada',
  locale       text not null default 'es',
  state        public.appointment_state not null default 'propuesta',
  meeting_url  text,
  external_id  text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint appointments_duration_positive check (duration_min > 0)
);

create index appointments_client_idx on public.appointments (client_id, starts_at desc);

-- ============================== BILLING ======================================

create table public.payments (
  id             uuid primary key default gen_random_uuid(),
  case_id        uuid references public.cases (id) on delete set null,
  client_id      uuid not null references public.profiles (id) on delete restrict,
  concept        text not null,
  amount_cents   integer not null,
  currency       char(3) not null default 'EUR',
  state          public.payment_state not null default 'pendiente',
  due_date       date,
  paid_at        timestamptz,
  -- Stripe identifiers only. Card data never touches this database.
  stripe_payment_intent text,
  stripe_price_key      text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint payments_amount_positive check (amount_cents >= 0)
);

create table public.invoices (
  id           uuid primary key default gen_random_uuid(),
  payment_id   uuid not null references public.payments (id) on delete restrict,
  client_id    uuid not null references public.profiles (id) on delete restrict,
  number       text not null unique,
  issued_at    date not null default current_date,
  total_cents  integer not null,
  tax_cents    integer not null default 0,
  storage_path text,
  created_at   timestamptz not null default now()
);

-- ============================== WORK MANAGEMENT ==============================

create table public.tasks (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid references public.cases (id) on delete cascade,
  assignee_id  uuid references public.team_members (id) on delete set null,
  title        text not null,
  detail       text,
  due_at       timestamptz,
  done_at      timestamptz,
  priority     smallint not null default 2,
  created_by   uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint tasks_priority_range check (priority between 1 and 4)
);

create index tasks_assignee_idx on public.tasks (assignee_id, due_at) where done_at is null;

-- ============================== IMMIGRATION CHECK ============================

create table public.questionnaires (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  version     integer not null default 1,
  definition  jsonb not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- One row per completed check. Answers are stored only when the person
-- chooses to save the result to an account.
create table public.eligibility_results (
  id               uuid primary key default gen_random_uuid(),
  profile_id       uuid references public.profiles (id) on delete cascade,
  lead_id          uuid references public.leads (id) on delete set null,
  questionnaire_id uuid references public.questionnaires (id) on delete set null,
  -- Ordered pathways with fit, reasons and verification items.
  pathways         jsonb not null default '[]'::jsonb,
  engine_version   text not null default '1',
  created_at       timestamptz not null default now()
);

create table public.questionnaire_answers (
  id                    uuid primary key default gen_random_uuid(),
  eligibility_result_id uuid not null references public.eligibility_results (id) on delete cascade,
  question_id           text not null,
  answer                text not null,
  created_at            timestamptz not null default now()
);

-- ============================== CONTENT ======================================

create table public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  body          text,
  category      text,
  cover_path    text,
  published_at  timestamptz,
  -- Legal content requires a named reviewer before it can be published.
  reviewed_by   uuid references public.team_members (id),
  reviewed_at   timestamptz,
  sources       jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint articles_publish_requires_review
    check (published_at is null or (reviewed_by is not null and reviewed_at is not null))
);

-- Client reviews. `source_url` is NOT NULL by design: an unverifiable review
-- cannot be stored, let alone displayed.
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  author_name  text not null,
  origin       text not null,
  city         text not null,
  tramite      text not null,
  body         text not null,
  rating       smallint not null,
  source       text not null,
  source_url   text not null,
  consent_to_publish_name boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  constraint reviews_rating_range check (rating between 1 and 5),
  constraint reviews_source_url_is_url check (source_url ~* '^https?://')
);

-- ============================== COMPLIANCE ===================================

-- Consent register. Append-only: withdrawing writes a new row, never updates.
create table public.consents (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles (id) on delete cascade,
  purpose      public.consent_purpose not null,
  granted      boolean not null,
  -- Evidence of the act of consent.
  policy_version text not null,
  ip_hash      text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index consents_profile_idx on public.consents (profile_id, purpose, created_at desc);

-- Audit trail. Written by triggers and by explicit calls for reads of
-- sensitive rows. Nothing may update or delete these rows.
create table public.audit_logs (
  id           bigserial primary key,
  actor_id     uuid references public.profiles (id) on delete set null,
  actor_role   public.app_role,
  action       public.audit_action not null,
  table_name   text not null,
  record_id    text,
  case_id      uuid,
  -- Changed fields only. Never the document content itself.
  diff         jsonb,
  ip_hash      text,
  user_agent   text,
  created_at   timestamptz not null default now()
);

create index audit_logs_case_idx   on public.audit_logs (case_id, created_at desc);
create index audit_logs_actor_idx  on public.audit_logs (actor_id, created_at desc);
create index audit_logs_record_idx on public.audit_logs (table_name, record_id);

-- Data-subject requests (access, rectification, erasure, portability).
create table public.data_requests (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles (id) on delete cascade,
  kind         text not null,
  status       text not null default 'recibida',
  detail       text,
  resolved_at  timestamptz,
  resolved_by  uuid references public.team_members (id) on delete set null,
  created_at   timestamptz not null default now(),
  constraint data_requests_kind check (
    kind in ('acceso', 'rectificacion', 'supresion', 'portabilidad', 'oposicion', 'limitacion')
  )
);
