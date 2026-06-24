"use client";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function AuthButtons({ user }: { user: User | null }) {
	const supabase = createClient();

	const handleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		window.location.reload();
	};

	if (user) {
		return (
			<div className="flex items-center gap-3">
				<span className="text-xs text-muted-foreground">
					{user.user_metadata?.full_name ?? user.email}
				</span>
				<button
					type="button"
					onClick={handleLogout}
					className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors"
				>
					ログアウト
				</button>
			</div>
		);
	}

	return (
		<button
			type="button"
			onClick={handleLogin}
			className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-[var(--radius)] px-3 py-1.5"
		>
			ログイン
		</button>
	);
}
