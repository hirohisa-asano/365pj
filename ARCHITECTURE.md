# 設計方針

## スタック

| レイヤー | 技術 | 備考 |
| -- | -- | -- |
| フレームワーク | Next.js 15 | App Router, `src/` なし |
| 言語 | TypeScript | strict モード |
| スタイル | Tailwind CSS + shadcn/ui | アイコンは Lucide |
| フォント | Noto Sans JP | next/font 経由 |
| トーンマナー | `tone.config.ts` | アプリごとに色・フォント・角丸を切り替え |
| Linter / Formatter | Biome | lint + format 一体 |
| パッケージマネージャ | pnpm | |
| デプロイ | Vercel | フォルダ単位でプロジェクト分割 |
| アナリティクス | Vercel Analytics | |
| DB / Auth | Supabase | 1プロジェクト・スキーマ分割 |
| 認証 | Supabase Auth | Google 認証のみ（ID/PASS なし） |
| マイグレーション | Supabase CLI | |
| 決済（寄付） | Stripe Payment Links | 一旦全アプリ共通リンク |
| OGP | Next.js opengraph-image.tsx | 自動生成 |

---

## リポジトリ構成

```
365pj/                        ← モノレポ（GitHub: hirohisa-asano/365pj）
├── README.md                 ← プロジェクト概要
├── ARCHITECTURE.md           ← この設計方針ドキュメント
├── CLAUDE.md                 ← Claude Code 用ルール
├── ideas/
│   └── ideas.md              ← アイデアリスト（365個目標）
├── log/
│   └── publish-log.md        ← 公開ログ・反応記録
└── apps/
    ├── template/             ← 新規アプリ作成時のベーステンプレート
    ├── lab/                  ← サザンクロスラボ（ポータルページ）
    ├── app-001/              ← アプリ1本目
    └── app-002/              ← アプリ2本目 ...
```

### 各アプリの構成

```
apps/app-NNN/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── opengraph-image.tsx   ← OGP 自動生成
├── components/
├── tone.config.ts            ← トーンマナー設定
├── tailwind.config.ts        ← tone.config を読み込む
├── biome.json
├── package.json
└── .env.local
```

- 各アプリは **完全独立**（共有パッケージなし）
- `apps/template/` をコピーして作成

---

## レンダリング方針

- **基本は SSG**（静的生成）
- DB リアルタイム取得が必要な場合のみ SSR を使う

---

## デプロイ構成

- `apps/` 以下の各フォルダを **Vercel プロジェクトとして個別に登録**
- 同一リポジトリ・フォルダ指定でデプロイ
- ドメイン構成：

```
southernlabs.com              ← apps/lab/（ポータル）
{サービス名}.southernlabs.com  ← apps/app-NNN/（サービスに合った名前）
```

---

## Supabase 構成

- **1プロジェクト** を共有
- 認証・ユーザー情報は **共通スキーマ（public）** で一元管理
- アプリ固有データは **アプリごとのスキーマ** に分割
- マイグレーションは **Supabase CLI** で管理

```
Supabase（1プロジェクト）
├── auth.users              ← Supabase Auth（全アプリ共通・自動管理）
├── public.profiles         ← ユーザー情報（表示名・アバター等）
├── public.memberships      ← メンバーシップ（Stripe連携・ステータス管理）
├── schema: app_001         ← アプリ固有データ
├── schema: app_002
└── schema: app_003  ...
```

- ユーザーは **1回のログインで全アプリを利用可能**
- メンバー判定は全アプリから `public.memberships` を参照
- アプリが本格的に育った場合のみ、独立プロジェクトへ分離する

### 共通テーブル（public スキーマ）

| テーブル | 用途 | 主なカラム |
| -- | -- | -- |
| `profiles` | ユーザー情報 | id (= auth.users.id), display_name, avatar_url |
| `memberships` | メンバーシップ管理 | user_id, stripe_customer_id, status, plan, expires_at |

### 認証

- **Supabase Auth + Google 認証のみ**
- ID/パスワード認証は使わない
- 認証不要のアプリでは Auth 関連コードを削除して使う
- 認証が必要なアプリでは `auth.users` を参照し、`public.profiles` にユーザー情報を保存

---

## 環境変数

全アプリ共通の命名規則：

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=
```

- Supabase 接続先は全アプリ共通（スキーマで分離）
- Stripe Payment Link は一旦共通。反応が増えたら分ける

---

## トーンマナー

`tone.config.ts` でアプリごとの見た目を制御：

```ts
export const tone = {
  name: "playful",
  colors: {
    primary: "#FF6B6B",
    background: "#FFF9F0",
    text: "#333333",
  },
  font: {
    heading: "'Noto Sans JP', sans-serif",
    body: "'Noto Sans JP', sans-serif",
  },
  borderRadius: "1rem",
}
```

`tailwind.config.ts` がこれを読み込み、全コンポーネントに反映。

---

## アプリ追加の手順

1. `apps/template/` をコピー → `apps/app-NNN/` にリネーム
2. `tone.config.ts` を編集（色・フォント・角丸）
3. Vercel で新規プロジェクト作成、ルートディレクトリに `apps/app-NNN` を指定
4. Supabase でスキーマ `app_NNN` を作成（Supabase CLI）
5. `.env.local` に接続情報を設定
6. Vercel にサブドメイン `{サービス名}.southernlabs.com` を設定
7. 開発・公開

---

## 命名規則

| 対象 | 形式 | 例 |
| -- | -- | -- |
| アプリディレクトリ | `app-NNN`（ゼロ埋め3桁） | `app-001` |
| Supabase スキーマ | `app_NNN`（アンダースコア） | `app_001` |
| サブドメイン | サービス名 | `timer.southernlabs.com` |

---

## ブランチ戦略

- **main 直接**（一人開発・小規模のため）

---

## ラボポータル（サザンクロスラボ）の役割

各アプリに共通する機能・情報は、**ラボポータル側に一元管理**する。
アプリ側はシンプルに保ち、フッターにラボへのリンクを置く。

```
southernlabs.com（ラボポータル）
├── 各アプリへのリンク集
├── 寄付動線（Stripe Payment Links）
├── ご意見箱（フォーム）
├── 利用規約
└── プライバシーポリシー
```

### 寄付動線
- **Stripe Payment Links** で一元管理
- 各アプリのフッターに寄付リンクを設置
- 強制しない・「気に入ったら」トーン
- 寄付があったアプリ ＝ 育成候補の有力シグナルとして扱う

### フッター共通要素
- 寄付リンク（Stripe Payment Links）
- ポータルへのリンク（southernlabs.com）

### ご意見箱
- ラボポータル上にフォームを設置
- アプリをまたいだフィードバックをまとめて受け取る

### 利用規約・プライバシーポリシー
- ラボポータルで一本化
- アプリごとに個別に作成しない
- 「本サービスはサザンクロスラボが提供します」という形で統一
