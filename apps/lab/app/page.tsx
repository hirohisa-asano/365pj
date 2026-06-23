
const apps: { name: string; description: string; url: string }[] = [
	// アプリ公開後にここに追加
	// { name: "Timer", description: "シンプルなタイマー", url: "https://timer.southernlabs.com" },
];

export default function Home() {
	return (
		<div className="flex flex-col">
			{/* Hero */}
			<section className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
				<p className="text-sm tracking-[0.3em] uppercase text-primary mb-6" style={{textShadow: "0 0 20px rgba(168,196,240,0.5)"}}>
					Southern Cross Lab
				</p>
				<h1 className="text-2xl md:text-3xl font-heading tracking-wide" style={{color: "#E8EFF8", textShadow: "0 2px 30px rgba(0,0,0,0.8)"}}>
					つくった Web アプリの置き場。
				</h1>
			</section>

			{/* Apps */}
			<section className="px-4 py-24">
				<div className="mx-auto max-w-3xl">
					<h2 className="font-heading text-xl text-center mb-2">
						プロダクト
					</h2>
					<p className="text-center text-sm text-muted-foreground mb-12">
						作って出したもの。反応を見ている。
					</p>
					{apps.length > 0 ? (
						<div className="grid gap-4 md:grid-cols-2">
							{apps.map((app) => (
								<a
									key={app.name}
									href={app.url}
									className="block p-6 rounded-[var(--radius)] border border-border hover:border-primary/50 transition-colors"
								>
									<h3 className="font-heading text-lg">
										{app.name}
									</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										{app.description}
									</p>
								</a>
							))}
						</div>
					) : (
					<p className="text-center text-muted-foreground text-sm">
						7/12 公開予定。準備中。
					</p>
					)}
				</div>
			</section>
		</div>
	);
}
