"use client";

import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";

const MOOD_TAGS = [
	"熱い展開",
	"考えさせられる",
	"ほのぼの",
	"ダーク",
	"笑える",
	"泣ける",
	"サスペンス",
	"恋愛",
	"冒険",
	"日常系",
];

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

	const toggleMood = (mood: string) => {
		setSelectedMoods((prev) =>
			prev.includes(mood)
				? prev.filter((m) => m !== mood)
				: prev.length < 3
					? [...prev, mood]
					: prev,
		);
	};

	const handleSubmit = async () => {
		const validFavorites = favorites
			.map((f) => f.value)
			.filter((v) => v.trim());
		if (validFavorites.length === 0) {
			setError("好きな漫画を1つ以上入力してください");
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

	return (
		<div className="space-y-8">
			{/* 入力エリア */}
			<div className="space-y-6">
				{/* 好きな漫画 */}
				<div>
					<p className="text-sm font-medium mb-2">好きな漫画（1〜3作品）</p>
					<div className="space-y-2">
						{favorites.map((fav, i) => (
							<input
								key={fav.id}
								type="text"
								value={fav.value}
								onChange={(e) => handleFavoriteChange(fav.id, e.target.value)}
								placeholder={`作品名を入力${i === 0 ? "（必須）" : ""}`}
								aria-label={`好きな漫画 ${i + 1}`}
								className="w-full px-4 py-3 rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
							/>
						))}
					</div>
					{favorites.length < 3 && (
						<button
							type="button"
							onClick={handleAddFavorite}
							className="mt-2 text-xs text-primary hover:underline"
						>
							+ 作品を追加
						</button>
					)}
				</div>

				{/* 気分タグ */}
				<div>
					<p className="text-sm font-medium mb-2">
						読みたい雰囲気（3つまで選択）
					</p>
					<div className="flex flex-wrap gap-2">
						{MOOD_TAGS.map((mood) => (
							<button
								key={mood}
								type="button"
								onClick={() => toggleMood(mood)}
								className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
									selectedMoods.includes(mood)
										? "bg-primary text-primary-foreground border-primary"
										: "border-border text-muted-foreground hover:border-primary hover:text-primary"
								}`}
							>
								{mood}
							</button>
						))}
					</div>
				</div>

				{/* フリーテキスト */}
				<div>
					<label htmlFor="free-text" className="block text-sm font-medium mb-2">
						追加の好み（任意）
					</label>
					<textarea
						id="free-text"
						value={freeText}
						onChange={(e) => setFreeText(e.target.value)}
						placeholder="例: 絵がきれいな作品がいい、完結済みの作品がいい"
						rows={2}
						className="w-full px-4 py-3 rounded-[var(--radius)] border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
					/>
				</div>

				{/* 送信ボタン */}
				<button
					type="button"
					onClick={handleSubmit}
					disabled={loading}
					className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius)] bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							提案中...
						</>
					) : (
						<>
							<Sparkles className="h-4 w-4" />
							漫画を提案してもらう
						</>
					)}
				</button>

				{error && <p className="text-sm text-red-500 text-center">{error}</p>}
			</div>

			{/* 結果エリア */}
			{results.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-medium">あなたにおすすめの漫画</h2>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={loading}
							className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
						>
							<RotateCcw className="h-3 w-3" />
							もう一度提案
						</button>
					</div>
					<div className="space-y-3">
						{results.map((rec) => (
							<div
								key={rec.title}
								className="p-4 rounded-[var(--radius)] border border-border bg-muted/50"
							>
								<div className="flex items-start justify-between gap-2">
									<h3 className="font-medium">{rec.title}</h3>
									<span className="text-xs text-muted-foreground whitespace-nowrap">
										{rec.genre}
									</span>
								</div>
								<p className="text-xs text-muted-foreground mt-1">
									{rec.author}
								</p>
								<p className="text-sm mt-2 text-foreground/80">{rec.reason}</p>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
