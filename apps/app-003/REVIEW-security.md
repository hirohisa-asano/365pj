# セキュリティレビュー — app-003 (FilmPick)

レビュー日: 2026-06-25

## チェック結果

| # | 項目 | 結果 | 備考 |
|---|------|------|------|
| 1 | XSS | **PASS** | `dangerouslySetInnerHTML` の使用なし。全ユーザー入力は React JSX の通常レンダリングで処理されるため安全 |
| 2 | API 入力検証 | **PASS** (修正済) | 修正前は型チェック・長さ制限・配列上限なし。修正後: JSON パース失敗の検知、配列型の確認、文字数上限（映画名100字、気分50字）、要素数上限（各10件）を追加 |
| 3 | RLS | **N/A** | DB 未使用 |
| 4 | 環境変数（ANTHROPIC_API_KEY） | **PASS** | `NEXT_PUBLIC_` プレフィックスなし。Route Handler（サーバーサイド）のみで SDK が `process.env.ANTHROPIC_API_KEY` を参照。クライアントバンドルに含まれない |
| 5 | APIキー露出 | **PASS** | クライアントコード（`page.tsx`、`components/*.tsx`）に API キーのハードコードや `NEXT_PUBLIC_` 経由の露出なし |

## 修正内容

### `app/api/recommend/route.ts`（修正済）

**修正前の問題点（MEDIUM）:**

1. `request.json()` の型アサーションのみで、実際の型チェックなし — 任意の JSON を送信可能
2. `movies` / `moods` に文字数・要素数の上限なし — 過大な入力でプロンプトを肥大化させ API コストを攻撃可能（Prompt Injection / Cost Attack）
3. `JSON.parse(text)` に try/catch なし（修正前の状態では未ハンドル例外で 500 エラー）

**修正後:**

- `request.json()` のパース失敗を try/catch で捕捉 → 400 を返す
- `movies` / `moods` が配列であることを明示的に検証
- 各要素を string 型フィルタリング + 文字数切り詰め（映画名: 100字、気分: 50字）
- 配列要素数を最大 10 件に制限
- Anthropic API 呼び出しと `JSON.parse` を try/catch で包み、エラー時は 500 + メッセージを返す（既に適用済みだったため維持）

## 総評

Critical な脆弱性はなし。修正により API 入力検証が適切なレベルに到達。
