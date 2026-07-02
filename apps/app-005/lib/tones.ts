// 応援の熱量（トーン）5段階。level 1=とことん優しい 〜 5=激強め。

export type Tone = {
	level: number;
	label: string;
	prompt: string;
};

export const TONES: Tone[] = [
	{
		level: 1,
		label: "とことん優しく",
		prompt:
			"最大限やわらかく、受容と肯定に徹してください。行動は一切求めず、存在そのものを認める言葉を。",
	},
	{
		level: 2,
		label: "優しめ",
		prompt:
			"やわらかく、あたたかく肯定してください。まずは安心させることを最優先に。",
	},
	{
		level: 3,
		label: "ふつう",
		prompt: "自然体で、素直にねぎらい肯定してください。",
	},
	{
		level: 4,
		label: "ちょっと強め",
		prompt:
			"少し熱を込めて、明るく元気づけてください。前向きなエネルギーを分けるように。",
	},
	{
		level: 5,
		label: "激強め",
		prompt:
			"熱量マックスで背中を強く押してください。ただし絶対に人格否定・暴言・皮肉はせず、あくまで愛のある熱い肯定で鼓舞すること。",
	},
];

// 未ログイン時に使える2段階（優しめ / 強め）
export const FREE_TONE_LEVELS = [2, 4];

export function getTone(level: number): Tone {
	return TONES.find((t) => t.level === level) ?? TONES[2];
}
