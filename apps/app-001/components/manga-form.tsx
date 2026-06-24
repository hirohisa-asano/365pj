"use client";

import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MOOD_TAGS = [
	{ label: "🔥 熱い展開", value: "熱い展開" },
	{ label: "🤔 考えさせられる", value: "考えさせられる" },
	{ label: "☀️ ほのぼの", value: "ほのぼの" },
	{ label: "🌑 ダーク", value: "ダーク" },
	{ label: "😂 笑える", value: "笑える" },
	{ label: "😭 泣ける", value: "泣ける" },
	{ label: "🔍 サスペンス", value: "サスペンス" },
	{ label: "💕 恋愛", value: "恋愛" },
	{ label: "⚔️ 冒険", value: "冒険" },
	{ label: "🍵 日常系", value: "日常系" },
	{ label: "👑 メジャー", value: "有名・メジャーな作品" },
	{ label: "💎 マイナー", value: "隠れた名作・マイナーな作品" },
];

const GENRE_COLORS: Record<string, string> = {
	少年漫画: "#F97316",
	少女漫画: "#EC4899",
	青年漫画: "#3B82F6",
	女性漫画: "#A855F7",
	SF: "#06B6D4",
	ファンタジー: "#10B981",
	ホラー: "#6B7280",
	スポーツ: "#EAB308",
	ギャグ: "#F59E0B",
	歴史: "#92400E",
};

type Recommendation = {
	title: string;
	author: string;
	genre: string;
	reason: string;
};

