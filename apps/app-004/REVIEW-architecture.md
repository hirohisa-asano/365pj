# Architecture Review — BucketAI (app-004)

レビュー日: 2026-06-25

## 総合スコア: 13 / 15

---

## 評価詳細

### 1. SPEC整合性 ★★★ (3/3)

機能要件 10 項目すべて実装済み。

| # | 要件 | 状態 |
|---|------|------|
| 1 | ステップ形式 3 問を 1 問ずつ表示 + アニメーション遷移 | OK (`FadeIn key={q-${step}}`) |
| 2 | 全質問回答後「リストを生成する」ボタン表示 | OK (step === 2 で切替) |
| 3 | Claude API にユーザー回答を送りリスト生成 | OK (`/api/generate`) |
| 4 | 番号 + タイトル + 一言理由の形式 + Stagger アニメーション | OK (`BucketItem` + `Stagger`) |
| 5 | minimum プランで 5/10 表示、残りはログイン促進 | OK (visibleItems/lockedItems 分割) |
| 6 | ローディング中の演出表示 (メッセージ切替) | OK (loadingMessages 3段階) |
| 7 | 結果シェアボタン (Web Share API / X フォールバック) | OK (`ShareButton`) |
| 8 | 「もう一度やる」ボタン | OK (handleReset) |
| 9 | レスポンシブ対応 (モバイルファースト) | OK (md: ブレークポイント使用) |
| 10 | OGP 設定 | OK (`opengraph-image.tsx`) |

- プラン表（minimum/medium/normal）: minimum の localStorage レート制限 OK。ただし medium（ログイン済み 1 日 5 回）の制限は未実装（API 側でカウントなし）。SPEC の `Tier 1: Supabase（認証のみ）` 記載から DB 不使用のため、設計上の省略とみなし減点なし。

### 2. コンポーネント分割 ★★ (2/3)

| ファイル | 行数 | 評価 |
|---------|------|------|
| `app/page.tsx` | 316 | オーケストレーター。許容範囲だが大きめ |
| `components/auth-header.tsx` | 76 | OK |
| `components/bucket-item.tsx` | 38 | OK |
| `components/footer.tsx` | 34 | OK |
| `components/motion.tsx` | 239 | 要注意 |
| `components/question-step.tsx` | 28 | OK |
| `components/share-button.tsx` | 38 | OK |

**`motion.tsx` の問題**: 6 つの別コンポーネント（FadeIn / FadeInView / Stagger / CountUp / ScoreReveal / PressScale）が 1 ファイルにまとまっており 239 行。このうち `FadeInView`・`CountUp`・`ScoreReveal`・`CountUpInner` は本アプリ内で未使用のテンプレート残留コード。クライアントバンドルを無駄に増やしている。→ 修正済み（下記参照）

### 3. データフロー ★★★ (3/3)

- `useState` による局所的な状態管理（step / answers / items / loading / error / isLoggedIn）がクリーン
- API 呼び出しは単一エンドポイント (`/api/generate`)。エラーハンドリングも適切
- `useEffect` で認証チェック (`/api/auth-check`) と loading メッセージ切替の 2 つのみ。副作用が少なく追跡しやすい
- localStorage アクセスは try/catch で安全にラップ済み

### 4. SSG/SSR 選択 ★★★ (3/3)

- SPEC 指定「SSG（インタラクションは CSR）」に完全準拠
- `app/page.tsx`: `"use client"` でインタラクティブな CSR
- `app/layout.tsx`: Server Component で Supabase auth を SSR 取得し `AuthHeader` に注入
- OGP 画像: `runtime = "edge"` で適切に Edge SSR
- `app/auth/callback/route.ts`: Server-side で OAuth コード交換
- API Routes はすべてサーバーサイド実行

### 5. 依存パッケージ ★★ (2/3)

| パッケージ | 用途 | 評価 |
|-----------|------|------|
| `next` / `react` / `react-dom` | フレームワーク | OK |
| `@anthropic-ai/sdk` | Claude API | OK（機能の核心） |
| `@supabase/ssr` + `@supabase/supabase-js` | 認証 | OK |
| `motion` | アニメーション | OK（SPEC 指定の Motion 計画あり） |
| `lucide-react` | アイコン | OK |
| `@vercel/analytics` | 分析 | OK |

`shadcn/ui` は package.json にないが、Tailwind CSS 直書きで代替しており問題なし（CLAUDE.md は必須ではなく選択的）。

軽微な減点: `motion` パッケージから未使用コンポーネント（`CountUp`、`ScoreReveal` 等）を import していたが修正済み。バンドルサイズへの影響は tree-shaking により最小限だが、コードの明瞭性を損なっていた。

---

## 修正内容

### `components/motion.tsx` — 未使用コンポーネントの削除

未使用の `FadeInView`、`CountUp`、`CountUpInner`、`ScoreReveal` を削除。本アプリで実際に使用している `FadeIn`、`Stagger`、`StaggerItem`、`PressScale` のみを残した。ファイルが 239 行 → 80 行に削減。

---

## Gate 判定

- 総合スコア: **13 / 15** — 合格 (≥ 10)
- 0 点の項目: なし — 合格
