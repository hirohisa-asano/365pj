import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

function getStripe() {
	return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function POST() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	// 既存メンバーかチェック
	const { data: membership } = await supabase
		.from("memberships")
		.select("status")
		.eq("user_id", user.id)
		.eq("status", "active")
		.single();

	if (membership) {
		return NextResponse.json(
			{ error: "Already a member" },
			{ status: 400 },
		);
	}

	const stripe = getStripe();
	const session = await stripe.checkout.sessions.create({
		mode: "subscription",
		payment_method_types: ["card"],
		line_items: [
			{
				price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
				quantity: 1,
			},
		],
		success_url: `${process.env.NEXT_PUBLIC_PORTAL_URL}/?membership=success`,
		cancel_url: `${process.env.NEXT_PUBLIC_PORTAL_URL}/?membership=canceled`,
		metadata: {
			user_id: user.id,
		},
		customer_email: user.email,
	});

	return NextResponse.json({ url: session.url });
}
