-- Run AFTER you create the user in Supabase -> Authentication -> Users -> Add user.
-- Replace the email below with that user's email, then Run.
insert into public.admins (user_id)
select id from auth.users where email = 'PASTE-ADMIN-EMAIL-HERE'
on conflict do nothing;
select * from public.admins;   -- you should see 1 row
