"use client";

import { ArrowRight, ClipboardCopy, LogIn, RotateCcw, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { BucketItem } from "@/components/bucket-item";
import { FadeIn, PressScale, Stagger, StaggerItem } from "@/components/motion";
import { QuestionStep } from "@/components/question-step";
import { ShareButton } from "@/components/share-button";

type BucketListItem = {
	emoji: string;
	title: string;
	reason: string;
};

const QUESTIONS = [
	{
		question: "お金も時間も無限にあったら、\n明日何をする？",
		placeholder: "例: 宇宙旅行に行く、世界中の美術館を巡る...",
	},
	{
		question: "人生で一番\n楽しかった瞬間は？",
		placeholder: "例: 友人と夜通し語り合った夜、初めて海外に行った日...",
	},
	{
		question: "死ぬ時に\n「あれやっておけばよかった」\nと思いそうなことは？",
		placeholder: "例: もっと挑戦すればよかった、親孝行...",
	},
];

const RATE_LIMIT_KEY = "bucketai_last_gen";

function isRateLimited(): boolean {
	try {
		const last = localStorage.getItem(RATE_LIMIT_KEY);
		if (!last) return false;
		const lastDate = new Date(last).toDateString();
		const today = new Date().toDateString();
		return lastDate === today;
	} catch {
		return false;
	}
}

function markUsed(): void {
	try {
		localStorage.setItem(RATE_LIMIT_KEY, new Date().toISOString());
	} catch {
		// ignore
	}
}

export default function Home() {
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState(["", "", ""]);
	const [items, setItems] = useState<BucketListItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [loadingMsg, setLoadingMsg] = useState(0);

	useEffect(() => {
		// Check if user is logged in by looking for supabase auth cookies
		const checkAuth = async () => {
			try {
				const res = await fetch("/api/auth-check");
				if (res.ok) {
					const data = await res.json();
					setIsLoggedIn(data.loggedIn);
				}
			} catch {
				// Not logged in
			}
		};
		checkAuth();
	}, []);

	useEffect(() => {
		if (!loading) return;
		setLoadingMsg(0);
		const t1 = setTimeout(() => setLoadingMsg(1), 2000);
		const t2 = setTimeout(() => setLoadingMsg(2), 4500);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
		};
	}, [loading]);

	const currentAnswer = answers[step] ?? "";
	const canNext = currentAnswer.trim().length > 0;
	const showResult = items.length > 0;

	const handleNext = () => {
		if (step < 2) {
			setStep(step + 1);
		}
	};

	const handleGenerate = async () => {
		if (!isLoggedIn && isRateLimited()) {
			setError(
				"未ログインでは1日1回までです。ログインするとより多く利用できます。",
			);
			return;
		}

		setLoading(true);
		setError("");
		setItems([]);

		try {
			const res = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ answers }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || "エラーが発生しました");
			}

			const data = await res.json();
			setItems(data.items);
			if (!isLoggedIn) {
				markUsed();
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setStep(0);
		setAnswers(["", "", ""]);
		setItems([]);
		setError("");
	};

	const handleSample = () => {
		setAnswers([
			"好きな人と世界中を旅する",
			"友達と朝まで語り合った夜",
			"もっと挑戦すればよかった",
		]);
	};

	const handleCopyList = () => {
		const text = visibleItems
			.map((item, i) => `${i + 1}. ${item.emoji} ${item.title}`)
			.join("\n");
		navigator.clipboard.writeText(text);
	};

	const updateAnswer = (value: string) => {
		const next = [...answers];
		next[step] = value;
		setAnswers(next);
	};

	const loadingMessages = [
		"あなたの人生を読み解いています...",
		"価値観を分析しています...",
		"あなただけのリストを作成中...",
	];

	const visibleItems = isLoggedIn ? items : items.slice(0, 5);
	const lockedItems = isLoggedIn ? [] : items.slice(5);

	return (
		<div className="min-h-screen px-4 py-12 md:py-20">
			<div className="max-w-xl mx-auto">
				{/* Header */}
				<FadeIn>
					<header className="mb-12 md:mb-16">
						<h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
							<span className="text-primary">Bucket</span>AI
						</h1>
						<p className="text-muted-foreground text-base md:text-lg leading-relaxed">
							3つの質問に答えるだけ。
							<br />
							AIがあなただけの「やりたいことリスト」を作ります。
						</p>
					</header>
				</FadeIn>

				{/* Questions */}
				{!showResult && !loading && (
					<FadeIn key={`q-${step}`} direction="left">
						<div className="space-y-8">
							<div className="flex items-center gap-2 text-xs text-muted-foreground">
								{QUESTIONS.map((_, i) => (
									<div
										key={`dot-${
											// biome-ignore lint/suspicious/noArrayIndexKey: static array
											i
										}`}
										className={`h-1 flex-1 rounded-full transition-colors ${
											i <= step ? "bg-primary" : "bg-border"
										}`}
									/>
								))}
							</div>

							<p className="text-sm text-muted-foreground">
									Q{step + 1} / {QUESTIONS.length}
								</p>

								<QuestionStep
									question={QUESTIONS[step].question}
									value={currentAnswer}
									onChange={updateAnswer}
									placeholder={QUESTIONS[step].placeholder}
								/>

								{step === 0 && answers.every((a) => a === "") && (
									<button
										type="button"
										onClick={handleSample}
										className="text-xs text-primary/70 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
									>
										<Zap size={12} />
										迷ったらこれで試す
									</button>
								)}

							<PressScale>
								{step < 2 ? (
									<button
										type="button"
										onClick={handleNext}
										disabled={!canNext}
										className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:brightness-110"
									>
										次へ
										<ArrowRight size={18} />
									</button>
								) : (
									<button
										type="button"
										onClick={handleGenerate}
										disabled={!canNext}
										className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:brightness-110"
									>
										<Sparkles size={18} />
										リストを生成する
									</button>
								)}
							</PressScale>
						</div>
					</FadeIn>
				)}

				{/* Loading */}
				{loading && (
					<FadeIn className="mt-12 text-center">
						<div className="inline-flex items-center gap-3 text-primary">
							<Sparkles size={22} className="animate-pulse-slow" />
							<span className="text-lg font-bold animate-pulse-slow">
								{loadingMessages[loadingMsg]}
							</span>
						</div>
					</FadeIn>
				)}

				{/* Error */}
				{error && (
					<FadeIn className="mt-8">
						<p className="text-red-400 text-center">{error}</p>
					</FadeIn>
				)}

				{/* Results */}
				{showResult && (
					<div className="mt-2 space-y-4">
						<FadeIn>
							<h2 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">
								あなたのバケットリスト
							</h2>
						</FadeIn>

						<Stagger className="space-y-3">
							{visibleItems.map((item, i) => (
								<StaggerItem key={item.title}>
									<BucketItem
										index={i}
										emoji={item.emoji}
										title={item.title}
										reason={item.reason}
									/>
								</StaggerItem>
							))}
						</Stagger>

						{/* Locked items for non-logged-in users */}
						{lockedItems.length > 0 && (
							<FadeIn delay={0.5}>
								<div className="relative mt-2">
									<div className="space-y-3">
										{lockedItems.map((item, i) => (
											<BucketItem
												key={item.title}
												index={i + 5}
												emoji={item.emoji}
												title={item.title}
												reason={item.reason}
												locked
											/>
										))}
									</div>
									<div className="absolute inset-0 flex items-center justify-center">
										<div className="bg-muted border border-border rounded-xl px-6 py-4 text-center shadow-lg">
											<LogIn size={20} className="mx-auto mb-2 text-primary" />
											<p className="text-sm font-medium text-foreground">
												ログインすると全て見れます
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												残り5個のリストが表示されます
											</p>
										</div>
									</div>
								</div>
							</FadeIn>
						)}

						<FadeIn delay={0.6}>
							<div className="space-y-3 mt-6">
								<ShareButton items={visibleItems} />
								<button
									type="button"
									onClick={handleCopyList}
									className="w-full py-3 bg-muted border border-border text-foreground rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:border-primary/50 cursor-pointer text-sm"
								>
									<ClipboardCopy size={15} />
									リストをコピー
								</button>
								<button
									type="button"
									onClick={handleReset}
									className="w-full py-3 border border-border text-muted-foreground rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:text-foreground hover:border-primary/50 cursor-pointer text-sm"
								>
									<RotateCcw size={15} />
									もう一度やる
								</button>
							</div>
						</FadeIn>
					</div>
				)}
			</div>
		</div>
	);
}
