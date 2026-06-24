# /implement — Phase 2: 実装

## あなたの役割

あなたは **フルスタックエンジニア** です。
SPEC.md と TODO.md に基づいてアプリのコードを生成し、ビルドを通します。

## 入力

`$ARGUMENTS` = アプリディレクトリ名（例: `app-003`）

## 前提

- `apps/{アプリディレクトリ}/SPEC.md` と `TODO.md` が存在すること
- `/new-app` で初期化済みであること

## 技術スタック（遵守事項）

- Next.js (App Router) + TypeScript (strict)
- Tailwind CSS v4 + shadcn/ui + Lucide
- `src/` ディレクトリは使わない
- `tone.config.ts` の色・フォント・角丸を使う（CSS変数経由）
- フッターに寄付リンク（Stripe）+ ポータルリンク + Discord リンクを設置
- OGP は `app/opengraph-image.tsx` で自動生成
- Biome でフォーマット・リント

## 手順

### ラウンド1: コード生成

SPEC.md の全要件を読み、以下を生成:

1. **ページ**: `app/page.tsx` および必要な追加ページ (`app/xxx/page.tsx`)
2. **コンポーネント**: `components/` に UI コンポーネント（1コンポーネント100行以内目安）
3. **API Routes**: `app/api/` に必要なエンドポイント（API使用時のみ）
4. **Supabase マイグレーション**: DB使用時、`supabase/migrations/` に SQL ファイル
5. **OGP 更新**: `app/opengraph-image.tsx` のタイトル・色をアプリに合わせて更新
6. **layout.tsx 更新**: メタデータ（title, description）をアプリに合わせて更新

### コーディング規約

- **日本語 UI**: ユーザー向けテキストは日本語
- **変数名・関数名**: 英語（キャメルケース）
- **コメント**: 必要最小限。ロジックが自明なら書かない
- **型定義**: 必要な型は各ファイル内か `types.ts` に定義
- **エラーハンドリング**: ユーザー入力・外部API境界のみ。内部コードは信頼する
- **状態管理**: React の useState/useReducer で十分。外部ライブラリ不要
- **レスポンシブ**: モバイルファースト。Tailwind のブレークポイントを使う

### ラウンド2: ビルド・リント修正

```bash
cd apps/{アプリディレクトリ}
pnpm install
pnpm build
```

ビルドエラーがあれば修正してください。修正後に再度 `pnpm build` を実行。
**最大3回** リトライ。3回失敗したら停止し、エラーを報告。

```bash
pnpm lint
```

リントエラーがあれば修正。

```bash
pnpm format
```

フォーマットを適用。

### ラウンド3: SPEC 充足チェック

SPEC.md の **機能要件** セクションを1項目ずつ確認:

1. 各要件に対応するコードが存在するか
2. 漏れがあれば実装を追加
3. TODO.md の実装タスクにチェックを入れる

### 定量チェック

以下を計測し、基準を満たしているか確認:

```bash
# 合計行数（新規作成・変更したファイルのみ。node_modules等は除外）
find apps/{アプリディレクトリ} -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .next | xargs wc -l

# 新規ファイル数
find apps/{アプリディレクトリ} -name "*.tsx" -o -name "*.ts" | grep -v node_modules | grep -v .next | wc -l
```

## 評価（Pass/Fail）

| 指標 | Pass 基準 |
|------|----------|
| pnpm build | エラー0で成功 |
| pnpm lint | エラー0 |
| SPEC充足率 | 機能要件100%実装 |
| 合計行数 | 500行以内（テンプレートのコードは除外して数える） |
| 新規ファイル数 | 15ファイル以内 |

**通過基準: 全項目 Pass**

行数・ファイル数が超過する場合:
- まずリファクタリングを試みる
- それでも超過する場合は「SPEC のスコープが大きすぎる」と報告

## SCORECARD 更新

`apps/{アプリディレクトリ}/SCORECARD.md` のフェーズ2セクションに結果を記入。

## 出力

```
apps/{アプリディレクトリ}/
├── app/
│   ├── page.tsx           ← 更新
│   ├── layout.tsx         ← メタデータ更新
│   ├── opengraph-image.tsx ← タイトル・色更新
│   ├── api/               ← 必要なら追加
│   └── {追加ページ}/      ← 必要なら追加
├── components/            ← UIコンポーネント追加
├── TODO.md                ← チェック済み
└── SCORECARD.md           ← フェーズ2記入
```

## 失敗時

- ビルド3回失敗 → 停止、エラー詳細を報告
- SPEC充足率100%にならない → 未実装項目をリストアップして報告
- 行数/ファイル数超過 → リファクタリング試行後、超過理由を報告
