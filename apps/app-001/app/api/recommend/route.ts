import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(request: Request) {
	try {
		const { favorites, mood, freeText } = await request.json();

		if (!favorites || !Array.isArray(favorites) || favorites.length === 0) {
			return NextResponse.json(
				{ error: "好きな漫画を1つ以上入力してください" },
				{ status: 400 },
			);
		}

		const prompt = `あなたは漫画に詳しいレコメンドAIです。ユーザーの好みに合う漫画を5作品提案してください。

## ユーザーの好み
- 好きな漫画: ${favorites.join("、")}
${mood ? `- 今の気分・読みたい雰囲気: ${mood}` : ""}
${freeText ? `- 追加の好み: ${freeText}` : ""}

## 出力形式
以下のJSON配列で返してください。説明は日本語で。
[
  {
    "title": "漫画タイトル",
    "author": "作者名",
    "genre": "ジャンル",
    "reason": "この漫画をおすすめする理由（2-3文）"
  }
]

JSONのみを返してください。マークダウンのコードブロックは不要です。`;

		const response = await fetch("https://api.anthropic.com/v1/messages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": process.env.ANTHROPIC_API_KEY!,
				"anthropic-version": "2023-06-01",
			},
			body: JSON.stringify({
				model: "claude-haiku-4-5-20251001",
				max_tokens: 1024,
				messages: [{ role: "user", content: prompt }],
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error("Anthropic API error:", error);
			return NextResponse.json(
				{ error: "AIからの応答に失敗しました" },
				{ status: 500 },
			);
		}

		const data = await response.json();
		const text = data.content[0].text;

		const recommendations = JSON.parse(text);

		return NextResponse.json({ recommendations });
	} catch (err) {
		console.error("Recommend error:", err);
		return NextResponse.json(
			{ error: "リクエストの処理に失敗しました" },
			{ status: 500 },
		);
	}
}
