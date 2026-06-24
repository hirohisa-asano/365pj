"use client";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export function MemberCard({
	user,
	isMember,
	paymentLink,
	portalUrl,
}: { user: User | null; isMember: boolean; paymentLink?: string; portalUrl?: string }) {
	const features = [
		"新アプリへのアーリーアクセス",
		"メンバー限定の機能開放",
		"開発の裏側を共有",
	];

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
						<p className="text-white font-bold text-base">メンバー</p>
						<span className="text-[10px] tracking-wider uppercase text-primary border border-primary/30 rounded-full px-2 py-0.5">
							Active
						</span>
					</div>
					<p className="text-muted-foreground text-xs mt-1">
						ご支援ありがとうございます
					</p>
				</div>
				<a
					href={portalUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xs text-muted-foreground/60 hover:text-foreground transition-colors text-left"
				>
					プランの変更・解約・支払い方法の変更 →
				</a>
			</div>
		);
	}

	// Payment Link がない場合は Coming Soon
	if (!paymentLink) {
		return (
			<div className="flex flex-col gap-4 p-6 md:p-8 rounded-[var(--radius)] border-2 border-border bg-muted/30 opacity-60 cursor-not-allowed">
				<div>
					<div className="flex items-center gap-2">
						<p className="text-foreground font-bold text-base">メンバーになる</p>
						<span className="text-[10px] tracking-wider uppercase text-muted-foreground border border-border rounded-full px-2 py-0.5">
							Coming Soon
						</span>
					</div>
					<p className="text-muted-foreground text-xs mt-1">月額サポートで実験場を支える</p>
				</div>
				<ul className="space-y-1.5">
					{features.map((f) => (
						<li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
							<span className="text-primary/50">✦</span>{f}
						</li>
					))}
				</ul>
			</div>
		);
	}

	// 未ログイン → ログインを促す
	if (!user) {
		return (
			<button
				type="button"
				onClick={handleLogin}
				className="flex flex-col gap-4 p-6 md:p-8 rounded-[var(--radius)] border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-colors text-left"
			>
				<div>
					<p className="text-white font-bold text-base">メンバーになる</p>
					<p className="text-muted-foreground text-xs mt-1">
						ログインして月額サポートで実験場を支える
					</p>
				</div>
				<ul className="space-y-1.5">
					{features.map((f) => (
						<li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
							<span className="text-primary">✦</span>{f}
						</li>
					))}
				</ul>
			</button>
		);
	}

	// ログイン済み・非メンバー → Payment Link へ
	const url = `${paymentLink}?client_reference_id=${user.id}&prefilled_email=${encodeURIComponent(user.email ?? "")}`;

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className="flex flex-col gap-4 p-6 md:p-8 rounded-[var(--radius)] border-2 border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-colors"
		>
			<div>
				<p className="text-white font-bold text-base">メンバーになる</p>
				<p className="text-muted-foreground text-xs mt-1">
					月額サポートで実験場を支える
				</p>
			</div>
			<ul className="space-y-1.5">
				{features.map((f) => (
					<li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
						<span className="text-primary">✦</span>{f}
					</li>
				))}
			</ul>
		</a>
	);
}
