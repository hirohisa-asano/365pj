// 危機（希死念慮・自傷）ワード検知と相談窓口データ。
// 検知時は応援メッセージを生成せず、必ず相談窓口を案内する。
// メンタルヘルス文脈のため、取りこぼしを減らす方向（誤検知よりも見逃さない）で設計。

// カタカナ→ひらがな正規化 + 全角スペース/記号/空白除去 + 小文字化
function normalize(text: string): string {
	const hira = text.replace(/[ァ-ヶ]/g, (ch) =>
		String.fromCharCode(ch.charCodeAt(0) - 0x60),
	);
	return hira.toLowerCase().replace(/[\s　・。、,.!！?？ー〜]/g, "");
}

// 正規化後（ひらがな）で部分一致させるパターン
const CRISIS_PATTERNS = [
	"しにたい",
	"しんでしまいたい",
	"しのう",
	"きえたい",
	"きえてしまいたい",
	"いなくなりたい",
	"いきていたくない",
	"いきてるいみ",
	"いきるいみ",
	"じさつ",
	"くびをつ",
	"りすとかっと",
	"りすかしたい",
	"てくびをきり",
	"てくびをきっ",
	"おーばーどーず",
	"とびおり",
	"ころして",
	"むりしんじゅう",
];

export function isCrisis(text: string): boolean {
	const n = normalize(text);
	return CRISIS_PATTERNS.some((p) => n.includes(p));
}

export const CRISIS_RESOURCES = [
	{
		name: "いのちの電話",
		detail: "0120-783-556（毎日16:00〜21:00 / 無料）",
		tel: "0120783556",
	},
	{
		name: "よりそいホットライン",
		detail: "0120-279-338（24時間 / 無料）",
		tel: "0120279338",
	},
	{
		name: "こころの健康相談統一ダイヤル",
		detail: "0570-064-556（つながる公的窓口）",
		tel: "0570064556",
	},
];

export const CRISIS_MESSAGE =
	"つらい気持ちを打ち明けてくれてありがとう。いまとても苦しいのかもしれません。ここは応援だけのアプリなので、あなたの話をちゃんと聞いてくれる人につながってほしいです。下の窓口は無料で、あなたの味方です。";
