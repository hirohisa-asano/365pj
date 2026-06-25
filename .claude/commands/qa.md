# /qa — QAテスト（ローカル / 本番）

## あなたの役割

あなたは **QAテスター** です。
実際にアプリを動かし、ユーザー目線で動作確認を行います。
コードは読みません。画面とレスポンスだけで判断します。

## 入力

`$ARGUMENTS` を以下のいずれかで解釈:

1. **アプリディレクトリ名のみ**: `app-003` → ローカルQA（dev サーバーを起動してテスト）
2. **URL付き**: `app-003 https://filmpick.southerncrosslab.com` → 本番QA（URLに対してテスト）

## 手順

### ラウンド0: 準備

1. `apps/{アプリディレクトリ}/SPEC.md` を読み、以下を把握:
   - 何のアプリか
   - 画面構成（ページ一覧）
   - 機能要件（テストすべき項目）
   - 外部API を使っているか

2. **ローカルQAの場合**:
```bash
cd apps/{アプリディレクトリ}
pnpm install
kill $(lsof -ti:3000) 2>/dev/null
pnpm dev &
sleep 3
```
テスト対象URL: `http://localhost:3000`

3. **本番QAの場合**:
テスト対象URL: 引数で指定されたURL

### ラウンド1: 画面キャプチャ（全ページ）

SPEC.md の画面構成に記載された全ページのスクショを撮る。
**必ず `--wait-for-timeout 3000` をつけること**（JS hydration + アニメーション待ち）

```bash
# デスクトップ
npx playwright screenshot --browser chromium --full-page --wait-for-timeout 3000 {URL} /tmp/qa-desktop-top.png

# モバイル
npx playwright screenshot --browser chromium --full-page --viewport-size "375,812" --wait-for-timeout 3000 {URL} /tmp/qa-mobile-top.png

# サブページがあれば
npx playwright screenshot --browser chromium --full-page --wait-for-timeout 3000 {URL}/xxx /tmp/qa-desktop-xxx.png
```

各スクショを Read ツールで確認し、以下をチェック:

#### 視覚チェック項目
- [ ] ページが正しく表示されるか（白画面・崩れがないか）
- [ ] ダーク/ライトテーマが意図通りか
- [ ] テキストが読めるか（コントラスト）
- [ ] ボタン・リンクが視認できるか
- [ ] フッターが表示されているか
- [ ] モバイルで要素がはみ出していないか
- [ ] 画像・アイコンが正しく表示されるか

### ラウンド2: API テスト

SPEC.md で外部API（Claude API 等）を使っている場合、エンドポイントを直接テスト。

```bash
# 正常系
curl -s -X POST {URL}/api/{endpoint} \
  -H "Content-Type: application/json" \
  -d '{正常な入力データ}' | head -c 2000

# 異常系: 空入力
curl -s -X POST {URL}/api/{endpoint} \
  -H "Content-Type: application/json" \
  -d '{空・不正な入力データ}'

# 異常系: 過大入力
curl -s -X POST {URL}/api/{endpoint} \
  -H "Content-Type: application/json" \
  -d '{異常に長い入力データ}'
```

#### API チェック項目
- [ ] 正常系: 期待通りのレスポンスが返るか
- [ ] 正常系: レスポンスの構造が正しいか（必須フィールドがあるか）
- [ ] 正常系: 日本語が正しく表示されるか
- [ ] 異常系: 空入力で適切なエラーが返るか（400）
- [ ] 異常系: 不正入力で適切なエラーが返るか
- [ ] レスポンス時間が妥当か（10秒以内）

### ラウンド3: リンクチェック

```bash
# 外部リンクの存在確認（Amazonアフィリエイト等）
# コードから外部リンクパターンを抽出
grep -r "href=" apps/{アプリディレクトリ}/components/ apps/{アプリディレクトリ}/app/ \
  --include="*.tsx" | grep -v node_modules | grep -v "className"
```

#### リンクチェック項目
- [ ] 外部リンクが `target="_blank" rel="noopener noreferrer"` を持っているか
- [ ] アフィリエイトリンクのタグが正しいか（`tag=southerncro08-22`）
- [ ] ポータルリンクが正しいURLを指しているか
- [ ] 寄付リンク（Stripe）が設定されているか

### ラウンド4: OGP 確認

```bash
# OGP画像の生成確認
curl -s -o /tmp/qa-ogp.png {URL}/opengraph-image
file /tmp/qa-ogp.png
```

Read ツールで OGP 画像を確認:
- [ ] 画像が正しく生成されているか
- [ ] アプリ名が表示されているか
- [ ] サイズが 1200x630 か

### ラウンド5: パフォーマンス簡易チェック

```bash
# ページロード時間
time curl -s -o /dev/null -w "%{time_total}" {URL}

# ビルドサイズ確認（ローカルのみ）
pnpm build 2>&1 | grep -E "Route|○|ƒ|Size"
```

- [ ] ページロードが3秒以内か
- [ ] Static/Dynamic の区分が適切か

## 評価（OK / NG）

全チェック項目を集計し、以下で判定:

| 判定 | 基準 |
|------|------|
| **OK** | 全項目パス。デプロイ可能 |
| **NG（軽微）** | 視覚的な微調整のみ必要。修正後に再QA不要 |
| **NG（重大）** | 機能が動かない / API エラー / 画面崩壊。修正後に再QAが必要 |

## 出力

`apps/{アプリディレクトリ}/QA-{local|prod}.md`:

```markdown
# QA テスト結果 — {アプリ名}

## テスト環境
- 種別: ローカル / 本番
- URL: {テストURL}
- 日時: {実行日時}

## 判定: OK / NG（軽微） / NG（重大）

## 画面チェック
| ページ | デスクトップ | モバイル | 備考 |
|-------|:---------:|:------:|------|
| / | OK/NG | OK/NG | |

## APIチェック
| テスト | 結果 | 備考 |
|-------|:----:|------|
| 正常系 | OK/NG | |
| 異常系（空入力） | OK/NG | |

## リンクチェック
| リンク | 結果 | 備考 |
|-------|:----:|------|
| アフィリエイト | OK/NG | |
| ポータル | OK/NG | |

## OGP
| 項目 | 結果 |
|------|:----:|
| 画像生成 | OK/NG |
| アプリ名表示 | OK/NG |

## NG項目の詳細（NGの場合のみ）
1. {問題の説明} → {期待動作}
```

## dev サーバー停止（ローカルQAの場合）

```bash
kill $(lsof -ti:3000) 2>/dev/null
```

## SCORECARD 更新

`apps/{アプリディレクトリ}/SCORECARD.md` の該当セクションに結果を記入。
