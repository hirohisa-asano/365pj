export function Footer() {
	const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL;
	const stripeLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK;

	return (
		<footer className="border-t border-border py-8 px-4">
			<div className="mx-auto max-w-3xl">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
					<div className="space-y-2">
						<h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/60">
							Southern Cross Lab
						</h4>
						<p className="text-xs text-muted-foreground/50 leading-relaxed">
							Webアプリの実験場
						</p>
					</div>

					<div className="space-y-2">
						<h4 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/60">
							Links
						</h4>
						<ul className="space-y-1 text-xs">
							{discordUrl && (
								<li>
									<a
										href={discordUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground/50 hover:text-foreground transition-colors"
									>
										Discord
									</a>
								</li>
							)}
							<li>
								{stripeLink ? (
									<a
										href={stripeLink}
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground/50 hover:text-foreground transition-colors"
									>
										メンバーになる
									</a>
								) : (
									<span className="text-muted-foreground/30">
										メンバーになる（準備中）
									</span>
								)}
							</li>
							<li>
								<a
									href="/terms"
									className="text-muted-foreground/50 hover:text-foreground transition-colors"
								>
									利用規約
								</a>
							</li>
							<li>
								<a
									href="/privacy"
									className="text-muted-foreground/50 hover:text-foreground transition-colors"
								>
									プライバシーポリシー
								</a>
							</li>
							<li>
								<a
									href="/legal"
									className="text-muted-foreground/50 hover:text-foreground transition-colors"
								>
									特定商取引法に基づく表記
								</a>
							</li>
						</ul>
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
