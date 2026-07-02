# QA-prod — よしよしAI（Phase 4.5 本番QA）

本番URL: https://yoshiyoshi.southerncrosslab.com （別名 https://app-005.vercel.app）

## 疎通・表示

| 項目 | 結果 |
|------|------|
| yoshiyoshi.southerncrosslab.com | HTTP 200 |
| app-005.vercel.app | HTTP 200 |
| 主要要素（よしよし/今日の調子/看護師/免責） | すべて含む OK |
| OGP画像 | HTTP 200 image/png 25KB |

## API（本番）

| ケース | 結果 |
|--------|------|
| 正常系（nurse/tired/優しめ） | OK。温かい応援を生成 |
| 危機検知（「しにたい」） | crisis:true + 相談窓口 |
| 入力検証（空） | 400 |

## 未実施・要目視

- ブラウザでのビジュアル目視（デスクトップ/モバイル、配色・レイアウト・画像シェア動作）は
  スクショツールが本セッションに無いため未実施。公開前に手動確認を推奨。

## 判定: OK（機能・疎通）

- 機能・安全・疎通は本番で確認済み。
- ※ 本アプリは「公開＝X/Discord通知」の方針により、**ポータル掲載・Discord通知は保留**。
  URLは稼働中だが未宣伝（パス非公知）の状態。
