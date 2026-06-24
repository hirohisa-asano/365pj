import { MangaForm } from "@/components/manga-form";

export default function Home() {
	return (
		<div className="mx-auto max-w-xl px-4 py-12 md:py-16">
			<div className="text-center mb-10">
				<h1 className="text-2xl md:text-3xl font-bold">
					あなたに合う漫画提案AI
				</h1>
				<p className="mt-3 text-sm text-muted-foreground">
					好きな漫画と気分を教えてください。
					<br />
					AIがあなたにぴったりの作品を提案します。
				</p>
			</div>
			<MangaForm />
		</div>
	);
}
