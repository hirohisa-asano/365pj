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
					小さく作り、出して、
					<br />
					反応があったものだけ育てる。
				</h1>
				<p className="mt-8 max-w-md leading-relaxed" style={{color: "#A8B8D0", textShadow: "0 1px 10px rgba(0,0,0,0.6)"}}>
					365個のアイデアから10個を作る。
					<br />
					最初から正解を探さない。
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
								アイデアを出す
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								良し悪しを判断しない。
								<br />
								とにかく数を出す。
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<Compass className="h-6 w-6 text-primary mb-5" />
							<h3 className="font-heading text-lg mb-3">
								作って出す
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								完璧を待たない。
								<br />
								3日以内に動くものを作る。
							</p>
						</div>
						<div className="flex flex-col items-center text-center">
							<Map className="h-6 w-6 text-primary mb-5" />
							<h3 className="font-heading text-lg mb-3">
								反応を見る
							</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								使われたものだけを育てる。
								<br />
								反応がなければ潔く手放す。
							</p>
						</div>
					</div>
				</div>
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
