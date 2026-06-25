import Anthropic from "@anthropic-ai/sdk";
import { type NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json(
			{ error: "不正なリクエストです" },
			{ status: 400 },
		);
	}

	if (
		typeof body !== "object" ||
		body === null ||
		!Array.isArray((body as Record<string, unknown>).answers)
	) {
		return NextResponse.json(
			{ error: "不正なリクエストです" },
			{ status: 400 },
		);
	}

	const { answers } = body as { answers: unknown[] };

	const MAX_ANSWER_LENGTH = 500;
	const validAnswers = answers
		.slice(0, 3)
		.filter((a): a is string => typeof a === "string")
		.map((a) => a.slice(0, MAX_ANSWER_LENGTH));

	if (validAnswers.length !== 3 || validAnswers.some((a) => a.trim() === "")) {
		return NextResponse.json(
			{ error: "3つの質問すべてに回答してください" },
			{ status: 400 },
		);
	}

	const prompt = `あなたはライフコーチです。ユーザーの3つの回答から、その人の価値観・好み・後悔を読み取り、パーソナライズされた「死ぬまでにやりたいことリスト（バケットリスト）」を10個生成してください。

## ユーザーの回答
Q1「お金も時間も無限にあったら、明日何をする？」
→ ${validAnswers[0]}

Q2「人生で一番楽しかった瞬間は？」
→ ${validAnswers[1]}

Q3「死ぬ時に『あれやっておけばよかった』と思いそうなことは？」
→ ${validAnswers[2]}

## 出力形式（必ずこのJSON形式で返してください）
{
  "items": [
    {
      "emoji": "🌍",
      "title": "やりたいことのタイトル（短く）",
      "reason": "なぜこの人に合うかの一言理由（1文）"
    }
  ]
}

注意:
- 必ず10個生成する
- emojiは各項目に1つ、内容に合ったものを選ぶ
- titleは具体的かつ魅力的に（「旅行する」ではなく「北欧のオーロラの下でキャンプする」のように）
- reasonは「あなたが○○と感じているから」のように、回答との繋がりを示す
- 定番すぎるもの（「世界一周」等）だけでなく、意外性のあるものも混ぜる
- JSONのみ出力。前後に説明文を付けない`;

	try {
		const message = await client.messages.create({
			model: "claude-haiku-4-5-20251001",
			max_tokens: 2048,
			messages: [{ role: "user", content: prompt }],
		});

		const raw =
			message.content[0].type === "text" ? message.content[0].text : "";

		const text = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
		const parsed = JSON.parse(text);

		return NextResponse.json(parsed);
	} catch (e) {
		console.error("generate API error:", e);
		return NextResponse.json(
			{
				error: "リストの生成中にエラーが発生しました。もう一度お試しください。",
			},
			{ status: 500 },
		);
	}
}
