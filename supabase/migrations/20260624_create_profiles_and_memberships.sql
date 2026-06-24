-- profiles: ユーザー情報（全アプリ共通）
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "誰でも参照可" on public.profiles
  for select using (true);

create policy "本人のみ更新" on public.profiles
  for update using (auth.uid() = id);

-- 新規ユーザー作成時に自動で profiles を作る
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- memberships: メンバーシップ管理（Stripe連携）
create table public.memberships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  status text check (status in ('active', 'canceled', 'past_due')) not null default 'active',
  plan text default 'member',
  current_period_end timestamptz,
  created_at timestamptz default now()
);

alter table public.memberships enable row level security;

create policy "本人のみ参照" on public.memberships
  for select using (auth.uid() = user_id);
