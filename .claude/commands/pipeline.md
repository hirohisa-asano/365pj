# /pipeline — 全フェーズ一括実行

## 概要

Phase 1（計画立案）から Phase 5（マーケティング）まで順番に実行し、
1つのアプリをアイデアから公開・PR文生成まで完了させます。

Phase 0（需要分析）は `/demand-scan` で別途実行してください。

## 入力

`$ARGUMENTS` を以下のいずれかで解釈:

1. **アイデア番号**: `#27` → `ideas/ideas-detail.md` から該当アイデアを使う
2. **フリーテキスト**: `LLMのコストを計算するツール` → そのままインプットにする
3. **candidates指定**: `candidates 1` → `ideas/ideas-candidates.md` の1位を使う

## パイプライン全体の流れ

```
Phase 1: 計画立案（PM）
    ↓ ゲート: SPEC スコア ≥ 20/30
Phase 2: 実装（エンジニア）
    ↓ ゲート: build + lint Pass, SPEC充足100%
Phase 2.5: レビュー
    ├ アーキテクト: ≥ 10/15, 0点なし
    ├ UI/UX: ≥ 18/27, 0点なし
    └ セキュリティ: 全Pass
    ↓ ゲート: 全レビュー通過 + build Pass
Phase 2.8: ローカルQA（QAテスター）
    ↓ ゲート: OK判定（NGなら修正→再QA）
Phase 3: リーガル
    ↓ ゲート: 全Pass（要確認ありなら人間に通知して続行）
Phase 4: 公開
    ↓ ゲート: デプロイ成功 + URL疎通
Phase 4.5: 本番QA（QAテスター）
    ↓ ゲート: OK判定（NGなら修正→再デプロイ→再QA）
Phase 5: マーケティング
    ↓ ゲート: スコア ≥ 14/20
完了: SCORECARD.md に全スコア記入済み
```

**重要: 各ゲートで不合格の場合、修正を試みてください。2回修正しても通過しない場合は停止し、どのゲートで失敗したかを報告してください。**

---

## Phase 1: 計画立案

### 役割: プロダクトマネージャー

1. `apps/` をスキャンし、次の `app-NNN` 番号を決定
2. 入力に基づきアイデア情報を取得（ideas-detail.md or フリーテキスト）
3. `cp -r apps/template apps/app-{NNN}` でテンプレートコピー
4. `package.json` の `name` を `app-{NNN}` に更新

### SPEC.md 生成（3ラウンド）

**R1**: SPEC.md ドラフト生成（概要・ターゲット・課題・画面構成・技術仕様・機能要件・スコープ外）
**R2**: 自己スコアリング（6項目×5点=30点）。20点未満なら修正
**R3**: TODO.md 生成、tone.config.ts カスタマイズ、SCORECARD.md 初期化

#### スコア基準
| 指標 | 1 | 3 | 5 |
|------|---|---|---|
| 課題の明確さ | 曖昧 | おおむね明確 | 具体的 |
| スコープ | 3日で無理 or 小さすぎ | ギリギリ | 適切 |
| 画面設計 | 「いい感じに」 | 画面数明確 | 要素・遷移まで明確 |
| 技術的実現性 | API契約必要 | 一部不確実 | 既存スタックで完結 |
| 差別化 | ChatGPTで十分 | やや差別化 | 専用UXで勝てる |
| 収益化導線 | 寄付のみ | 有料版の余地 | B2B展開見える |

**ゲート: ≥ 20/30。不合格なら修正→再スコアリング。**

#### 認証・DB不要の場合の処理
- 認証不要 → `middleware.ts`, `lib/supabase/` を削除
- DB不要 → `lib/supabase/` 削除 + package.json から Supabase 依存を削除

#### 使えるサービス（ティア制）
`.claude/approved-services.md` を参照。
- **Tier 0**: ブラウザAPI（Geolocation, Camera等）→ 自由に使用可
- **Tier 1**: Supabase / Claude API / Vercel → 自由に使用可
- **Tier 2**: 承認済み外部サービス（Leaflet, Mapbox, OpenWeatherMap等）→ SPECに記載すれば使用可
- **Tier 3**: リストにないサービス → 人間に確認を求める

---

## Phase 2: 実装

### 役割: フルスタックエンジニア

SPEC.md と TODO.md に基づきコード生成。

**R1**: page.tsx・コンポーネント・API Routes・マイグレーション生成。OGP・layout.tsx 更新
**R2**: `pnpm install && pnpm build && pnpm lint && pnpm format`。エラーは最大3回修正
**R3**: SPEC 機能要件を1つずつ確認。漏れがあれば追加実装。TODO チェック

#### コーディング規約
- 日本語 UI、英語変数名、コメント最小限
- 1コンポーネント100行以内目安
- モバイルファースト（Tailwind レスポンシブ）
- `"use client"` は必要な箇所のみ

**ゲート: build Pass + lint Pass + SPEC充足100% + 500行以内 + 15ファイル以内**

---

## Phase 2.5: レビュー

### ① アーキテクトレビュー

