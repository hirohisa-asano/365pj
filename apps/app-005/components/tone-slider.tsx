"use client";

import { FREE_TONE_LEVELS, getTone, TONES } from "@/lib/tones";

export function ToneSlider({
	level,
	onChange,
	fullRange,
}: {
	level: number;
	onChange: (level: number) => void;
	fullRange: boolean;
}) {
	// 未ログインは2段階（優しめ/強め）、ログイン済みは5段階フル
	const options = fullRange ? TONES.map((t) => t.level) : FREE_TONE_LEVELS;
	const current = getTone(level);

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<p className="text-sm font-bold text-muted-foreground">応援の強さ</p>
				<span className="text-sm font-bold text-primary">{current.label}</span>
			</div>

			{fullRange ? (
				<>
					<input
						type="range"
						min={1}
						max={5}
						step={1}
						value={level}
						onChange={(e) => onChange(Number(e.target.value))}
						className="w-full accent-primary cursor-pointer"
						aria-label="応援の強さ"
					/>
					<div className="flex justify-between text-[10px] text-muted-foreground">
						<span>優しめ</span>
						<span>強め</span>
					</div>
				</>
			) : (
				<div className="grid grid-cols-2 gap-2">
					{options.map((lv) => {
						const t = getTone(lv);
						const active = level === lv;
						return (
							<button
								key={lv}
								type="button"
								onClick={() => onChange(lv)}
								className={`rounded-2xl border py-2.5 text-sm font-bold transition-all cursor-pointer ${
									active
										? "border-primary bg-primary/10 ring-2 ring-primary/30"
										: "border-border bg-white hover:border-primary/40"
								}`}
							>
								{t.label}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
