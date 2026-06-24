# マーケティング — app-002 副業バレリスク診断

## X（Twitter）投稿文

### メイン投稿（140字）
副業、会社にバレるかも？🛡️

「副業バレリスク診断」を作りました。

3つの質問に答えるだけで
✅ バレる確率（0-100%）
✅ バレるルート（住民税・社保・SNS）
✅ 具体的な対策リスト
がわかります。

完全無料・登録不要👇
https://fukugyo-check.southerncrosslab.com

### スレッド投稿①
なぜ作ったか？

副業者800万人超の時代。
でも「バレるか」を自分の状況に合わせて診断できるツールがなかった。

記事は大量にあるけど、
・就業規則が禁止？許可制？
・副業の種類は？
・住民税の普通徴収してる？

これ全部聞いて判定してくれるものがない。
だから作った。

### スレッド投稿②
技術的なこだわり：

・AI API不使用（ルールベース判定）
・サーバー通信ゼロ
・入力データは一切保存しない

副業の情報はセンシティブ。
だからクライアントサイド完結にした。
あなたのデータはあなたのブラウザの中だけ。

---

## Zenn記事ドラフト

### タイトル
「副業バレリスク診断」を個人開発した — 競合ゼロの穴を見つけて3日で作った話

### 構成
1. なぜ作ったか（800万人の副業者 × 診断ツールゼロ）
2. 競合調査の結果（税額シミュレーターはあるが「バレるか」はない）
3. 技術スタック（Next.js + Tailwind / AI不要 / クライアント完結）
4. スコア算出ロジックの設計
5. バイラル設計（SNSシェアボタン + OGP）
6. リリースと反応

---

## Product Hunt テキスト

**Tagline**: Check if your side job will be discovered by your employer

**Description**:
A free diagnostic tool for Japanese workers with side jobs. Answer 3 simple questions about your employment rules, side job type, and tax situation — get an instant risk score (0-100%) with specific routes your employer might discover your side job and actionable countermeasures.

No registration, no AI API, no data stored. Everything runs in your browser.

---

## Discord 詳細投稿

🛡️ **新作リリース: 副業バレリスク診断**

副業が会社にバレるリスクを3つの質問で診断するツールを作りました！

🔗 https://fukugyo-check.southerncrosslab.com

**特徴**
- バレリスク 0-100% のスコア表示
- 住民税・社保・SNS・マイナンバーの4ルート分析
- 対策チェックリスト付き
- 確定申告の要否判定
- 完全無料・登録不要・データ保存なし

**技術**
- Next.js 15 / Tailwind CSS
- AI API不使用（ルールベース判定）
- クライアントサイド完結

副業やってる方、ぜひ試してみてください！
フィードバックもお待ちしています 🙏

---

## 自己評価

| 観点 | スコア | 理由 |
|------|--------|------|
| フック（興味を引く導入） | 5/5 | 「バレるかも？」は強いフック |
| 課題共感 | 4/5 | 800万人の副業者という数字で規模感を伝達 |
| 価値提示 | 4/5 | 3つの質問で具体的な結果が得られることを明示 |
| CTA（行動喚起） | 4/5 | URL + 無料・登録不要を明記 |
| **合計** | **17/20 — Pass** | |
