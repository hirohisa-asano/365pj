# 設計レビュー — よしよしAI (app-005)

レビュー日: 2026-07-02
レビュー種別: アーキテクチャレビュー（Phase 2.5）
対象: `apps/app-005/`

## スコア表

| # | 観点 | 点数 (0-3) | 要旨 |
|---|------|-----------|------|
| 1 | SPEC整合性（機能要件1〜10） | 3 | 要件1〜10はすべて実装済み。ただし「結果画面への免責表示」（安全設計・最重要）が欠落 |
| 2 | コンポーネント分割 | 3 | Picker/Card系が単一責務でよく分離。dead code（motion.tsxの未使用export, `cardRef`）が残る |
| 3 | データフロー | 2 | API契約は一貫。ただし認証状態の二重取得＋レート制限がクライアント任せ（サーバー未強制）の設計弱点 |
| 4 | SSG/SSR選択 | 3 | layoutの認証取得で全体がdynamic化。AuthHeader要件上は妥当。ただし冗長な再取得が残る |
| 5 | 依存パッケージ | 3 | 過不足・重複なし。全依存が使用されている |
| **合計** | | **14 / 15** | 0点項目なし・10点以上のため総合「合格（軽微な修正推奨）」 |

---

## 観点別詳細

### 1. SPEC整合性（機能要件1〜10）— 3点

機能要件のトレース結果:

| 要件 | 実装箇所 | 判定 |
|------|---------|------|
| 1 人格プリセット（プラン別制限） | `components/persona-picker.tsx`, `lib/personas.ts`（premiumフラグ）, `app/page.tsx:182-186` | OK |
| 2 トーンスライダー（プラン別段階） | `components/tone-slider.tsx`, `lib/tones.ts`（FREE_TONE_LEVELS）, `app/page.tsx:187-191` | OK |
| 3 調子＋入力で生成・低調子は優しめに寄せる | `components/mood-picker.tsx`, `lib/moods.ts`（maxTone）, `app/api/cheer/route.ts:57-58` | OK |
| 4 未ログイン1日3回（localStorage） | `app/page.tsx:34-54, 96-101, 127` | OK（ただし後述の弱点あり） |
| 5 危機ワード検知→相談窓口 | `lib/crisis.ts`, `app/api/cheer/route.ts:46-52`, `components/crisis-card.tsx` | OK |
| 6 画像化して保存/シェア（Canvas） | `components/cheer-card.tsx:13-114` | OK |
| 7 クリップボードコピー | `components/cheer-card.tsx:84-88` | OK |
| 8 応援ログを端末保存・見返す | `app/page.tsx:128-142, 288-318` | OK |
| 9 サポーターのカスタム人格 | `app/page.tsx:193-207, 117`, `route.ts:59-62,76` | OK |
| 10 医療目的でない旨の免責 | `app/page.tsx:242-246` | OK |

**指摘 1-A（軽微・安全設計）**: SPEC「安全設計」に「画面下部と**結果に**『医療・治療を目的としたサービスではありません』の免責を明記」とあるが、結果表示（`components/cheer-card.tsx`）に免責文がない。免責は入力フォーム（`app/page.tsx:242-246`）にのみ存在し、結果表示に切り替わると画面から消える。SPECが「最重要」とする安全設計の一部が未達。
→ 提案: `cheer-card.tsx` のカード下部、または `page.tsx` の結果ブロック（`message && !crisis`, 275行付近）に免責の一文を追加する。

### 2. コンポーネント分割 — 3点

- `MoodPicker` / `PersonaPicker` / `ToneSlider` / `CheerCard` / `CrisisCard` がそれぞれ単一責務で分離され、propsも最小限。表示用データ（label/emoji）は `lib/*.ts` に集約、生成用プロンプトも同ファイルにまとまっており、クライアント/サーバーで同じソースを共有できている点が良い。
- Canvas描画（`drawCard`）が `CheerCard` 内にインラインだが、規模（数百行以内目安）を考えれば許容範囲。

**指摘 2-A（軽微・dead code）**: `components/motion.tsx` はテンプレート（診断系アプリ）由来で、`FadeInView` / `Stagger` / `StaggerItem` / `CountUp` / `CountUpInner` / `ScoreReveal` / `PressScale` が本アプリで未使用（実際に使うのは `FadeIn` のみ、`app/page.tsx:8`）。コメントにも「診断結果」「診断スコア」等、本アプリと無関係な記述が残る。
→ 提案: 未使用exportを削除して `FadeIn` のみ残す（バンドル・可読性向上）。

