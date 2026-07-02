"use client";

import { Lock } from "lucide-react";
import { CUSTOM_PERSONA, PERSONAS } from "@/lib/personas";

export function PersonaPicker({
	selected,
	onSelect,
	canUsePremium,
}: {
	selected: string;
	onSelect: (id: string) => void;
	canUsePremium: boolean;
}) {
	// カスタム推しはログインで解放（プリセット premium と同じゲート）
	const options = [...PERSONAS, CUSTOM_PERSONA];
	return (
		<div className="space-y-2">
			<p className="text-sm font-bold text-muted-foreground">
				誰に応援してほしい？
			</p>
			<div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
				{options.map((p) => {
					const locked = p.premium && !canUsePremium;
					const active = selected === p.id;
					return (
						<button
							key={p.id}
							type="button"
							onClick={() => !locked && onSelect(p.id)}
							disabled={locked}
							className={`shrink-0 rounded-2xl border px-4 py-3 text-center transition-all cursor-pointer ${
								active
									? "border-primary bg-primary/10 ring-2 ring-primary/30"
									: "border-border bg-white hover:border-primary/40"
							} ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
						>
							<div className="text-2xl leading-none mb-1">{p.emoji}</div>
							<div className="text-sm font-bold flex items-center gap-1 justify-center">
								{p.label}
								{locked && <Lock size={11} className="text-muted-foreground" />}
							</div>
							<div className="text-[10px] text-muted-foreground mt-0.5 whitespace-nowrap">
								{p.tagline}
							</div>
						</button>
					);
				})}
			</div>
			{!canUsePremium && (
				<p className="text-xs text-muted-foreground">
					ログインすると全ての人格が選べます
				</p>
			)}
		</div>
	);
}
