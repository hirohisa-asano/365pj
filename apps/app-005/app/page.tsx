"use client";

import { Heart, History, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { CheerCard } from "@/components/cheer-card";
import { CrisisCard } from "@/components/crisis-card";
import { MoodPicker } from "@/components/mood-picker";
import { FadeIn, PressScale } from "@/components/motion";
import { PersonaPicker } from "@/components/persona-picker";
import { ToneSlider } from "@/components/tone-slider";
import { getMood } from "@/lib/moods";
import { getPersona } from "@/lib/personas";

const RATE_KEY = "yoshiyoshi_usage";
const LOG_KEY = "yoshiyoshi_log";
const NICK_KEY = "yoshiyoshi_nickname";
const FREE_LIMIT = 3;

type CrisisData = {
	message: string;
	resources: { name: string; detail: string; tel: string }[];
};

type LogEntry = {
	id: number;
	text: string;
	message: string;
	personaId: string;
};

function todayKey(): string {
	return new Date().toDateString();
}

function getUsage(): number {
	try {
		const raw = localStorage.getItem(RATE_KEY);
		if (!raw) return 0;
		const { date, count } = JSON.parse(raw);
		return date === todayKey() ? count : 0;
	} catch {
		return 0;
	}
}

function bumpUsage(): void {
	try {
		localStorage.setItem(
			RATE_KEY,
			JSON.stringify({ date: todayKey(), count: getUsage() + 1 }),
		);
	} catch {
		// ignore
	}
}

export default function Home() {
	const [moodId, setMoodId] = useState("normal");
	const [personaId, setPersonaId] = useState("oshi");
	const [toneLevel, setToneLevel] = useState(2);
	const [nickname, setNickname] = useState("");
	const [custom, setCustom] = useState("");
	const [text, setText] = useState("");
	const [message, setMessage] = useState("");
	const [crisis, setCrisis] = useState<CrisisData | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isMember, setIsMember] = useState(false);
	const [log, setLog] = useState<LogEntry[]>([]);
	const [showLog, setShowLog] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch("/api/auth-check");
				if (res.ok) {
					const data = await res.json();
					setIsLoggedIn(data.loggedIn);
					setIsMember(data.isMember);
				}
			} catch {
				// not logged in
			}
		})();
		try {
			const raw = localStorage.getItem(LOG_KEY);
			if (raw) setLog(JSON.parse(raw));
			const savedNick = localStorage.getItem(NICK_KEY);
			if (savedNick) setNickname(savedNick);
		} catch {
			// ignore
		}
	}, []);

	const showResult = message !== "" || crisis !== null;
	const canSubmit = text.trim().length > 0 && !loading;

	const handleSubmit = async () => {
		if (!isLoggedIn && getUsage() >= FREE_LIMIT) {
			setError(
				"未ログインでは1日3回までです。ログインすると回数無制限になります。",
			);
			return;
		}

		setLoading(true);
		setError("");
		setMessage("");
		setCrisis(null);
		try {
			localStorage.setItem(NICK_KEY, nickname);
		} catch {
			// ignore
		}

		try {
			const res = await fetch("/api/cheer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text,
					personaId,
					toneLevel,
					moodId,
					nickname,
					custom: isMember ? custom : "",
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "エラーが発生しました");

			if (data.crisis) {
				setCrisis({ message: data.message, resources: data.resources });
			} else {
				setMessage(data.message);
				if (!isLoggedIn) bumpUsage();
				if (isLoggedIn) {
					const entry: LogEntry = {
						id: Date.now(),
						text,
						message: data.message,
						personaId,
					};
					const next = [entry, ...log].slice(0, 30);
					setLog(next);
					try {
						localStorage.setItem(LOG_KEY, JSON.stringify(next));
					} catch {
						// ignore
					}
				}
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "エラーが発生しました");
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => {
		setText("");
		setMessage("");
		setCrisis(null);
		setError("");
	};

	const handleSample = () => {
		setText("今日も昼まで寝てて、やろうと思ってたこと全部できなかった…");
	};

	return (
		<div className="min-h-screen px-4 py-12 md:py-16">
			<div className="max-w-md mx-auto">
				<FadeIn>
					<header className="mb-8 text-center">
						<div
							className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl"
							style={{
								background:
									"radial-gradient(circle at 50% 35%, #FFE1D2 0%, #FFF1E8 100%)",
							}}
						>
							🫂
						</div>
						<h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
							よしよし<span className="text-primary">AI</span>
						</h1>
						<p className="text-muted-foreground text-sm md:text-base leading-relaxed">
							今日の調子とダメだったこと、聞かせて。
							<br />
							AIが体調を気づかって全力で「よしよし」します。
						</p>
					</header>
				</FadeIn>

				{!showResult && !loading && (
					<FadeIn>
						<div className="space-y-6">
							<MoodPicker selected={moodId} onSelect={setMoodId} />
							<PersonaPicker
								selected={personaId}
								onSelect={setPersonaId}
								canUsePremium={isLoggedIn}
							/>

							<div className="space-y-1.5">
								<p className="text-sm font-bold text-muted-foreground">
									ニックネーム（呼んでほしい名前・任意）
								</p>
								<input
									type="text"
									value={nickname}
									onChange={(e) => setNickname(e.target.value)}
									placeholder="例: ゆう、ゆうくん、社長"
									maxLength={20}
									className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
								/>
							</div>

							<ToneSlider
								level={toneLevel}
								onChange={setToneLevel}
								fullRange={isLoggedIn}
							/>

							{isMember && (
								<div className="space-y-1.5">
									<p className="text-sm font-bold text-muted-foreground">
										口調の希望（サポーター向け）
									</p>
									<input
										type="text"
										value={custom}
										onChange={(e) => setCustom(e.target.value)}
										placeholder="例: 「〇〇ちゃん」と呼んで／関西弁で"
										maxLength={100}
										className="w-full rounded-2xl border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
									/>
								</div>
							)}

							<div className="space-y-2">
								<textarea
									value={text}
									onChange={(e) => setText(e.target.value)}
									placeholder="例: 今日も何もできなかった。自分が情けない…"
									maxLength={500}
									rows={4}
									className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-base outline-none focus:border-primary resize-none"
								/>
								<button
									type="button"
									onClick={handleSample}
									className="text-xs text-primary/80 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
								>
									<Zap size={12} />
									迷ったらこれで試す
								</button>
							</div>

							<PressScale>
								<button
									type="button"
									onClick={handleSubmit}
									disabled={!canSubmit}
									className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
								>
									<Heart size={18} />
									よしよししてもらう
								</button>
							</PressScale>

							{error && (
								<p className="rounded-2xl bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-center text-foreground leading-relaxed">
									{error}
								</p>
							)}

							<p className="text-[11px] text-muted-foreground text-center leading-relaxed">
								これは医療・治療を目的としたサービスではありません。
								<br />
								入力内容は端末内のみで扱い、サーバーに保存しません。
							</p>
						</div>
					</FadeIn>
				)}

				{loading && (
					<FadeIn className="mt-12 text-center">
						<div className="inline-flex items-center gap-3 text-primary">
							<Sparkles size={22} className="animate-pulse-slow" />
							<span className="text-lg font-bold animate-pulse-slow">
								よしよしの準備中...
							</span>
						</div>
					</FadeIn>
				)}

				{crisis && (
					<FadeIn className="mt-2">
						<CrisisCard message={crisis.message} resources={crisis.resources} />
						<button
							type="button"
							onClick={handleReset}
							className="w-full mt-4 py-3 border border-border text-muted-foreground rounded-2xl transition-all hover:text-foreground hover:border-primary/50 cursor-pointer text-sm"
						>
							戻る
						</button>
					</FadeIn>
				)}

				{message && !crisis && (
					<FadeIn className="mt-2">
						<div className="mb-3 text-center text-xs text-muted-foreground">
							今日の調子: {getMood(moodId).emoji} {getMood(moodId).label}
						</div>
						<CheerCard
							persona={getPersona(personaId)}
							message={message}
							onReset={handleReset}
						/>
					</FadeIn>
				)}

				{/* 応援ログ（ログイン時のみ） */}
				{isLoggedIn && log.length > 0 && !loading && (
					<div className="mt-10">
						<button
							type="button"
							onClick={() => setShowLog((v) => !v)}
							className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer mx-auto"
						>
							<History size={14} />
							もらった応援を見返す（{log.length}）
						</button>
						{showLog && (
							<div className="mt-4 space-y-3">
								{log.map((e) => (
									<div
										key={e.id}
										className="rounded-2xl border border-border bg-white p-4"
									>
										<p className="text-xs text-muted-foreground mb-1">
											{getPersona(e.personaId).emoji}{" "}
											{getPersona(e.personaId).label}より
										</p>
										<p className="text-sm text-foreground leading-relaxed">
											{e.message}
										</p>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
