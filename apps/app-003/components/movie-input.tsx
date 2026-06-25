"use client";

import { Film } from "lucide-react";

export function MovieInput({
	movies,
	onChange,
}: {
	movies: string[];
	onChange: (movies: string[]) => void;
}) {
	const update = (index: number, value: string) => {
		const next = [...movies];
		next[index] = value;
		onChange(next);
	};

	const placeholders = [
		"例: 千と千尋の神隠し",
		"例: インターステラー",
		"例: パラサイト 半地下の家族",
	];

	return (
		<div className="space-y-3">
			{movies.map((movie, i) => (
				<div key={`movie-${i.toString()}`} className="relative">
					<Film
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
						size={18}
					/>
					<input
						type="text"
						value={movie}
						onChange={(e) => update(i, e.target.value)}
						placeholder={placeholders[i]}
						className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
					/>
					{i === 0 && (
						<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary/70">
							必須
						</span>
					)}
				</div>
			))}
		</div>
	);
}
