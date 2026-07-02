"use client";

import { Phone } from "lucide-react";

type Resource = { name: string; detail: string; tel: string };

export function CrisisCard({
	message,
	resources,
}: {
	message: string;
	resources: Resource[];
}) {
	return (
		<div className="rounded-3xl border border-primary/40 bg-white p-6 shadow-sm">
			<p className="text-sm leading-relaxed text-foreground mb-5">{message}</p>
			<div className="space-y-2">
				{resources.map((r) => (
					<a
						key={r.tel}
						href={`tel:${r.tel}`}
						className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-3 transition-colors hover:border-primary/50"
					>
						<Phone size={18} className="shrink-0 text-primary" />
						<div>
							<div className="text-sm font-bold text-foreground">{r.name}</div>
							<div className="text-xs text-muted-foreground">{r.detail}</div>
						</div>
					</a>
				))}
			</div>
			<p className="mt-4 text-[11px] text-muted-foreground">
				あなたは一人ではありません。まずは誰かに話してみてください。
			</p>
		</div>
	);
}
