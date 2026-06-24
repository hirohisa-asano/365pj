import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const APP_ID = "app-001";
const LIMIT_GUEST = 3;
const LIMIT_LOGIN = 10;
// メンバーは無制限

export async function POST(request: Request) {
	try {
		const { favorites, mood, freeText, guestCount } = await request.json();

		if (!favorites || !Array.isArray(favorites) || favorites.length === 0) {
			return NextResponse.json(
				{ error: "好きな漫画を1つ以上入力してね" },
				{ status: 400 },
			);
		}

		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		// 利用制限チェック
		if (!user) {
			// 未ログイン: クライアント側のカウントを信頼（サーバー検証はしない）
			if (typeof guestCount === "number" && guestCount >= LIMIT_GUEST) {
				return NextResponse.json(
					{ error: "limit", limitType: "login", message: "続けるにはログインが必要です" },
					{ status: 403 },
				);
			}
		} else {
			// メンバーチェック
			const { data: membership } = await supabase
				.from("memberships")
				.select("status")
				.eq("user_id", user.id)
				.eq("status", "active")
				.single();

			if (!membership) {
				// 非メンバー: DBで回数チェック
				const today = new Date().toISOString().split("T")[0];
				const { data: usage } = await supabase
					.from("usage_counts")
					.select("count")
					.eq("user_id", user.id)
					.eq("app_id", APP_ID)
					.eq("date", today)
					.single();

				const currentCount = usage?.count ?? 0;

				if (currentCount >= LIMIT_LOGIN) {
					return NextResponse.json(
						{ error: "limit", limitType: "member", message: "本日の利用上限に達しました。メンバーになると無制限で使えます" },
						{ status: 403 },
					);
				}

				// カウント更新
				await supabase.from("usage_counts").upsert(
					{
						user_id: user.id,
						app_id: APP_ID,
						date: today,
						count: currentCount + 1,
					},
					{ onConflict: "user_id,app_id,date" },
				);
			}
			// メンバーは制限なし
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