**指摘 2-B（軽微・dead code）**: `components/cheer-card.tsx:82` の `cardRef` は宣言・`ref` 付与（119行）されているが `drawCard` は `document.createElement("canvas")` を使うため一度も参照されない。
→ 提案: `cardRef` を削除。

### 3. データフロー — 2点

API契約自体は一貫している:
- `/api/auth-check` → `{ loggedIn, isMember }`、`page.tsx:77-78` で正しく消費。
- `/api/cheer` → `{ crisis:true, message, resources }` / `{ crisis:false, message }`、`page.tsx:123-126` で分岐消費。整合。

**指摘 3-A（中・冗長な二重取得）**: 認証・メンバーシップ状態が2経路で取得されている。
- `app/layout.tsx:27-41`（SSR、AuthHeader用）
- `app/page.tsx:71-83`（クライアントから `/api/auth-check`、本文UI用）

layoutが既にサーバー側で `user` と `isMember` を保持しているのに、`page` は別ルート（クライアントコンポーネント）のため受け取れず、同じ情報を再フェッチしている。初回描画後に認証状態が確定するため、UIが「未ログイン前提→ログイン反映」でちらつく余地もある。
→ 提案: 認証状態を Server Component（例: `page` をServer化し初期stateをClientへprops渡し、または layout で Context Provider を用意）から渡し、`/api/auth-check` の往復を無くす。テンプレ制約で難しければ現状維持でも動作はするが、冗長性は残る。

**指摘 3-B（中・レート制限がクライアント任せ）**: 「未ログイン1日3回」制限は `page.tsx` の localStorage チェック（96-101, 127行）のみで、`/api/cheer` 側に一切の回数・認証チェックがない。localStorage クリアや API 直叩きで無制限にバイパス可能で、Claude API のコストが未認証ユーザーに対して無制限に露出する。SPECのプラン設計（minimum=1日3回）の実効性も担保されない。
→ 提案: SPECが「DBを使わない」方針のため厳密なサーバー集計は難しいが、少なくとも (a) `/api/cheer` で危機検知の後にIP等ベースの簡易レート制限（例: メモリ/Upstash等はTier確認要）を検討、または (b) 未ログイン利用に上限を設ける旨をSPEC/実装で明示し、コスト露出をドキュメント化する。最低限、脆弱性として認識・記録すべき。

### 4. SSG/SSR選択 — 3点

- SPECは「レンダリング: SSG（インタラクションはCSR）」だが、`app/layout.tsx` が `async` Server Component で `supabase.auth.getUser()` を呼ぶため、全ルートが動的（SSR）になる。これは「認証（AuthHeader）は全アプリ共通・削除しない」というプロジェクト規約に沿った標準トレードオフであり、**妥当**。本文（`page.tsx`）は `"use client"` で完全CSR、生成はAPI経由という構成もSPEC意図に合致。
- 減点要素は指摘3-Aの通り、SSRで取得済みの認証情報を活かさずクライアントで再取得している点（SSRの利点を一部殺している）。設計選択そのものは妥当なため3点だが、3-Aを解消すればSSRの価値を活かせる。

### 5. 依存パッケージ — 3点

`package.json` の依存はすべて使用されており、過不足・重複なし:
- `@anthropic-ai/sdk`（cheer API）、`@supabase/ssr`＋`@supabase/supabase-js`（認証、役割分担ありで重複ではない）、`@vercel/analytics`（layout）、`lucide-react`（各所アイコン）、`motion`（FadeIn）、`next`/`react`/`react-dom`。
- 未使用の重量級依存なし。`motion` はFadeInのみの利用だが、テンプレ共通アニメ基盤として許容。

---

## 総評

全体として、SPECの機能要件1〜10を漏れなく実装し、コンポーネント分割・API契約も明快な良好な設計。テンプレートの規約（共通AuthHeader、SSG＋CSR、Supabase認証のみ）にも準拠している。

合計 **14/15点**、0点項目なし・10点以上のため **総合「合格（軽微な修正推奨）」**。

ブロッカーはないが、優先度順に以下の対応を推奨:
1. **（安全設計・最優先）** 結果画面への免責表示追加（指摘1-A）— SPECが「最重要」とする安全設計の未達分。
2. **（コスト/悪用対策）** `/api/cheer` のサーバー側レート制限の検討、または未対策のリスク明記（指摘3-B）。
3. 認証状態の二重取得解消（指摘3-A）。
4. dead code整理（指摘2-A / 2-B）。
