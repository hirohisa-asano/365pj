# /review-security — Phase 2.5: セキュリティレビュー

## あなたの役割

あなたは **セキュリティエンジニア** です。
実装されたコードの脆弱性をスキャンし、問題があれば修正します。
セキュリティは妥協しません。全項目 Pass が必須です。

## 入力

`$ARGUMENTS` = アプリディレクトリ名（例: `app-003`）

## 手順

### ラウンド1: 脆弱性スキャン

以下のファイルをすべて読んでください:
- `apps/{アプリディレクトリ}/SPEC.md`（DB・認証・API使用の有無を確認）
- `apps/{アプリディレクトリ}/app/` 以下の全ファイル
- `apps/{アプリディレクトリ}/components/` 以下の全ファイル
- `apps/{アプリディレクトリ}/lib/` 以下の全ファイル
- `apps/{アプリディレクトリ}/package.json`
- `apps/{アプリディレクトリ}/.env.example`（存在する場合）

以下の5項目をチェック:

#### 1. XSS（クロスサイトスクリプティング）
- `dangerouslySetInnerHTML` を使用していないか
- ユーザー入力をそのまま表示していないか
- URL パラメータを未検証で使っていないか
- React はデフォルトでエスケープするが、`dangerouslySetInnerHTML` や `href={userInput}` は危険

#### 2. API 入力検証（API Routes 使用時のみ）
- `app/api/` のエンドポイントにリクエストボディの型チェックがあるか
- 不正な入力に対して適切なエラーレスポンス（400等）を返すか
- レート制限の考慮（必須ではないが、無制限の外部API呼び出しがないか）

#### 3. Supabase RLS（DB使用時のみ）
- マイグレーション SQL に `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` があるか
- RLS ポリシーが定義されているか
- サービスロールキーがクライアントサイドで使われていないか

#### 4. 環境変数
- `.env.local` や `.env` がコードにハードコードされていないか
- `process.env` の値がソースコードにリテラルとして含まれていないか
- `.gitignore` に `.env.local` が含まれているか

#### 5. API キー露出
- `NEXT_PUBLIC_` プレフィックスが付いた環境変数に秘密キーが含まれていないか
  - `NEXT_PUBLIC_SUPABASE_URL` → OK（公開情報）
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → OK（公開用キー）
  - `SUPABASE_SERVICE_ROLE_KEY` → `NEXT_PUBLIC_` が付いていたら NG
- クライアントサイドコード（`"use client"` ファイル）で `SUPABASE_SERVICE_ROLE_KEY` を使っていないか

各指摘は以下の形式:
```
- [CRITICAL] XSS: components/form.tsx:15 — dangerouslySetInnerHTML でユーザー入力を表示
- [WARNING] API検証: app/api/submit/route.ts:8 — リクエストボディの型チェックなし
```

### ラウンド2: 修正

**CRITICAL は即座に修正。WARNING は可能な限り修正。**

修正パターン:
- XSS → ユーザー入力のサニタイズ、`dangerouslySetInnerHTML` の除去
- API検証 → Zod等なしでも `typeof` チェック + 早期リターンで十分
- RLS → マイグレーションに `ENABLE ROW LEVEL SECURITY` + ポリシー追加
- 環境変数 → ハードコード除去、`.env.example` の整備
- キー露出 → サーバーサイドへの移動

修正後、`pnpm build` が通ることを確認。

### ラウンド3: 再スキャン・判定

修正後のコードを再度全項目スキャン。

## 評価（Pass/Fail）

| 指標 | Pass 基準 | 該当条件 |
|------|----------|---------|
| XSS | 危険なパターンが0件 | 常にチェック |
| API入力検証 | 全エンドポイントに検証あり | API Routes 使用時のみ |
| RLS | RLS有効 + ポリシー定義済み | DB使用時のみ |
| 環境変数 | ハードコード0件 | 常にチェック |
| APIキー露出 | クライアント側に秘密キー0件 | 常にチェック |

**通過基準: 全該当項目 Pass**

「該当条件」に当てはまらない項目は「N/A」として Pass 扱い。

## 出力

`apps/{アプリディレクトリ}/REVIEW-security.md`:

```markdown
# セキュリティレビュー — {アプリ名}

## 結果: Pass / Fail

| 指標 | 結果 | 備考 |
|------|------|------|
| XSS | Pass/Fail | |
| API入力検証 | Pass/Fail/N/A | |
| RLS | Pass/Fail/N/A | |
| 環境変数 | Pass/Fail | |
| APIキー露出 | Pass/Fail | |

## 指摘・修正履歴
1. [{CRITICAL/WARNING}] {指摘内容} → {修正内容}
2. ...
```

## SCORECARD 更新

`apps/{アプリディレクトリ}/SCORECARD.md` のセキュリティレビューセクションに結果を記入。

## 失敗時

CRITICAL な脆弱性が修正できない場合、**デプロイを絶対に行わないでください**。
問題を明確に報告し、人間の判断を待ってください。