export function MangaForm() {
	const [favorites, setFavorites] = useState([{ id: "fav-1", value: "" }]);
	const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
	const [freeText, setFreeText] = useState("");
	const [results, setResults] = useState<Recommendation[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [limitType, setLimitType] = useState<"login" | "member" | null>(null);
	const [guestCount, setGuestCount] = useState(() => {
		if (typeof window === "undefined") return 0;
		return Number(localStorage.getItem("manga-ai-count") || "0");
	});

	const handleAddFavorite = () => {
		if (favorites.length < 3) {
			setFavorites([...favorites, { id: `fav-${Date.now()}`, value: "" }]);
		}
	};

	const handleFavoriteChange = (id: string, value: string) => {
		setFavorites(favorites.map((f) => (f.id === id ? { ...f, value } : f)));
	};

	const toggleMood = (value: string) => {
		setSelectedMoods((prev) =>
			prev.includes(value)
				? prev.filter((m) => m !== value)
				: prev.length < 3
					? [...prev, value]
					: prev,
		);
	};

	const handleLogin = async () => {
		const supabase = createClient();
		await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: `${window.location.origin}/auth/callback`,
			},
		});
	};

	const handleSubmit = async () => {
		const validFavorites = favorites
			.map((f) => f.value)
			.filter((v) => v.trim());
		if (validFavorites.length === 0) {
			setError("好きな漫画を1つ以上入力してね");
			return;
		}

		setLoading(true);
		setError("");
		setLimitType(null);
		setResults([]);

		try {
			const res = await fetch("/api/recommend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					favorites: validFavorites,
					mood: selectedMoods.join("、"),
					freeText,
					guestCount,
				}),
			});

			const data = await res.json();

			if (data.error === "limit") {
				setLimitType(data.limitType);
			} else if (data.error) {
				setError(data.error);
			} else {
				setResults(data.recommendations);
				const newCount = guestCount + 1;
				setGuestCount(newCount);
				localStorage.setItem("manga-ai-count", String(newCount));
			}
		} catch {
			setError("通信エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	const getGenreColor = (genre: string) => {
		for (const [key, color] of Object.entries(GENRE_COLORS)) {
			if (genre.includes(key)) return color;
		}
		return "#F97316";
	};

	return (
		<div>
			{/* 入力 — コンパクトにまとめる */}
			<div className="space-y-4 pb-6 border-b border-border">
				<div>
					<div className="space-y-1.5">
						{favorites.map((fav, i) => (
							<input
								key={fav.id}
								type="text"
								value={fav.value}
								onChange={(e) =>
									handleFavoriteChange(fav.id, e.target.value)
								}
								placeholder={
									i === 0
										? "好きな漫画（例: ワンピース）"
										: i === 1
											? "もう1つ（例: スラムダンク）"
											: "もう1つ（例: ハイキュー!!）"
								}
								aria-label={`好きな漫画 ${i + 1}`}
								className="w-full px-3 py-2.5 rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary text-sm"
							/>
						))}
					</div>
					{favorites.length < 3 && (
						<button
							type="button"
							onClick={handleAddFavorite}
							className="mt-1 text-[11px] text-primary hover:underline"
						>
							+ 追加
						</button>
					)}
				</div>

				<div className="flex flex-wrap gap-1">
					{MOOD_TAGS.map((mood) => (
						<button
							key={mood.value}
							type="button"
							onClick={() => toggleMood(mood.value)}
							className={`text-[11px] px-2.5 py-1 rounded-full transition-all ${
								selectedMoods.includes(mood.value)
									? "bg-primary text-primary-foreground"
									: "bg-muted/60 text-muted-foreground hover:bg-muted"
							}`}
						>
							{mood.label}
						</button>
					))}
				</div>

				<div className="flex gap-2">
					<input
						id="free-text"
						type="text"
						value={freeText}
						onChange={(e) => setFreeText(e.target.value)}
						placeholder="こだわり（完結済み、10巻以内 など）"
						aria-label="こだわり"
						className="flex-1 px-3 py-2.5 rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary text-sm"
					/>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={loading}
						className="shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-[var(--radius)] bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
					>
						{loading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Sparkles className="h-4 w-4" />
						)}
						{loading ? "探索中" : "探す"}
					</button>
				</div>

				{error && (
					<p className="text-xs text-red-500">{error}</p>
				)}
			</div>

			{/* 結果 — 主役。広い余白で読みやすく */}
			{results.length > 0 && (
				<div className="pt-8">
					<div className="flex items-center justify-between mb-6">
						<p className="text-sm font-medium">
							あなたにはこれがハマるかも
						</p>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={loading}
							className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
						>
							<RotateCcw className="h-3 w-3" />
							別の提案
						</button>
					</div>
					<div className="space-y-5">
						{results.map((rec, idx) => (
							<div
								key={rec.title}
								className="flex gap-4"
							>
								<div className="flex flex-col items-center gap-1 pt-0.5">
									<span
										className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center text-white"
										style={{ backgroundColor: getGenreColor(rec.genre) }}
									>
										{idx + 1}
									</span>
								</div>
								<a
									href={`/api/link?q=${encodeURIComponent(rec.title)}`}
									target="_blank"
									rel="noopener noreferrer"
									className="min-w-0 pb-5 border-b border-border/50 flex-1 group"
								>
									<h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
										{rec.title}
										<span className="text-[10px] font-normal text-muted-foreground/40 ml-1.5 group-hover:text-primary/50">↗</span>
									</h3>
									<p className="text-xs text-muted-foreground mt-0.5">
										{rec.author} · {rec.genre}
									</p>
									<p className="text-sm mt-2 leading-relaxed text-foreground/80">
										{rec.reason}
									</p>
								</a>
							</div>
						))}
					</div>
				</div>
			)}

			{/* 制限メッセージ */}
			{limitType === "login" && (
				<div className="pt-8 text-center space-y-3">
					<p className="text-sm text-foreground">無料枠を使い切りました</p>
					<p className="text-xs text-muted-foreground">
						ログインすると1日10回まで使えます
					</p>
					<button
						type="button"
						onClick={handleLogin}
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius)] bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
					>
						Googleでログイン
					</button>
				</div>
			)}

			{limitType === "member" && (
				<div className="pt-8 text-center space-y-3">
					<p className="text-sm text-foreground">
						本日の利用上限（10回）に達しました
					</p>
					<p className="text-xs text-muted-foreground">
						メンバーになると無制限で使えます
					</p>
					<a
						href="https://southerncrosslab.com"
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius)] bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
					>
						メンバーになる
					</a>
				</div>
			)}
		</div>
	);
}
