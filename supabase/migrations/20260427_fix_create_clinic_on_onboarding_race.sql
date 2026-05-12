create or replace function public.create_clinic_on_onboarding(
  p_user_id uuid,
  p_clinic_name text,
  p_clinic_whatsapp text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clinic_id uuid;
begin
  -- Serialize onboarding per user to avoid duplicate rows from double-submit races.
  perform pg_advisory_xact_lock(hashtext(p_user_id::text));

  select id
    into v_clinic_id
    from public.clinic_configs
   where user_id = p_user_id
   order by id asc
   limit 1;

  if v_clinic_id is null then
    insert into public.clinic_configs (
      user_id,
      clinic_name,
      clinic_whatsapp,
      is_active
    )
    values (
      p_user_id,
      trim(p_clinic_name),
      nullif(trim(p_clinic_whatsapp), ''),
      true
    )
    returning id into v_clinic_id;
  end if;

  insert into public.clinic_users (clinic_config_id, user_id, user_email, role, is_active)
  select
    v_clinic_id,
    p_user_id,
    (select au.email from auth.users au where au.id = p_user_id),
    'owner',
    true
  where not exists (
    select 1
      from public.clinic_users cu
     where cu.clinic_config_id = v_clinic_id
       and cu.user_id = p_user_id
  );

  return v_clinic_id;
end;
$$;
