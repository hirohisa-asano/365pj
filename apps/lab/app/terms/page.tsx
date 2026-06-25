import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "利用規約 - Southern Cross Lab",
	description: "Southern Cross Lab の利用規約",
};

export default function TermsPage() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
			<a
				href="/"
				className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
			>
				← Southern Cross Lab
			</a>
			<h1 className="font-heading text-2xl font-semibold mb-2 text-white">利用規約</h1>
			<p className="text-xs text-muted-foreground mb-8">
				最終更新日: 2026年6月24日
			</p>

			<div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						1. サービスの概要
					</h2>
					<p>
						Southern Cross Lab（以下「当サービス」）は、Locamoca
						株式会社（代表取締役 淺野弘久、以下「当社」）が運営する
						Web
						アプリケーション群のポータルサイトおよび各アプリケーション（以下「各アプリ」）を指します。
					</p>
					<p className="mt-2">
						各アプリは southerncrosslab.com
						のサブドメインで提供され、それぞれ独立した機能を持ちますが、本利用規約が共通して適用されます。
					</p>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						2. 利用条件
					</h2>
					<ul className="list-disc pl-5 space-y-1">
						<li>
							当サービスは無料で提供されます（一部、寄付機能があります）
						</li>
						<li>特別な登録なしにご利用いただけます</li>
						<li>
							Google
							認証を利用するアプリでは、認証に同意いただく必要があります
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						3. 禁止事項
					</h2>
					<ul className="list-disc pl-5 space-y-1">
						<li>法令または公序良俗に違反する行為</li>
						<li>
							当サービスのサーバーまたはネットワークの機能を妨害する行為
						</li>
						<li>不正アクセスをし、またはこれを試みる行為</li>
						<li>当サービスの運営を妨害するおそれのある行為</li>
						<li>
							当サービスから得られた情報を無断で商業的に利用する行為
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						4. 免責事項
					</h2>
					<p>当サービスは、以下について一切の責任を負いません：</p>
					<ul className="list-disc pl-5 space-y-1 mt-2">
						<li>
							提供される情報の正確性、完全性、有用性（AI
							による出力を含む）
						</li>
						<li>
							ユーザーが当サービスを利用して行った判断や行為の結果
						</li>
						<li>
							サービスの中断、変更、終了によって生じた損害
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						5. AI 生成コンテンツについて
					</h2>
					<p>
						各アプリでは AI（Claude, OpenAI
						等）を利用したコンテンツ生成を行う場合があります。AI
						の出力は参考情報であり、正確性を保証するものではありません。重要な判断には、必ず専門家にご相談ください。
					</p>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						6. サービスの変更・終了
					</h2>
					<p>
						当社は、ユーザーに事前の通知なく、サービスの内容を変更し、またはサービスの提供を終了することができます。これにより生じた損害について、当社は一切の責任を負いません。
					</p>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						7. 利用規約の変更
					</h2>
					<p>
						当社は、必要に応じて本利用規約を変更できるものとします。変更後の利用規約は、本ページに掲載した時点から効力を生じます。
					</p>
				</section>

				<section>
					<h2 className="text-base font-semibold text-foreground mb-3">
						8. 準拠法・裁判管轄
					</h2>
					<p>
						本利用規約は日本法に準拠し、解釈されます。本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
					</p>
				</section>

				<div className="mt-12 p-4 rounded-[var(--radius)] border border-border">
					<h3 className="text-sm font-semibold text-foreground mb-1">
						お問い合わせ
					</h3>
					<p className="text-xs text-muted-foreground">
						利用規約に関するご質問は、Discord サーバーまたはメール（locamoca-info@locamoca-inc.com）にてお問い合わせください。
					</p>
				</div>
			</div>
		</div>
	);
}
