export function Footer() {
	const portalUrl =
		process.env.NEXT_PUBLIC_PORTAL_URL ?? "https://southerncrosslab.com";
	const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL;

	return (
		<footer className="border-t border-border py-8 px-4">
			<div className="mx-auto max-w-lg">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
					<div className="space-y-2">
						<a
							href={portalUrl}
							className="text-xs uppercase tracking-[0.15em] text-muted-foreground/60 hover:text-foreground transition-colors"
						>
							Southern Cross Lab
						</a>
					</div>

					<div className="space-y-1 text-xs">
						{discordUrl && (
							<a
								href={discordUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="block text-muted-foreground/50 hover:text-foreground transition-colors"
							>
								Discord
							</a>
						)}
						<a
							href={`${portalUrl}/terms`}
							className="block text-muted-foreground/50 hover:text-foreground transition-colors"
						>
							利用規約
						</a>
						<a
							href={`${portalUrl}/privacy`}
							className="block text-muted-foreground/50 hover:text-foreground transition-colors"
						>
							プライバシーポリシー
						</a>
					</div>
				</div>

				<div className="border-t border-border pt-4">
					<p className="text-center text-xs text-muted-foreground/40">
						&copy; {new Date().getFullYear()} Southern Cross Lab
					</p>
				</div>
			</div>
		</footer>
	);
}
