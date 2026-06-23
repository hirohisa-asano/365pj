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
- 認証不要のアプリでは Auth 関連コードを削除
- ブランチ戦略は main 直接
- ドメインは `{サービス名}.southernlabs.com`

## 環境変数

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=
```

## コマンド

各アプリディレクトリ (`apps/template/`, `apps/lab/`, `apps/app-NNN/`) 内で実行：

```bash
pnpm dev      # 開発サーバー起動
pnpm build    # プロダクションビルド
pnpm start    # ビルド済みアプリ起動
pnpm lint     # Biome でチェック
pnpm format   # Biome でフォーマット
```

## 言語

- ドキュメント・コミットメッセージは日本語で書く
