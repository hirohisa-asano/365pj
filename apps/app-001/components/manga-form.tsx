"use client";

import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

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
		setResults([]);

		try {
			const res = await fetch("/api/recommend", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					favorites: validFavorites,
					mood: selectedMoods.join("、"),
					freeText,
				}),
			});

			const data = await res.json();

			if (data.error) {
				setError(data.error);
			} else {
				setResults(data.recommendations);
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
		<div className="space-y-8">
			{/* 入力 */}
			<div className="space-y-5">
				<div>
					<p className="text-xs font-medium text-muted-foreground mb-2">
						好きな漫画を教えて（1〜3作品）
					</p>
					<div className="space-y-2">
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
										? "例: ワンピース"
										: i === 1
											? "例: スラムダンク"
											: "例: ハイキュー!!"
								}
								aria-label={`好きな漫画 ${i + 1}`}
								className="w-full px-4 py-3 rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary text-sm"
							/>
						))}
					</div>
					{favorites.length < 3 && (
						<button
							type="button"
							onClick={handleAddFavorite}
							className="mt-1.5 text-xs text-primary hover:underline"
						>
							+ もう1作品追加
						</button>
					)}
				</div>

				<div>
					<p className="text-xs font-medium text-muted-foreground mb-2">
						今の気分は？（3つまで）
					</p>
					<div className="flex flex-wrap gap-1.5">
						{MOOD_TAGS.map((mood) => (
							<button
								key={mood.value}
								type="button"
								onClick={() => toggleMood(mood.value)}
								className={`text-xs px-3 py-1.5 rounded-full transition-all ${
									selectedMoods.includes(mood.value)
										? "bg-primary text-primary-foreground scale-105 shadow-sm"
										: "bg-muted text-muted-foreground hover:bg-muted/80"
								}`}
							>
								{mood.label}
							</button>
						))}
					</div>
				</div>

				<div>
					<label
						htmlFor="free-text"
						className="text-xs font-medium text-muted-foreground mb-2 block"
					>
						こだわりがあれば（任意）
					</label>
					<textarea
						id="free-text"
						value={freeText}
						onChange={(e) => setFreeText(e.target.value)}
						placeholder="完結済み、絵がきれい、10巻以内 など"
						rows={2}
						className="w-full px-4 py-3 rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary resize-none text-sm"
					/>
				</div>

				<button
					type="button"
					onClick={handleSubmit}
					disabled={loading}
					className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-[var(--radius)] bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
				>
					{loading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							探してる...
						</>
					) : (
						<>
							<Sparkles className="h-4 w-4" />
							おすすめを見つける
						</>
					)}
				</button>

				{error && (
					<p className="text-xs text-red-500 text-center">{error}</p>
				)}
			</div>

			{/* 結果 */}
			{results.length > 0 && (
				<div>
					<div className="flex items-center justify-between mb-4">
						<p className="text-xs text-muted-foreground">
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
					<div className="space-y-3">
						{results.map((rec) => (
							<div
								key={rec.title}
								className="flex gap-3 p-4 rounded-[var(--radius)] border border-border bg-background"
							>
								<div
									className="w-1 shrink-0 rounded-full"
									style={{
										backgroundColor: getGenreColor(rec.genre),
									}}
								/>
								<div className="min-w-0">
									<div className="flex items-baseline gap-2">
										<h3 className="font-bold text-base">
											{rec.title}
										</h3>
										<span className="text-[10px] text-muted-foreground shrink-0">
											{rec.genre}
										</span>
									</div>
									<p className="text-xs text-muted-foreground mt-0.5">
										{rec.author}
									</p>
									<p className="text-sm mt-2 leading-relaxed">
										{rec.reason}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
