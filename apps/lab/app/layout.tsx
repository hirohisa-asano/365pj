import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Footer } from "@/components/footer";
import { StarfieldBackground } from "@/components/starfield";
import { tone } from "@/tone.config";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
	subsets: ["latin"],
	variable: "--font-noto-sans-jp",
});

const notoSerifJP = Noto_Serif_JP({
	subsets: ["latin"],
	variable: "--font-noto-serif-jp",
});

export const metadata: Metadata = {
	title: "Southern Cross Lab",
	description: "Webアプリの実験場。作っては出す。試しては変える。",
	metadataBase: new URL("https://southerncrosslab.com"),
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
		<html
			lang="ja"
			className={`${notoSansJP.variable} ${notoSerifJP.variable} h-full`}
		>
		<body
			className="min-h-full flex flex-col antialiased"
			style={cssVars}
		>
			<StarfieldBackground />
			<main className="flex-1">{children}</main>
			<Footer />
			<Analytics />
		</body>
		</html>
	);
}
