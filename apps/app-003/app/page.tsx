"use client";

import { RefreshCw, RotateCcw, Search, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { MoodChips } from "@/components/mood-chips";
import { FadeIn, PressScale, Stagger, StaggerItem } from "@/components/motion";
import { MovieInput } from "@/components/movie-input";
import { ResultCard } from "@/components/result-card";
import { ShareButton } from "@/components/share-button";

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

const SAMPLE_MOVIES = ["千と千尋の神隠し", "インターステラー", ""];

export default function Home() {
	const [movies, setMovies] = useState(["", "", ""]);
	const [moods, setMoods] = useState<string[]>([]);
	const [result, setResult] = useState<Result | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [previousTitles, setPreviousTitles] = useState<string[]>([]);
	const [loadingMsg, setLoadingMsg] = useState(0);

	useEffect(() => {
		if (!loading) return;
		setLoadingMsg(0);
		const timer = setTimeout(() => setLoadingMsg(1), 2000);
		return () => clearTimeout(timer);
	}, [loading]);

	const canSubmit = movies.some((m) => m.trim() !== "") && !loading;

	const handleSubmit = async (excludeTitles: string[] = []) => {
		setLoading(true);
		setError("");
		setResult(null);

		try {
			const res = await fetch("/api/recommend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ movies, moods, excludeTitles }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "エラーが発生しました");
			}

			const data = await res.json();
			setResult(data);
			setPreviousTitles((prev) => [
				...prev,
				...data.recommendations.map((r: Recommendation) => r.title),
			]);
		} catch (e) {
			setError(e instanceof Error ? e.message : "エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	const handleMoreLikeThis = () => {
		handleSubmit(previousTitles);
	};

	const handleReset = () => {
		setMovies(["", "", ""]);
		setMoods([]);
		setResult(null);
		setError("");
		setPreviousTitles([]);
	};

	const handleSample = () => {
		setMovies([...SAMPLE_MOVIES]);
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
								{movies.every((m) => m === "") && (
									<button
										type="button"
										onClick={handleSample}
										className="mt-2 text-xs text-primary/70 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
									>
										<Zap size={12} />
										迷ったらこれで試す
									</button>
								)}
							</section>

							<section>
								<div className="flex items-baseline gap-2 mb-3">
									<h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
										今の気分
									</h2>
									<span className="text-xs text-muted-foreground/60">
										選ぶとより精度アップ
									</span>
								</div>
								<MoodChips selected={moods} onChange={setMoods} />
							</section>

							<PressScale>
								<button
									type="button"
									onClick={() => handleSubmit()}
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
								{loadingMsg === 0
									? "あなたの好みを分析中..."
									: "最適な映画を探しています..."}
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
							<ShareButton recommendations={result.recommendations} />

							<div className="grid grid-cols-2 gap-3 mt-3">
								<button
									type="button"
									onClick={handleMoreLikeThis}
									className="py-3 border border-primary/30 text-primary rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary/10 cursor-pointer text-sm font-medium"
								>
									<RefreshCw size={15} />
									この方向でもっと
								</button>
								<button
									type="button"
									onClick={handleReset}
									className="py-3 border border-border text-muted-foreground rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:text-foreground hover:border-primary/50 cursor-pointer text-sm"
								>
									<RotateCcw size={15} />
									最初からやり直す
								</button>
							</div>
						</FadeIn>
					</div>
				)}
			</div>
		</div>
	);
}
