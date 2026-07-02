import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return NextResponse.json({ loggedIn: false, isMember: false });
		}

		const { data } = await supabase
			.from("memberships")
			.select("status")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();

		return NextResponse.json({ loggedIn: true, isMember: !!data });
	} catch {
		return NextResponse.json({ loggedIn: false, isMember: false });
	}
}
