import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { AuthHeader } from "@/components/auth-header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { tone } from "@/tone.config";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
	title: "FilmPick — あなたの好みで映画を探す",
	description:
		"好きな映画と今の気分を伝えるだけ。AIがあなたの趣味傾向を分析して、次に観るべき映画を提案します。",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	let isMember = false;
	if (user) {
		const { data } = await supabase
			.from("memberships")
			.select("status")
			.eq("user_id", user.id)
			.eq("status", "active")
			.single();
		isMember = !!data;
	}

	const cssVars = {
		"--tone-primary": tone.colors.primary,
		"--tone-primary-foreground": tone.colors.primaryForeground,
		"--tone-background": tone.colors.background,
		"--tone-foreground": tone.colors.foreground,
		"--tone-muted": tone.colors.muted,
		"--tone-muted-foreground": tone.colors.mutedForeground,
		"--tone-border": tone.colors.border,
		"--tone-radius": tone.borderRadius,
		"--tone-font-heading": tone.font.heading,
		"--tone-font-body": tone.font.body,
	} as React.CSSProperties;

	return (
		<html lang="ja" className={`${notoSansJP.variable} h-full`}>
			<body
				className="min-h-full flex flex-col antialiased"
				style={{
					...cssVars,
					backgroundColor: tone.colors.background,
					color: tone.colors.foreground,
				}}
			>
				<header className="absolute top-4 right-4 z-10">
					<AuthHeader user={user} isMember={isMember} />
				</header>
				<main className="flex-1">{children}</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
