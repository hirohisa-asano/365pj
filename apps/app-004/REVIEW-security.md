# Security Review — BucketAI (app-004)

レビュー日: 2026-06-25

## 総合判定: PASS

---

## チェック項目

### 1. XSS — PASS

`dangerouslySetInnerHTML` の使用なし。Claude API から返されたテキストはすべて React の JSX テキストノードとして表示（自動エスケープ）。

```
grep -r dangerouslySetInnerHTML → 0件
```

### 2. API 入力検証 — PASS

`/api/generate/route.ts` で以下を検証:

- リクエストボディが JSON パース可能か
- `answers` が配列か
- 各要素が `string` 型か (型ガード使用)
- 最大 3 要素に切り詰め (`.slice(0, 3)`)
- 各回答を 500 文字に切り詰め (`.slice(0, MAX_ANSWER_LENGTH)`)
- ちょうど 3 件かつ空文字なし

プロンプトインジェクション緩和: ユーザー入力は構造化プロンプトの `→` 以降に配置。最大 500 文字制限あり。

### 3. RLS — N/A

DB 書き込みなし。Supabase は認証専用 (`auth.getUser()`)。

### 4. 環境変数（ANTHROPIC_API_KEY サーバーサイド限定） — PASS

- `ANTHROPIC_API_KEY` は `NEXT_PUBLIC_` プレフィックスなし → クライアントバンドルに含まれない
- `/api/generate/route.ts` はサーバーサイドで実行される API Route
- `new Anthropic()` は環境変数を自動解決 (SDK デフォルト動作)

### 5. API キー露出 — PASS

クライアントコード (`"use client"` のファイル) に秘密鍵の参照なし。

| 変数 | NEXT_PUBLIC_ | クライアント参照 | 評価 |
|------|-------------|---------------|------|
| `ANTHROPIC_API_KEY` | なし | なし | OK |
| `SUPABASE_SERVICE_ROLE_KEY` | なし | なし | OK |
| `STRIPE_SECRET_KEY` | なし | なし | OK |
| `STRIPE_WEBHOOK_SECRET` | なし | なし | OK |
| `NEXT_PUBLIC_SUPABASE_URL` | あり | クライアント可 | OK (設計通り) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | あり | クライアント可 | OK (設計通り) |

---

## 注意事項（Gate 外・推奨対応）

### レート制限の回避可能性

未ログインユーザーの 1 日 1 回制限は `localStorage` のみで管理。シークレットモードや localStorage 削除で無制限利用が可能。現状は API コスト管理のゆるい防線として機能するが、本格的な制限には API 側のサーバーサイド制限（IP ベースや session ベース）が必要。SPEC では「localStorage で管理」と明記されているため現時点では許容範囲。

### ログイン済みユーザーの回数制限未実装

SPEC では medium プラン（ログイン済み）で 1 日 5 回とあるが、API 側にカウント機能なし。DB 不使用の設計であるため現状は無制限。コスト面での潜在リスクあり。

---

## Gate 判定

全 5 項目（RLS は N/A）: **すべて PASS** — 合格
