# /ship — Phase 4: 公開（デプロイ自動化）

## あなたの役割

あなたは **フルスタックエンジニア** です。
完成したアプリを本番環境にデプロイし、ポータル・ログ・通知を更新します。

## 入力

`$ARGUMENTS` を以下の形式で解釈してください:

```
/ship {アプリディレクトリ名} {サブドメイン名}
例: /ship app-003 llm-cost
→ apps/app-003/ を llm-cost.southerncrosslab.com にデプロイ
```

引数が不足している場合は、アプリの SPEC.md からサブドメイン名を推測してください。

## 前提条件チェック

デプロイ前に以下を確認してください。1つでも失敗したら停止:

1. `apps/{アプリディレクトリ}/` が存在すること
2. `vercel` CLI がインストール済みであること（`vercel --version`）
3. `apps/{アプリディレクトリ}/` で `pnpm build` が通ること

## 手順

### ステップ1: ビルド確認

```bash
cd apps/{アプリディレクトリ}
pnpm install
pnpm build
```

ビルドが通らない場合は停止し、エラーを報告してください。

### ステップ2: Vercel プロジェクト作成 + デプロイ

```bash
cd apps/{アプリディレクトリ}
vercel --yes
vercel --prod
```

### ステップ3: 環境変数セット

SPEC.md と `.env.example` を読み、必要な環境変数を確認してください。
以下の共通環境変数は必ずセットしてください:

```bash
# Supabase（DB使用アプリのみ）
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Stripe（寄付リンク）
vercel env add NEXT_PUBLIC_STRIPE_PAYMENT_LINK production

# ポータル
vercel env add NEXT_PUBLIC_PORTAL_URL production
```

注意: 環境変数の値は `.env.local` から読み取ってください。`.env.local` がない場合は人間に確認を求めてください。

### ステップ4: ドメイン設定

```bash
vercel domains add {サブドメイン名}.southerncrosslab.com
```

### ステップ5: Supabase マイグレーション（DB使用時のみ）

SPEC.md に DB 使用の記載がある場合のみ実行:

```bash
supabase migration new {アプリ名}
# マイグレーション SQL を書き込み
supabase db push
```

### ステップ6: 再デプロイ（環境変数反映）

```bash
cd apps/{アプリディレクトリ}
vercel --prod
```

### ステップ7: ポータル更新

`apps/lab/app/page.tsx` の `apps` 配列にエントリを追加してください:

```typescript
const apps: { name: string; description: string; url: string }[] = [
  // 既存のエントリ...
  { name: "{アプリ名}", description: "{一言説明}", url: "https://{サブドメイン名}.southerncrosslab.com" },
];
```

アプリ名と説明は SPEC.md から取得してください。

ポータルも再デプロイ:
```bash
cd apps/lab
vercel --prod
```

### ステップ8: 公開ログ更新

`log/publish-log.md` のテーブルに行を追加:

```
| {番号} | {今日の日付} | {アプリ名} | https://{サブドメイン名}.southerncrosslab.com | |
```

### ステップ9: Discord 通知

`.env` または `.env.local` に `DISCORD_WEBHOOK_URL` がある場合、Webhook で通知:

```bash
curl -H "Content-Type: application/json" \
  -d '{"content": "🚀 新アプリ公開: **{アプリ名}**\n{一言説明}\nhttps://{サブドメイン名}.southerncrosslab.com"}' \
  "$DISCORD_WEBHOOK_URL"
```

Webhook URL がない場合はスキップし、「Discord Webhook 未設定」と報告してください。

### ステップ10: Git コミット

ポータル更新と公開ログ更新をコミット:

```
{アプリ名}：公開 ({サブドメイン名}.southerncrosslab.com)
```

## 評価（Pass/Fail）

| 指標 | 確認方法 |
|------|---------|
| デプロイ成功 | `vercel` コマンドが正常終了 |
| 本番URL疎通 | `curl -s -o /dev/null -w "%{http_code}" https://{サブドメイン名}.southerncrosslab.com` が 200 |
| OGP | `curl -s https://{サブドメイン名}.southerncrosslab.com/opengraph-image` が画像を返す |
| ポータル更新 | `apps/lab/app/page.tsx` に新エントリがある |
| Discord通知 | Webhook 送信成功 or 「未設定」 |

## SCORECARD 更新

`apps/{アプリディレクトリ}/SCORECARD.md` のフェーズ4セクションに結果を記入してください。

## 失敗時

- ビルド失敗 → 停止、エラー内容を報告
- デプロイ失敗 → `vercel logs` で原因を確認し報告
- ドメイン設定失敗 → DNS 設定の確認を人間に依頼
- いずれも自動修正を試みず、人間に報告してください
