import { createClient } from "@/lib/supabase/server";
import { AuthButtons } from "@/components/auth-buttons";
import { MangaForm } from "@/components/manga-form";

export default async function Home() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div className="mx-auto max-w-lg px-4 py-8 md:py-12">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
						次、何読む？
					</h1>
					<p className="mt-1 text-xs text-muted-foreground">
						好きな作品と気分から、ぴったりの漫画を見つける
					</p>
				</div>
				<AuthButtons user={user} />
			</div>
			<div className="mt-6">
				<MangaForm />
			</div>
		</div>
	);
}
