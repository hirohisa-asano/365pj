import { MangaForm } from "@/components/manga-form";

export default function Home() {
	return (
		<div className="mx-auto max-w-xl px-4 py-10 md:py-14">
			<div className="mb-8">
				<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
					次、何読む？
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					好きな作品と気分から、AIがぴったりの漫画を見つけます。
				</p>
			</div>
			<MangaForm />
		</div>
	);
}
