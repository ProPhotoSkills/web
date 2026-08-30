create or replace function public.grant_admin_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if lower(new.email) = 'support@prophotoskills.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
      on conflict (user_id, role) do nothing;
    insert into public.user_access (user_id, has_access) values (new.id, true)
      on conflict (user_id) do update set has_access = true;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_grant_admin on auth.users;
create trigger on_auth_user_created_grant_admin
after insert on auth.users
for each row execute function public.grant_admin_on_signup();