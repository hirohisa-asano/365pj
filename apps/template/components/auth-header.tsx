"use client";

import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { LogIn, Star } from "lucide-react";

export function AuthHeader({
	user,
	isMember,
}: { user: User | null; isMember: boolean }) {
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

	if (!user) {
		return (
			<button
				type="button"
				onClick={handleLogin}
				className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full px-3 py-1.5 cursor-pointer"
			>
				<LogIn size={14} />
				ログイン
			</button>
		);
	}

	const name = user.user_metadata?.full_name ?? user.email ?? "";
	const avatar = user.user_metadata?.avatar_url as string | undefined;
	const initial = name.charAt(0).toUpperCase();

	return (
		<div className="flex items-center gap-2">
			{isMember && (
				<span className="flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
					<Star size={12} className="fill-primary" />
					サポーター
				</span>
			)}
			<div className="flex items-center gap-2">
				{avatar ? (
					<img
						src={avatar}
						alt={name}
						className="w-6 h-6 rounded-full"
					/>
				) : (
					<span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
						{initial}
					</span>
				)}
				<span className="text-xs text-muted-foreground hidden sm:inline">
					{name}
				</span>
			</div>
			<button
				type="button"
				onClick={handleLogout}
				className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
			>
				ログアウト
			</button>
		</div>
	);
}