全ソースと SPEC.md を読み、5観点で評価:
- SPEC整合性 / コンポーネント分割 / データフロー / SSG-SSR選択 / 依存パッケージ
- 各0-3点、合計15点 → **ゲート: ≥ 10/15、0点なし**
- 指摘→修正→再チェック（3ラウンド）
- `REVIEW-architecture.md` 出力

### ② UI/UXデザインレビュー

tone.config・レイアウト・ユーザビリティを評価:
- 第一印象 / アクション到達 / 配色 / レスポンシブ / エラー表示 / フッター / デザイン個性 / 文言 / モーション
- 各0-3点、合計27点 → **ゲート: ≥ 18/27、0点なし**
- 指摘→修正→再チェック（3ラウンド）
- `REVIEW-design.md` 出力

### ③ セキュリティレビュー

脆弱性スキャン:
- XSS / API入力検証 / RLS / 環境変数 / APIキー露出
- 全て Pass/Fail → **ゲート: 全該当項目 Pass**
- CRITICAL → 即修正
- `REVIEW-security.md` 出力

**全レビュー通過後、`pnpm build` で最終確認。**

---

## Phase 2.8: ローカルQA

### 役割: QAテスター

`/qa` コマンドの手順に従い、ローカル環境でアプリの動作確認を行う。

1. dev サーバーを起動
2. 全ページのスクショ（デスクトップ + モバイル）を撮影・目視確認
3. APIエンドポイントがあれば正常系・異常系をcurlでテスト
4. 外部リンク（アフィリエイト等）の確認
5. OGP画像の確認

**ゲート: OK判定**
- NG（重大）→ 修正して再QA（最大2回）
- NG（軽微）→ 修正して続行（再QA不要）
- `QA-local.md` 出力

---

## Phase 3: リーガルチェック

### 役割: セキュリティエンジニア（リーガル兼任）

6項目チェック:
- 利用規約リンク（自動）/ プライバシーポリシー（自動）/ 外部API規約（LLM判定）
- RLS（自動）/ 商標リスク（常に「要確認」→人間通知）/ 特商法（LLM判定）

自動修正可能なもの（フッターリンク等）は修正。

**ゲート: 全Pass。「要確認」がある場合は人間に通知し、パイプラインは続行する。**
`REVIEW-legal.md` 出力。

---

## Phase 4: 公開

### 役割: フルスタックエンジニア

**サブドメイン名の決定**: SPEC.md のアプリ名から英語の短い名前を生成（例: `llm-cost`, `burnrate`）

以下を順番に実行:

1. `cd apps/app-{NNN} && vercel --yes && vercel --prod`
2. 環境変数セット（`.env.local` から読み取り）
3. ドメイン設定: `vercel domains add {subdomain}.southerncrosslab.com`
4. Supabase マイグレーション（DB使用時のみ）: `supabase db push`
5. 再デプロイ（環境変数反映）: `vercel --prod`
6. `apps/lab/app/page.tsx` の `apps` 配列にエントリ追加
7. ポータル再デプロイ: `cd apps/lab && vercel --prod`
8. `log/publish-log.md` に行追加
9. Discord Webhook 通知（`DISCORD_WEBHOOK_URL` がある場合）
10. Git コミット

**ゲート: デプロイ成功 + URL 200レスポンス + ポータル更新済み**

---

## Phase 4.5: 本番QA

### 役割: QAテスター

`/qa` コマンドの手順に従い、本番URLでアプリの動作確認を行う。

1. デプロイされたURLに対して全ページのスクショ撮影・目視確認
2. APIエンドポイントの正常系・異常系テスト
3. 外部リンク・アフィリエイトリンクの確認
4. OGP画像の確認（SNSシェア時の表示）

**ゲート: OK判定**
- NG（重大）→ 修正→再デプロイ→再QA（最大2回）
- NG（軽微）→ 修正→再デプロイして続行
- `QA-prod.md` 出力

---

## Phase 5: マーケティング

### 役割: マーケター

SPEC.md + 公開URL からPR文を生成:

**R1**: X投稿文（140字）/ Zenn記事ドラフト / Product Hunt テキスト / Discord詳細投稿を生成
**R2**: 4項目（フック・課題共感・価値提示・CTA）で自己評価。14点未満なら改善
**R3**: 最終スコアリング → `MARKETING.md` 出力

**ゲート: X投稿文のスコア ≥ 14/20**

**注意: PR文は人間が確認してから投稿。自動投稿しない。**

---

## 完了時の出力

パイプライン完了後、以下のサマリーを表示:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 パイプライン完了: app-{NNN} — {アプリ名}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 URL: https://{subdomain}.southerncrosslab.com

📊 スコア:
  Phase 1 計画:     {score}/30
  Phase 2 実装:     Pass
  Phase 2.5 レビュー:
    設計:           {score}/15
    UI/UX:          {score}/27
    セキュリティ:    Pass
  Phase 3 リーガル: Pass（要確認: {あれば記載}）
  Phase 4 公開:     Pass
  Phase 5 マーケ:   {score}/20
  ────────────
  総合:             {total}/108

📝 次のアクション:
  - [ ] MARKETING.md を確認してSNS投稿
  - [ ] 商標リスクを確認（J-PlatPat）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## SCORECARD 更新

全フェーズのスコアを `apps/app-{NNN}/SCORECARD.md` に記入してください。
