# 承認済み外部サービス一覧

> このファイルに記載されたサービスはパイプラインで使用可能。
> 新しいサービスを追加する場合はこのファイルにエントリを追加する。

---

## ティア説明

| ティア | 説明 | APIキー | パイプラインでの扱い |
|-------|------|---------|-------------------|
| **Tier 0** | ブラウザAPI。キー不要。全アプリで自由に使える | 不要 | 制限なし |
| **Tier 1** | 既にプロジェクトで使用中のサービス | 設定済み | 制限なし |
| **Tier 2** | 無料枠が十分なサービス。キーを1回取得すれば全アプリで共有 | 要取得（1回） | SPECに記載すれば使用可 |
| **Tier 3** | 新規契約/有料が必要なサービス | 都度判断 | 人間の承認が必要 |

---

## Tier 0: ブラウザAPI（キー不要）

| API | 用途 | パッケージ | 備考 |
|-----|------|-----------|------|
| **Geolocation API** | 現在地取得 | なし（ブラウザ内蔵） | `navigator.geolocation` |
| **MediaDevices API** | カメラ・マイク | なし | `navigator.mediaDevices.getUserMedia()` |
| **Canvas API** | 画像加工・描画 | なし | リサイズ、フィルタ、テキスト合成 |
| **Web Audio API** | 音声処理 | なし | 録音・再生・エフェクト |
| **SpeechRecognition** | 音声→テキスト | なし | ブラウザ内蔵。Chrome/Edge対応 |
| **SpeechSynthesis** | テキスト→音声 | なし | ブラウザ内蔵 |
| **Clipboard API** | コピー&ペースト | なし | `navigator.clipboard` |
| **Share API** | OS共有ダイアログ | なし | `navigator.share()` モバイル対応 |
| **Notification API** | プッシュ通知 | なし | ブラウザ通知 |
| **localStorage/IndexedDB** | ローカル保存 | なし | ユーザーデータのオフライン保存 |

---

## Tier 1: プロジェクト既存サービス

| サービス | 用途 | 環境変数 | 無料枠 |
|---------|------|---------|-------|
| **Supabase** | DB・Auth・Storage・Edge Functions | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | 500MB DB, 1GB Storage, 50k Auth users |
| **Claude API** | AI推論 | `ANTHROPIC_API_KEY` | 従量課金 |
| **Vercel** | ホスティング・Analytics | （自動） | 100GB帯域/月 |
| **Stripe** | 寄付リンク | `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | 設定済み |

### Supabase Storage 使用パターン

```typescript
// アップロード
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`${userId}/${fileName}`, file);

// 公開URLの取得
const { data: { publicUrl } } = supabase.storage
  .from('bucket-name')
  .getPublicUrl(filePath);
```

バケット作成は Supabase ダッシュボードで行うか、マイグレーションで定義する。

---

## Tier 2: 承認済み外部サービス（キー取得1回で全アプリ共有）

### 地図・地理

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **Leaflet + OpenStreetMap** | 地図表示 | `leaflet`, `react-leaflet` | 不要 | 無制限 | パッケージ追加のみ |
| **Mapbox** | 地図・衛星画像・ジオコーディング・ナビ | `mapbox-gl`, `react-map-gl` | `NEXT_PUBLIC_MAPBOX_TOKEN` | 50k loads/月, 100k geocoding/月 | https://account.mapbox.com/ |
| **国土地理院タイル** | 日本の地形図・航空写真 | Leaflet経由 | 不要 | 無制限 | タイルURL指定のみ |

#### Leaflet 基本パターン
```tsx
"use client";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

<MapContainer center={[35.68, 139.76]} zoom={13} className="h-[400px] w-full rounded-lg">
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  <Marker position={[35.68, 139.76]} />
</MapContainer>
```

#### 国土地理院タイル（日本特化）
```
標準地図: https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png
航空写真: https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg
淡色地図: https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png
```

### 画像・メディア

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **Cloudinary** | 画像最適化・変換・CDN | `cloudinary` | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | 25GB storage, 25k transformations/月 | https://cloudinary.com/console |
| **Unsplash** | ストック写真 | `unsplash-js` | `UNSPLASH_ACCESS_KEY` | 50 req/時 | https://unsplash.com/developers |

### 天気・環境

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **OpenWeatherMap** | 天気・気温・風速 | なし（fetch） | `OPENWEATHERMAP_API_KEY` | 1,000 calls/日 | https://openweathermap.org/api |
| **Open-Meteo** | 天気予報・過去データ | なし（fetch） | 不要 | 無制限（非商用） | APIキー不要 |

### コミュニケーション

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **Resend** | メール送信 | `resend` | `RESEND_API_KEY` | 3,000通/月 | https://resend.com/signup |

### 翻訳・言語

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **DeepL API Free** | テキスト翻訳 | なし（fetch） | `DEEPL_API_KEY` | 500k文字/月 | https://www.deepl.com/pro-api |
| **Google Translate（非公式）** | 翻訳 | `google-translate-api-x` | 不要 | 制限あり | パッケージ追加のみ |

### データ・検索

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **Wikipedia API** | 知識取得 | なし（fetch） | 不要 | 無制限 | REST API |
| **楽天API** | 商品検索・レシピ | なし（fetch） | `RAKUTEN_APP_ID` | 制限緩い | https://webservice.rakuten.co.jp/ |
| **OpenBD** | 書籍情報（ISBN→書誌） | なし（fetch） | 不要 | 無制限 | https://openbd.jp/ |
| **RESAS API** | 地域経済データ（人口・産業） | なし（fetch） | `RESAS_API_KEY` | 無制限 | https://opendata.resas-portal.go.jp/ |
| **e-Stat API** | 政府統計データ | なし（fetch） | `ESTAT_APP_ID` | 無制限 | https://www.e-stat.go.jp/api/ |

### コード・スキャン

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **html5-qrcode** | QRコード読み取り | `html5-qrcode` | 不要 | 無制限 | パッケージ追加のみ |
| **qrcode** | QRコード生成 | `qrcode` | 不要 | 無制限 | パッケージ追加のみ |
| **Tesseract.js** | OCR（画像→テキスト） | `tesseract.js` | 不要 | 無制限（クライアントサイド） | パッケージ追加のみ |

### チャート・可視化

| サービス | 用途 | パッケージ | 環境変数 | 無料枠 | セットアップ |
|---------|------|-----------|---------|-------|------------|
| **Recharts** | グラフ・チャート | `recharts` | 不要 | 無制限 | パッケージ追加のみ |
| **D3.js** | 高度なデータ可視化 | `d3` | 不要 | 無制限 | パッケージ追加のみ |

---

## Tier 3: 要承認（使いたい場合は人間に確認）

以下のようなサービスは、使用前に人間の承認を求めること:

- 月額課金が発生するサービス
- 個人情報を外部送信するサービス
- 利用規約で商用利用に制限があるサービス
- このリストに記載されていない新規サービス

承認された場合、このファイルの Tier 2 に追加する。

---

## サービス追加手順

新しいサービスを承認済みリストに追加する場合:

1. このファイルの該当カテゴリに行を追加
2. 環境変数が必要な場合:
   - `apps/template/.env.example` に追加
   - Vercel プロジェクト設定にキーを登録
3. パッケージが必要な場合: アプリごとに `pnpm add` する（テンプレートには追加しない）
