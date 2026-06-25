"use client";

import { PressScale } from "@/components/motion";

const MOODS = [
	{ label: "じっくり考えたい", emoji: "🤔" },
	{ label: "スカッとしたい", emoji: "💥" },
	{ label: "泣きたい", emoji: "😢" },
	{ label: "ワクワクしたい", emoji: "✨" },
	{ label: "怖い思いしたい", emoji: "👻" },
	{ label: "笑いたい", emoji: "😂" },
	{ label: "感動したい", emoji: "🥹" },
	{ label: "何も考えたくない", emoji: "😌" },
] as const;

export function MoodChips({
	selected,
	onChange,
}: {
	selected: string[];
	onChange: (moods: string[]) => void;
}) {
	const toggle = (label: string) => {
		if (selected.includes(label)) {
			onChange(selected.filter((m) => m !== label));
		} else {
			onChange([...selected, label]);
		}
	};

	return (
		<div className="flex flex-wrap gap-2">
			{MOODS.map((mood) => {
				const active = selected.includes(mood.label);
				return (
					<PressScale key={mood.label}>
						<button
							type="button"
							onClick={() => toggle(mood.label)}
							className={`
								px-3.5 py-2 text-sm rounded-full border transition-all duration-200 cursor-pointer
								${
									active
										? "border-primary bg-primary/15 text-primary"
										: "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
								}
							`}
						>
							<span className="mr-1.5">{mood.emoji}</span>
							{mood.label}
						</button>
					</PressScale>
				);
			})}
		</div>
	);
}
