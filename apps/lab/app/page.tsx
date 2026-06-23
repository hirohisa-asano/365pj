import { Compass, Map, Star } from "lucide-react";

const apps: { name: string; description: string; url: string }[] = [
	// アプリ公開後にここに追加
	// { name: "Timer", description: "シンプルなタイマー", url: "https://timer.southernlabs.com" },
];

export default function Home() {
	return (
		<div className="flex flex-col">
			{/* Hero */}
			<section className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center">
				<p className="text-sm tracking-[0.3em] uppercase text-primary mb-8" style={{textShadow: "0 0 20px rgba(168,196,240,0.5)"}}>
					Southern Cross Lab
				</p>
				<h1 className="text-3xl md:text-5xl font-heading leading-snug tracking-wide" style={{color: "#E8EFF8", textShadow: "0 2px 30px rgba(0,0,0,0.8)"}}>
					世界は征服する戦場ではなく、
					<br />
					共に航海する海である。
				</h1>
				<p className="mt-8 max-w-md leading-relaxed" style={{color: "#A8B8D0", textShadow: "0 1px 10px rgba(0,0,0,0.6)"}}>
					小さな道具を作り、試し、手放す。
					<br />
					航海に必要なものだけが、手元に残る。
				</p>
				<div className="mt-12 w-px h-16 bg-border" />
			</section>

			{/* Philosophy */}
			<section className="px-4 py-24">
				<div className="mx-auto max-w-3xl">
					<div className="grid gap-12 md:grid-cols-3">
						<div className="flex flex-col items-center text-center">
							<Star className="h-6 w-6 text-primary mb-5" />
							<h3 className="font-heading text-lg mb-3">
								星を読む
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								まだ見えない島のために、
								<br />
								まず空を見上げる。
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<Compass className="h-6 w-6 text-primary mb-5" />
							<h3 className="font-heading text-lg mb-3">
								小舟を出す
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								完璧な船を待たない。
								<br />
								小さく漕ぎ出す。
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<Map className="h-6 w-6 text-primary mb-5" />
							<h3 className="font-heading text-lg mb-3">
								航路を記す
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								辿り着いた場所を記録し、
								<br />
								次の航海者に残す。
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Apps */}
			<section className="px-4 py-24">
				<div className="mx-auto max-w-3xl">
					<h2 className="font-heading text-xl text-center mb-2">
						航海の道具たち
					</h2>
					<p className="text-center text-sm text-muted-foreground mb-12">
						この海で見つけた、小さなプロダクト。
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
							最初の航海の準備中。
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
