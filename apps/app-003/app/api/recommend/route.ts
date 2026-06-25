import Anthropic from "@anthropic-ai/sdk";
import { type NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
	}

	if (
		typeof body !== "object" ||
		body === null ||
		!Array.isArray((body as Record<string, unknown>).movies) ||
		!Array.isArray((body as Record<string, unknown>).moods)
	) {
		return NextResponse.json({ error: "不正なリクエストです" }, { status: 400 });
	}

	const { movies, moods } = body as { movies: unknown[]; moods: unknown[] };

	// 型・長さの検証（過大入力によるコスト攻撃を防止）
	const MAX_MOVIE_LENGTH = 100;
	const MAX_MOOD_LENGTH = 50;
	const MAX_ITEMS = 10;

	const validMovies = movies
		.slice(0, MAX_ITEMS)
		.filter((m): m is string => typeof m === "string")
		.map((m) => m.slice(0, MAX_MOVIE_LENGTH));

	const validMoods = moods
		.slice(0, MAX_ITEMS)
		.filter((m): m is string => typeof m === "string")
		.map((m) => m.slice(0, MAX_MOOD_LENGTH));

	const filteredMovies = validMovies.filter((m) => m.trim() !== "");
	if (filteredMovies.length === 0) {
		return NextResponse.json(
			{ error: "映画を1本以上入力してください" },
			{ status: 400 },
		);
	}

	const prompt = `あなたは映画ソムリエです。ユーザーの好きな映画と今の気分から、趣味傾向を分析し、おすすめ映画を3本提案してください。

## ユーザー情報
好きな映画: ${filteredMovies.join("、")}
今の気分: ${validMoods.length > 0 ? validMoods.join("、") : "特になし"}

## 出力形式（必ずこのJSON形式で返してください）
{
  "analysis": "あなたの趣味傾向の分析テキスト（2〜3文。「あなたは〜」で始める）",
  "recommendations": [
    {
      "title": "映画タイトル",
      "director": "監督名",
      "year": 2020,
      "genre": "ジャンル",
      "reason": "この映画をおすすめする理由（2〜3文。ユーザーの好みとの関連を含める）"
    }
  ]
}

注意:
- 必ず3本提案する
- ユーザーが挙げた映画と同じ映画は推薦しない
- 有名作だけでなく、知る人ぞ知る良作も混ぜる
- reasonは「あなたが○○を好きなら」のように、好みとの繋がりを具体的に説明する
- JSONのみ出力。前後に説明文を付けない`;

	try {
		const message = await client.messages.create({
			model: "claude-haiku-4-5-20251001",
			max_tokens: 1024,
			messages: [{ role: "user", content: prompt }],
		});

		const raw =
			message.content[0].type === "text" ? message.content[0].text : "";

		// ```json ... ``` で囲まれている場合を処理
		const text = raw.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
		const parsed = JSON.parse(text);

		return NextResponse.json(parsed);
	} catch (e) {
		console.error("recommend API error:", e);
		return NextResponse.json(
			{ error: "映画の推薦中にエラーが発生しました。もう一度お試しください。" },
			{ status: 500 },
		);
	}
}
