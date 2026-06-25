import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "特定商取引法に基づく表記 - Southern Cross Lab",
	description: "Southern Cross Lab の特定商取引法に基づく表記",
};

export default function LegalPage() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
			<a
				href="/"
				className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
			>
				← Southern Cross Lab
			</a>
			<h1 className="font-heading text-2xl font-semibold mb-2 text-white">
				特定商取引法に基づく表記
			</h1>
			<p className="text-xs text-muted-foreground mb-8">
				最終更新日: 2026年6月24日
			</p>

			<div className="space-y-4 text-sm">
				<table className="w-full">
					<tbody className="divide-y divide-border">
						{[
							["販売業者", "Locamoca株式会社"],
							[
								"運営統括責任者",
								"代表取締役 淺野弘久",
							],
							[
								"所在地",
								"〒111-0032 東京都台東区浅草1丁目13−5 井門浅草すしや通りビル",
							],
							[
								"電話番号",
								"請求があった場合、遅滞なく開示いたします",
							],
							[
								"メールアドレス",
								"locamoca-info@locamoca-inc.com",
							],
							["URL", "https://southerncrosslab.com"],
							[
								"販売価格",
								"各サービスページに記載（寄付は任意の金額）",
							],
							[
								"商品代金以外の必要料金",
								"インターネット接続に必要な通信料（お客様のご負担）",
							],
							["支払方法", "クレジットカード（Stripe 経由）"],
							["支払時期", "購入時に即時決済"],
							[
								"商品の引渡時期",
								"決済完了後、直ちにサービスをご利用いただけます",
							],
							[
								"返品・キャンセル",
								"デジタルサービスの性質上、原則として返品・返金はお受けしておりません。サービスに重大な不具合がある場合は個別にご相談ください",
							],
							[
								"動作環境",
								"最新版の Chrome, Safari, Firefox, Edge を推奨",
							],
						].map(([label, value]) => (
							<tr key={label}>
								<th className="py-3 pr-4 text-left text-xs font-semibold text-foreground whitespace-nowrap align-top w-1/3">
									{label}
								</th>
								<td className="py-3 text-xs text-muted-foreground">
									{value}
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="mt-12 p-4 rounded-[var(--radius)] border border-border">
					<h3 className="text-sm font-semibold text-foreground mb-1">
						お問い合わせ
					</h3>
					<p className="text-xs text-muted-foreground">
						ご質問は Discord サーバーまたはメール（locamoca-info@locamoca-inc.com）にてお問い合わせください。
					</p>
				</div>
			</div>
		</div>
	);
}
