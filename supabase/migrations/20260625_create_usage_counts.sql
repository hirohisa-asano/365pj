-- usage_counts: アプリごとの利用回数管理（全アプリ共通）
create table public.usage_counts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  app_id text not null,
  date date not null default current_date,
  count int not null default 0,
  unique(user_id, app_id, date)
);

alter table public.usage_counts enable row level security;

create policy "本人のみ参照" on public.usage_counts
  for select using (auth.uid() = user_id);

create policy "本人のみ更新" on public.usage_counts
  for update using (auth.uid() = user_id);

create policy "本人のみ挿入" on public.usage_counts
  for insert with check (auth.uid() = user_id);
