import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { AuthHeader } from "@/components/auth-header";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";
import { tone } from "@/tone.config";
import "./globals.css";

const rounded = M_PLUS_Rounded_1c({
	weight: ["400", "700", "800"],
	subsets: ["latin"],
	variable: "--font-rounded",
});

export const metadata: Metadata = {
	title: "よしよしAI — ダメな自分を全力で肯定・応援してくれるAI",
	description:
		"今日ダメだったことを話すと、AIが全力で「よしよし」してくれるアプリ。今日の調子を気づかい、優しめ⇔強めのトーンと、推し（王道/ツンデレ/萌え萌え）・体育会系コーチ・おじいちゃんなどの人格を選んで応援してもらえます。",
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
		"--tone-font-heading": rounded.style.fontFamily,
		"--tone-font-body": rounded.style.fontFamily,
	} as React.CSSProperties;

	return (
		<html lang="ja" className={`${rounded.variable} h-full`}>
			<body className="min-h-full flex flex-col antialiased" style={cssVars}>
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
