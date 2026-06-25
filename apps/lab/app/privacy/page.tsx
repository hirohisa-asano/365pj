import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "プライバシーポリシー - Southern Cross Lab",
	description: "Southern Cross Lab のプライバシーポリシー",
};

export default function PrivacyPage() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
			<a
				href="/"
				className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
			>
				← Southern Cross Lab
			</a>
			<h1 className="font-heading text-2xl font-semibold mb-2 text-white">
				プライバシーポリシー
			</h1>
			<p className="text-xs text-muted-foreground mb-8">
				最終更新日: 2026年6月24日
			</p>

			<div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						1. 収集する情報
					</h2>
					<p className="mb-3">
						当サービスでは、以下の情報を収集する場合があります：
					</p>
					<ul className="space-y-2">
						{[
							{
								item: "アカウント情報",
								detail:
									"Google 認証を利用するアプリでは、メールアドレスを取得します（認証が必要なアプリのみ）",
							},
							{
								item: "利用状況",
								detail:
									"Vercel Analytics によるページビュー・訪問者数等の匿名データ（個人を特定しません）",
							},
							{
								item: "ユーザー入力",
								detail:
									"アプリ内でユーザーが入力したデータ（テキスト、設定等）。各アプリの Supabase スキーマに保存されます",
							},
							{
								item: "決済情報",
								detail:
									"寄付機能利用時、Stripe が決済情報を管理します。カード情報は当方では保持しません",
							},
						].map(({ item, detail }) => (
							<li
								key={item}
								className="rounded-[var(--radius)] border border-border p-3"
							>
								<h3 className="text-xs font-semibold text-foreground mb-1">
									{item}
								</h3>
								<p className="text-xs text-muted-foreground">
									{detail}
								</p>
							</li>
						))}
					</ul>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						2. 情報の利用目的
					</h2>
					<ul className="list-disc pl-5 space-y-1">
						<li>サービスの提供・運営</li>
						<li>利用状況の分析・サービス改善</li>
						<li>お問い合わせへの対応</li>
					</ul>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						3. 第三者への提供
					</h2>
					<p>
						個人情報を第三者に提供することはありません。ただし以下の場合を除きます：
					</p>
					<ul className="list-disc pl-5 space-y-1 mt-2">
						<li>法令に基づく開示要求があった場合</li>
						<li>
							サービス提供に必要な外部サービスへの連携（Supabase、Stripe、Vercel）
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						4. AI サービスの利用
					</h2>
					<p>
						一部のアプリでは、ユーザーの入力を AI サービス（Anthropic
						Claude 等）に送信して処理します。送信されたデータは AI
						サービスの利用規約に従って取り扱われます。機密情報の入力はお控えください。
					</p>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						5. データの保管と削除
					</h2>
					<ul className="list-disc pl-5 space-y-1">
						<li>
							データは Supabase（東京リージョン）に保管されます
						</li>
						<li>
							アカウント削除を希望される場合は、お問い合わせください
						</li>
						<li>
							サービス終了時は、合理的な期間内にデータを削除します
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						6. Cookie
					</h2>
					<p>
						当サービスでは、認証・セッション管理の目的で Cookie
						を使用する場合があります。Vercel Analytics
						は Cookie を使用しない方式で動作します。
					</p>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						7. ポリシーの変更
					</h2>
					<p>
						本ポリシーは、必要に応じて変更することがあります。変更後のポリシーは、本ページに掲載した時点から効力を生じます。
					</p>
				</section>

				<div className="mt-12 p-4 rounded-[var(--radius)] border border-border">
					<h3 className="text-sm font-semibold text-foreground mb-1">
						お問い合わせ
					</h3>
					<p className="text-xs text-muted-foreground">
						プライバシーに関するご質問は、Discord サーバーまたはメール（locamoca-info@locamoca-inc.com）にてお問い合わせください。
					</p>
				</div>
			</div>
		</div>
	);
}
