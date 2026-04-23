create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id) on delete set null,
  clinic_config_id uuid not null references public.clinic_configs(id) on delete cascade,
  action text not null,
  resource_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_audit_logs_admin_id
  on public.admin_audit_logs(admin_id);

create index if not exists idx_admin_audit_logs_clinic_config_id
  on public.admin_audit_logs(clinic_config_id);

create index if not exists idx_admin_audit_logs_created_at_desc
  on public.admin_audit_logs(created_at desc);

alter table public.admin_audit_logs enable row level security;

drop policy if exists admin_audit_logs_select on public.admin_audit_logs;
create policy admin_audit_logs_select
  on public.admin_audit_logs
  for select
  using (
    exists (
      select 1
      from public.clinic_users cu
      where cu.user_id = auth.uid()
        and cu.clinic_config_id = admin_audit_logs.clinic_config_id
        and cu.role in ('admin', 'owner')
    )
  );

drop policy if exists admin_audit_logs_insert on public.admin_audit_logs;
create policy admin_audit_logs_insert
  on public.admin_audit_logs
  for insert
  with check (
    exists (
      select 1
      from public.clinic_users cu
      where cu.user_id = auth.uid()
        and cu.clinic_config_id = admin_audit_logs.clinic_config_id
        and cu.role in ('admin', 'owner')
    )
  );
