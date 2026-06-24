import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

function getStripe() {
	return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// Webhook ではサービスロールキーを使う（RLS をバイパスして書き込む）
function createAdminClient() {
	return createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
	);
}

export async function POST(request: Request) {
	const body = await request.text();
	const signature = request.headers.get("stripe-signature");

	if (!signature) {
		return NextResponse.json({ error: "No signature" }, { status: 400 });
	}

	const stripe = getStripe();
	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!,
		);
	} catch {
		return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
	}

	const supabase = createAdminClient();

	switch (event.type) {
		case "checkout.session.completed": {
			const session = event.data.object as Stripe.Checkout.Session;
			const userId = session.metadata?.user_id;
			if (!userId) break;

			await supabase.from("memberships").upsert(
				{
					user_id: userId,
					stripe_customer_id: session.customer as string,
					stripe_subscription_id: session.subscription as string,
					status: "active",
					plan: "member",
				},
				{ onConflict: "stripe_customer_id" },
			);
			break;
		}

		case "customer.subscription.updated": {
			const subscription = event.data.object as Stripe.Subscription;
			const status = subscription.cancel_at_period_end
				? "canceled"
				: subscription.status === "past_due"
					? "past_due"
					: "active";

			const periodEnd = (subscription as unknown as Record<string, unknown>).current_period_end;
			const updateData: Record<string, unknown> = { status };
			if (typeof periodEnd === "number") {
				updateData.current_period_end = new Date(periodEnd * 1000).toISOString();
			}

			await supabase
				.from("memberships")
				.update(updateData)
				.eq("stripe_subscription_id", subscription.id);
			break;
		}

		case "customer.subscription.deleted": {
			const subscription = event.data.object as Stripe.Subscription;
			await supabase
				.from("memberships")
				.update({ status: "canceled" })
				.eq("stripe_subscription_id", subscription.id);
			break;
		}
	}

	return NextResponse.json({ received: true });
}
