import { createClient } from "@/lib/supabase/server";
import { AuthButtons } from "@/components/auth-buttons";
import { MemberCard } from "@/components/member-card";

const apps: {
	name: string;
	description: string;
	features: string[];
	url: string;
	isNew?: boolean;
	comingSoon?: boolean;
}[] = [
	{
		name: "副業バレリスク診断",
		description: "副業が会社にバレるリスクを3つの質問で診断。対策もわかる",
		features: ["バレリスク0-100%", "バレるルート分析", "対策チェックリスト"],
		url: "https://fukugyo-check.southerncrosslab.com",
		comingSoon: true,
	},
	{
		name: "漫画提案AI",
		description: "好きな作品と気分から、AIがぴったりの漫画を見つける",
		features: ["好みの漫画から提案", "気分タグで絞り込み", "Amazonで即チェック"],
		url: "https://manga-ai.southerncrosslab.com",
	},
	{
		name: "FilmPick",
		description: "好きな映画と気分からAIがあなたの趣味を分析、次に観るべき映画を提案",
		features: ["趣味傾向の分析", "おすすめ3本+理由", "Amazon・Wikipedia連携"],
		url: "https://filmpick.southerncrosslab.com",
		isNew: true,
	},
];

export default async function Home() {
	const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL;
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

	return (
		<div className="flex flex-col">
			{/* Auth */}
			<div className="absolute top-4 right-4 z-10">
				<AuthButtons user={user} />
			</div>

			{/* Hero */}
			<section className="flex flex-col items-center justify-center px-4 pt-24 pb-16 md:pt-32 md:pb-20 text-center">
				<p className="text-sm tracking-[0.3em] uppercase text-primary mb-6">
					Southern Cross Lab
				</p>
				<h1 className="text-2xl md:text-3xl font-heading tracking-wide text-foreground">
					Web アプリの実験場
				</h1>
				<p className="mt-4 text-sm text-muted-foreground">
					作っては出す。試しては変える。
				</p>
			</section>

			{/* Apps */}
			<section className="px-4 pt-8 pb-24">
				<div className="mx-auto max-w-3xl">
					<h2 className="font-heading text-xl text-center mb-2">
						アプリ
					</h2>
					<p className="text-center text-sm text-muted-foreground mb-12">
						使ってみて、感想を聞かせてください。
					</p>
					{apps.length > 0 ? (
						<div className="space-y-6">
							{apps.map((app, idx) => {
								const Tag = app.comingSoon ? "div" : "a";
								return (
									<Tag
										key={app.name}
										{...(app.comingSoon ? {} : { href: app.url })}
										className={`block p-6 md:p-8 rounded-[var(--radius)] border border-border bg-[#1A2640]/90 backdrop-blur-sm transition-colors relative ${
											app.comingSoon
												? "opacity-70 cursor-default"
												: "hover:border-primary/50"
										}`}
									>
										<span className="text-[10px] tracking-wider text-muted-foreground/40 absolute top-4 left-4 md:top-6 md:left-6">
											#{idx + 1}
										</span>
										{app.comingSoon && (
											<span className="absolute top-4 right-4 md:top-6 md:right-6 text-[10px] tracking-wider uppercase text-amber-400 border border-amber-400/30 rounded-full px-2 py-0.5">
												Coming Soon
											</span>
										)}
										{app.isNew && !app.comingSoon && (
											<span className="absolute top-4 right-4 md:top-6 md:right-6 text-[10px] tracking-wider uppercase text-primary border border-primary/30 rounded-full px-2 py-0.5">
												New
											</span>
										)}
										<h3 className="text-xl md:text-2xl font-bold text-white">
											{app.name}
										</h3>
										<p className="mt-2 text-sm md:text-base text-muted-foreground">
											{app.description}
										</p>
										<ul className="mt-4 flex flex-wrap gap-2">
											{app.features.map((feature) => (
												<li
													key={feature}
													className="text-xs md:text-sm text-primary/80 border border-primary/20 rounded-full px-3 py-1"
												>
													{feature}
												</li>
											))}
										</ul>
									</Tag>
								);
							})}
						</div>
					) : (
						<p className="text-center text-muted-foreground text-sm">
							まだアプリはありません。
						</p>
					)}
				</div>
			</section>

			{/* Discord & Member */}
			<section className="px-4 py-24">
				<div className="mx-auto max-w-3xl grid gap-6 md:grid-cols-2">
					{/* Discord */}
					{discordUrl && (
						<a
							href={discordUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-4 p-6 md:p-8 rounded-[var(--radius)] bg-[#5865F2] hover:bg-[#4752C4] transition-colors"
						>
							<svg
								width="40"
								height="40"
								viewBox="0 0 71 55"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								className="shrink-0"
							>
								<path
									d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309-0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"
									fill="white"
								/>
							</svg>
							<div>
								<p className="text-white font-semibold text-base">
									Discord に参加する
								</p>
								<p className="text-white/70 text-xs mt-1">
									バグ報告・要望・雑談はこちらで
								</p>
							</div>
						</a>
					)}

					{/* Member */}
					<MemberCard
						user={user}
						isMember={isMember}
						paymentLink={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
						portalUrl={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL}
					/>
				</div>
			</section>
		</div>
	);
}
