"use client";

import { BookOpen, Calendar, Clapperboard, ExternalLink, Tag, User } from "lucide-react";

type Recommendation = {
	title: string;
	director: string;
	year: number;
	genre: string;
	reason: string;
};

export function ResultCard({
	movie,
	index,
}: {
	movie: Recommendation;
	index: number;
}) {
	const gradients = [
		"from-amber-500/10 to-orange-500/5",
		"from-rose-500/10 to-pink-500/5",
		"from-violet-500/10 to-indigo-500/5",
	];

	return (
		<div
			className={`bg-gradient-to-br ${gradients[index % 3]} border border-border rounded-xl p-5 md:p-6`}
		>
			<div className="flex items-start justify-between gap-3 mb-3">
				<a
					href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(movie.title)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="text-xl md:text-2xl font-black text-foreground leading-tight hover:text-primary transition-colors"
				>
					{movie.title}
				</a>
				<span className="shrink-0 w-8 h-8 rounded-full bg-primary/15 text-primary text-sm font-bold flex items-center justify-center">
					{index + 1}
				</span>
			</div>

			<div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground mb-4">
				<span className="flex items-center gap-1.5">
					<User size={14} />
					{movie.director}
				</span>
				<span className="flex items-center gap-1.5">
					<Calendar size={14} />
					{movie.year}年
				</span>
				<span className="flex items-center gap-1.5">
					<Tag size={14} />
					{movie.genre}
				</span>
			</div>

			<div className="flex gap-3 mb-4">
				<Clapperboard size={18} className="shrink-0 text-primary mt-0.5" />
				<p className="text-sm leading-relaxed text-foreground/85">
					{movie.reason}
				</p>
			</div>

			<div className="flex flex-wrap gap-x-4 gap-y-2">
				<a
					href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(movie.title)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
				>
					<BookOpen size={14} />
					Wikipedia
				</a>
				<a
					href={`https://www.amazon.co.jp/s?k=${encodeURIComponent(movie.title + " DVD")}&i=dvd&tag=southerncro08-22`}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-1.5 text-sm text-primary/80 hover:text-primary transition-colors"
				>
					<ExternalLink size={14} />
					Amazonで探す
				</a>
			</div>
		</div>
	);
}
