"use client";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function MemberCard({
	user,
	isMember,
}: { user: User | null; isMember: boolean }) {
	const handleCheckout = async () => {
		const res = await fetch("/api/checkout", { method: "POST" });
		const data = await res.json();
		if (data.url) {
			window.location.href = data.url;
		}
	};

	const handleLogin = async () => {
		const supabase = createClient();
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	// メンバー済み
	if (isMember) {
		return (
			<div className="flex flex-col gap-4 p-6 md:p-8 rounded-[var(--radius)] border-2 border-primary/40 bg-primary/5">
				<div>
					<div className="flex items-center gap-2">
						<p className="text-white font-bold text-base">
							メンバー
						</p>
						<span className="text-[10px] tracking-wider uppercase text-primary border border-primary/30 rounded-full px-2 py-0.5">
							Active
						</span>
					</div>
					<p className="text-muted-foreground text-xs mt-1">
						ご支援ありがとうございます
					</p>
				</div>
			</div>
		);
	}

	// 未ログイン
	if (!user) {
		return (
			<button
				type="button"
				onClick={handleLogin}
				className="flex flex-col gap-4 p-6 md:p-8 rounded-[var(--radius)] border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-colors text-left"
			>
				<div>
					<p className="text-white font-bold text-base">
						メンバーになる
					</p>
					<p className="text-muted-foreground text-xs mt-1">
						ログインして月額サポートで実験場を支える
					</p>
				</div>
				<ul className="space-y-1.5">
					<li className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="text-primary">✦</span>
						新アプリへのアーリーアクセス
					</li>
					<li className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="text-primary">✦</span>
						メンバー限定の機能開放
					</li>
					<li className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="text-primary">✦</span>
						開発の裏側を共有
					</li>
				</ul>
			</button>
		);
	}

	// ログイン済み・非メンバー
	return (
		<button
			type="button"
			onClick={handleCheckout}
			className="flex flex-col gap-4 p-6 md:p-8 rounded-[var(--radius)] border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-colors text-left"
		>
			<div>
				<p className="text-white font-bold text-base">メンバーになる</p>
				<p className="text-muted-foreground text-xs mt-1">
					月額サポートで実験場を支える
				</p>
			</div>
			<ul className="space-y-1.5">
				<li className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="text-primary">✦</span>
					新アプリへのアーリーアクセス
				</li>
				<li className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="text-primary">✦</span>
					メンバー限定の機能開放
				</li>
				<li className="flex items-center gap-2 text-xs text-muted-foreground">
					<span className="text-primary">✦</span>
					開発の裏側を共有
				</li>
			</ul>
		</button>
	);
}
