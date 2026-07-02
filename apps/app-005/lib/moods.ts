// 今日の調子（気力メーター）。応援の前にまず今日のコンディションを尋ねる。
// 調子が低いほど応援トーンを優しめに寄せるためのヒントを持つ。

export type Mood = {
	id: string;
	label: string;
	emoji: string;
	// この調子のときに推奨する最大トーン（これより強くしない安全弁）
	maxTone: number;
	prompt: string;
};

export const MOODS: Mood[] = [
	{
		id: "good",
		label: "げんき",
		emoji: "🙂",
		maxTone: 5,
		prompt: "今日は比較的元気そうです。",
	},
	{
		id: "normal",
		label: "ふつう",
		emoji: "😐",
		maxTone: 5,
		prompt: "今日はふつうの調子のようです。",
	},
	{
		id: "tired",
		label: "しんどい",
		emoji: "😔",
		maxTone: 3,
		prompt:
			"今日はしんどい状態です。強く鼓舞するより、まずやわらかく受け止めてください。",
	},
	{
		id: "empty",
		label: "げきしんどい",
		emoji: "😢",
		maxTone: 2,
		prompt:
			"今日はとても消耗しています。励ますより、ただ寄り添い、休むことを肯定してください。行動は絶対に求めないこと。",
	},
];

export function getMood(id: string): Mood {
	return MOODS.find((m) => m.id === id) ?? MOODS[1];
}
