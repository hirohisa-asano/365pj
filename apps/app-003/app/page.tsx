"use client";

import { RotateCcw, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { MoodChips } from "@/components/mood-chips";
import { FadeIn, PressScale, Stagger, StaggerItem } from "@/components/motion";
import { MovieInput } from "@/components/movie-input";
import { ResultCard } from "@/components/result-card";

type Recommendation = {
	title: string;
	director: string;
	year: number;
	genre: string;
	reason: string;
};

type Result = {
	analysis: string;
	recommendations: Recommendation[];
};

export default function Home() {
	const [movies, setMovies] = useState(["", "", ""]);
	const [moods, setMoods] = useState<string[]>([]);
	const [result, setResult] = useState<Result | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const canSubmit = movies.some((m) => m.trim() !== "") && !loading;

	const handleSubmit = async () => {
		setLoading(true);
		setError("");
		setResult(null);

		try {
			const res = await fetch("/api/recommend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ movies, moods }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "エラーが発生しました");
			}

			const data = await res.json();
			setResult(data);
		} catch (e) {
			setError(e instanceof Error ? e.message : "エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setMovies(["", "", ""]);
		setMoods([]);
		setResult(null);
		setError("");
	};

	return (
		<div className="min-h-screen px-4 py-12 md:py-20">
			<div className="max-w-xl mx-auto">
				<FadeIn>
					<header className="mb-10 md:mb-14">
						<h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
							<span className="text-primary">Film</span>Pick
						</h1>
						<p className="text-muted-foreground text-base md:text-lg leading-relaxed">
							好きな映画と今の気分を教えてください。
							<br className="hidden md:block" />
							あなたの好みを分析して、次に観るべき映画を見つけます。
						</p>
					</header>
				</FadeIn>

				{!result && !loading && (
					<FadeIn delay={0.1}>
						<div className="space-y-8">
							<section>
								<h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
									好きな映画
								</h2>
								<MovieInput movies={movies} onChange={setMovies} />
							</section>

							<section>
								<h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
									今の気分
								</h2>
								<MoodChips selected={moods} onChange={setMoods} />
							</section>

							<PressScale>
								<button
									type="button"
									onClick={handleSubmit}
									disabled={!canSubmit}
									className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:brightness-110"
								>
									<Search size={18} />
									映画を探す
								</button>
							</PressScale>
						</div>
					</FadeIn>
				)}

				{loading && (
					<FadeIn className="mt-12 text-center">
						<div className="inline-flex items-center gap-3 text-primary">
							<Sparkles size={22} className="animate-pulse-slow" />
							<span className="text-lg font-bold animate-pulse-slow">
								あなたの好みを分析中...
							</span>
						</div>
					</FadeIn>
				)}

				{error && (
					<FadeIn className="mt-8">
						<p className="text-red-400 text-center">{error}</p>
					</FadeIn>
				)}

				{result && (
					<div className="mt-2 space-y-8">
						<FadeIn>
							<div className="bg-muted border border-border rounded-xl p-5">
								<h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
									あなたの趣味傾向
								</h2>
								<p className="text-foreground leading-relaxed">
									{result.analysis}
								</p>
							</div>
						</FadeIn>

						<div>
							<h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
								おすすめの3本
							</h2>
							<Stagger className="space-y-4">
								{result.recommendations.map((movie, i) => (
									<StaggerItem key={movie.title}>
										<ResultCard movie={movie} index={i} />
									</StaggerItem>
								))}
							</Stagger>
						</div>

						<FadeIn delay={0.5}>
							<button
								type="button"
								onClick={handleReset}
								className="w-full py-3 border border-border text-muted-foreground rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:text-foreground hover:border-primary/50 cursor-pointer"
							>
								<RotateCcw size={16} />
								もう一度探す
							</button>
						</FadeIn>
					</div>
				)}
			</div>
		</div>
	);
}
