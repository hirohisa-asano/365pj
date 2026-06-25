"use client";

export function BucketItem({
	index,
	emoji,
	title,
	reason,
	locked,
}: {
	index: number;
	emoji: string;
	title: string;
	reason: string;
	locked?: boolean;
}) {
	return (
		<div
			className={`flex gap-4 items-start p-4 rounded-xl border transition-colors ${
				locked
					? "border-border/50 bg-muted/30 blur-sm select-none"
					: "border-border bg-muted/50"
			}`}
		>
			<div className="flex-shrink-0 flex flex-col items-center w-12">
				<span className="text-2xl font-black text-primary/25 leading-none">
					{String(index + 1).padStart(2, "0")}
				</span>
				<span className="text-xl mt-1">{emoji}</span>
			</div>
			<div className="flex-1 min-w-0">
				<h3 className="font-bold text-foreground leading-snug">{title}</h3>
				<p className="mt-1 text-sm text-muted-foreground leading-relaxed">
					{reason}
				</p>
			</div>
		</div>
	);
}
