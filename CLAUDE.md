# CLAUDE.md — 365PJ

## プロジェクト概要

365個のアイデアを出し、小さなアプリを素早く作って公開する個人開発チャレンジ。
詳細は `README.md`、設計方針は `ARCHITECTURE.md` を参照。

## 技術スタック

- Next.js 15 (App Router) + TypeScript (strict)
- Tailwind CSS + shadcn/ui + Lucide
- Biome (lint + format)
- pnpm
- Vercel + Vercel Analytics
- Supabase (@supabase/ssr) + Supabase Auth (Google 認証のみ)
- Supabase CLI (マイグレーション管理)
- Stripe Payment Links (寄付)
- Motion (アニメーション)
- 外部サービス: `.claude/approved-services.md` の Tier 0-2 を使用可能

## リポジトリ構成

```
365pj/
├── apps/           ← 各アプリ (app-NNN/)、template/ からコピーして作成
├── ideas/          ← アイデアリスト (ideas.md)
├── log/            ← 公開ログ・反応記録
├── ARCHITECTURE.md ← 設計方針
└── README.md       ← プロジェクト概要
```

## 開発ルール

- **1アプリ最大3日以内**で作る。作り込まない
- **単機能・小規模**（数百行以内が目安）
- 新規アプリは `apps/template/` をコピー → `apps/app-NNN/` にリネーム
- 各アプリは**完全独立**（共有パッケージなし）
- レンダリングは**基本 SSG**、必要なら SSR
- `src/` ディレクトリは使わない
- `tone.config.ts` でアプリごとのトーンマナーを制御
- フッターに寄付リンク（Stripe）+ ポータルリンクを設置
- OGP は `opengraph-image.tsx` で自動生成
- Supabase スキーマは `app_NNN` で分割
- **認証（AuthHeader）は全アプリ共通**。削除しない。DB不要のアプリでもSupabase Auth + memberships チェックは残す
- DB不要のアプリでは Supabase マイグレーションのみ省略
- ブランチ戦略は main 直接
- ドメインは `{サービス名}.southerncrosslab.com`

## 環境変数

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=
ANTHROPIC_API_KEY=
```

### 環境変数の共有ルール

- **マスター `.env.local`** は `apps/lab/.env.local` に集約
- 新規アプリ作成時、`apps/lab/.env.local` から必要なキーをコピーする
- `ANTHROPIC_API_KEY` は `apps/lab/.env.local` に保管済み。Claude API を使うアプリはここからコピーすること

## コマンド

各アプリディレクトリ (`apps/template/`, `apps/lab/`, `apps/app-NNN/`) 内で実行：

```bash
pnpm dev      # 開発サーバー起動
pnpm build    # プロダクションビルド
pnpm start    # ビルド済みアプリ起動
pnpm lint     # Biome でチェック
pnpm format   # Biome でフォーマット
```

## Claude API モデル指定

- **デフォルトモデル: `claude-haiku-4-5-20251001`**（コスト効率優先）
- 高精度が必要な場合のみ `claude-sonnet-4-6` を検討（要人間承認）

## プラン設計（機能制限）

AI機能を使うアプリでは、以下の3段階で機能を分けること:

| プラン | 対象 | 認証 | 制限の考え方 |
|-------|------|------|------------|
| **minimum** | 未ログインユーザー | なし | 体験版。回数制限（例: 1日1回）or 結果の一部非表示 |
| **medium** | Googleログイン済み | Supabase Auth | 標準利用。回数制限緩め（例: 1日5回）or 全結果表示 |
| **normal** | サポーター（寄付済み） | Supabase Auth + memberships | 制限なし。フル機能 |

### 実装パターン

- **回数制限型**（AI APIを使うアプリ向け）: APIコール回数で制限。localStorage（minimum）+ DB（medium/normal）で管理
- **機能制限型**（ツール系アプリ向け）: minimum は基本機能のみ、medium で詳細表示、normal で全機能
- **ハイブリッド型**: 回数+機能の両方で差をつける

### SPEC での記載

SPEC.md に「プラン設計」セクションを設け、各プランで何ができるかを明記すること:
```markdown
## プラン設計
| 機能 | minimum | medium | normal |
|------|---------|--------|--------|
| {機能1} | {制限内容} | {制限内容} | 制限なし |
```

## 言語

- ドキュメント・コミットメッセージは日本語で書く
