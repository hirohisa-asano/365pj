import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Footer } from "@/components/footer";
import { tone } from "@/tone.config";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
	title: "副業バレリスク診断 | Southern Cross Lab",
	description:
		"副業が会社にバレるリスクを無料で診断。住民税・社会保険・SNSなどのバレるルートと対策がわかる。",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
			<body className="min-h-full flex flex-col antialiased" style={cssVars}>
				<main className="flex-1">{children}</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
