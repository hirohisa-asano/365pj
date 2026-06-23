# 設計方針

## スタック

| レイヤー | 技術 | 備考 |
| -- | -- | -- |
| フレームワーク | Next.js | App Router |
| デプロイ | Vercel | フォルダ単位でプロジェクト分割 |
| DB / Auth | Supabase | 1プロジェクト・スキーマ分割 |
| スタイル | Tailwind CSS |  |

---

## リポジトリ構成

```
365pj/                        ← モノレポ（GitHub: hirohisa-asano/365pj）
├── README.md                 ← プロジェクト概要
├── ARCHITECTURE.md           ← この設計方針ドキュメント
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

---

## デプロイ構成

- `apps/` 以下の各フォルダを **Vercel プロジェクトとして個別に登録**
- 同一リポジトリ・フォルダ指定でデプロイ
- ドメイン構成（予定）：

```
southernlabs.com          ← apps/lab/
app001.southernlabs.com   ← apps/app-001/
app002.southernlabs.com   ← apps/app-002/
```

---

## Supabase 構成

- **1プロジェクト** を共有
- アプリごとに **PostgreSQL スキーマ** を分割

```
Supabase（1プロジェクト）
├── schema: app_001
├── schema: app_002
└── schema: app_003  ...
```

- アプリが本格的に育った場合のみ、独立プロジェクトへ分離する

---

## アプリ追加の手順（テンプレから起こす）

1. `apps/template/` をコピー → `apps/app-NNN/` にリネーム
2. Vercel で新規プロジェクト作成、ルートディレクトリに `apps/app-NNN` を指定
3. Supabase でスキーマ `app_NNN` を作成
4. `.env` に接続情報を設定
5. 開発・公開

---

## 寄付動線

- 各アプリに **Buy Me a Coffee** または **Ko-fi** のリンクを設置
- 強制しない・「気に入ったら」トーン
- 寄付があったアプリ ＝ 育成候補の有力シグナルとして扱う
