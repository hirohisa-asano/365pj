"use client";

import { MOODS } from "@/lib/moods";

export function MoodPicker({
	selected,
	onSelect,
}: {
	selected: string;
	onSelect: (id: string) => void;
}) {
	return (
		<div className="space-y-2">
			<p className="text-sm font-bold text-muted-foreground">
				今日の調子はどう？
			</p>
			<div className="grid grid-cols-4 gap-2">
				{MOODS.map((m) => {
					const active = selected === m.id;
					return (
						<button
							key={m.id}
							type="button"
							onClick={() => onSelect(m.id)}
							className={`rounded-2xl border py-2.5 text-center transition-all cursor-pointer ${
								active
									? "border-primary bg-primary/10 ring-2 ring-primary/30"
									: "border-border bg-white hover:border-primary/40"
							}`}
						>
							<div className="text-2xl leading-none mb-1">{m.emoji}</div>
							<div className="text-[11px] font-bold whitespace-nowrap">
								{m.label}
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
