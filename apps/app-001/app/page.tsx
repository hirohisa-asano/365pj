import { MangaForm } from "@/components/manga-form";

export default function Home() {
	return (
		<div className="mx-auto max-w-lg px-4 py-8 md:py-12">
			<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
				次、何読む？
			</h1>
			<p className="mt-1 text-xs text-muted-foreground">
				好きな作品と気分から、ぴったりの漫画を見つける
			</p>
			<div className="mt-6">
				<MangaForm />
			</div>
		</div>
	);
}
