# アイデア精査ツール — 仕様メモ

## コンセプト

アイデアのタイトルを入れると「誰が・課題・理想・競合・有料スコア」を自動生成し、
複数アイデアをスコアで比較・絞り込める。「作るべき1本」が自然に決まる。

---

## ターゲット

- 個人開発者（副業・365PJ系）
- スタートアップ初期フェーズの創業者
- プロダクトマネージャー

---

## コア機能

### 1. アイデア登録
- タイトルを入力する
- AIが以下を自動生成：
  - **誰が**：ターゲットユーザー
  - **課題**：解決する痛み
  - **理想**：使った後の状態
  - **競合**：既存サービス名 + 強さ（弱/中/強）
  - **有料スコア**：1〜5（課金動機の強さ）
  - **一言まとめ**：このアイデアの本質

### 2. 精査ボード
- 登録したアイデアを一覧表示
- スコア順・カテゴリ別・競合の弱さ順で並び替え
- フィルタ：「競合が強いものを除去」「スコア3以下を除去」
- アイデアをアーカイブ（削除せず保存）

### 3. 入れ替えサイクル
- 「弱いアイデアを除去して新しいアイデアを補充」のフローをサポート
- 目標数（例：365個）を設定して、常に維持
- サイクル履歴を記録（何回目の入れ替えか）

### 4. 最終選考
- 残ったアイデアから「今作る1本」をピン留め
- ピン留めしたアイデアはSpec作成フローへ

---

## 画面構成（シンプル版）

```
/ （トップ）
  → アイデア一覧 + 登録フォーム

/ideas/[id]
  → アイデア詳細・編集

/board
  → 精査ボード（スコア比較・フィルタ）
```

---

## 技術スタック

- **フレームワーク**: Next.js（App Router）
- **DB**: Supabase（スキーマ: app_idea_filter）
- **AI**: OpenAI API or Claude API（アイデア詳細の自動生成）
- **スタイル**: Tailwind CSS
- **デプロイ**: Vercel

---

## Supabase スキーマ

```sql
-- アイデアテーブル
create table idea_filter.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  target text,           -- 誰が
  problem text,          -- 課題
  ideal text,            -- 理想
  competitors text,      -- 競合（JSON or text）
  competitor_strength text check (competitor_strength in ('weak', 'medium', 'strong')),
  paid_score int check (paid_score between 1 and 5),
  summary text,          -- 一言まとめ
  status text default 'active' check (status in ('active', 'archived', 'pinned')),
  cycle int default 1,   -- 何サイクル目か
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## MVP（最初に作るもの）

1. アイデアタイトルを入力 → AIが詳細を自動生成
2. 一覧で並び替え・フィルタ
3. アーカイブ（除去）機能

**作り込まないもの（後回し）:**
- ユーザー認証（最初はローカル or 単一ユーザー）
- サイクル管理のUI
- エクスポート機能

---

## 寄付動線

- フッターに Buy Me a Coffee リンク
- 「気に入ったら」程度のトーン
- ラボポータル（southerncrosslab.com）へのリンクも置く

---

## 開発目安

| フェーズ | 内容 | 目安 |
| -- | -- | -- |
| Day 1 | DB設計 + AI生成 API | 4〜6h |
| Day 2 | 一覧・詳細UI | 4〜6h |
| Day 3 | フィルタ・アーカイブ + デプロイ | 3〜4h |

**合計：3日以内で完成できる。**
