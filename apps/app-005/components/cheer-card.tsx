"use client";

import {
	ClipboardCheck,
	ClipboardCopy,
	Download,
	RotateCcw,
} from "lucide-react";
import { useState } from "react";
import type { Persona } from "@/lib/personas";

// Canvas に応援カードを描画して Blob を返す
function drawCard(persona: Persona, message: string): Promise<Blob | null> {
	const W = 1080;
	const H = 1080;
	const canvas = document.createElement("canvas");
	canvas.width = W;
	canvas.height = H;
	const ctx = canvas.getContext("2d");
	if (!ctx) return Promise.resolve(null);

	// 背景
	ctx.fillStyle = "#FFFBF7";
	ctx.fillRect(0, 0, W, H);
	// 枠
	ctx.strokeStyle = "#FF8A65";
	ctx.lineWidth = 10;
	ctx.strokeRect(40, 40, W - 80, H - 80);

	// 絵文字
	ctx.font = "120px sans-serif";
	ctx.textAlign = "center";
	ctx.fillText(persona.emoji, W / 2, 260);

	// 人格ラベル
	ctx.fillStyle = "#FF8A65";
	ctx.font = "bold 40px sans-serif";
	ctx.fillText(`${persona.label}より`, W / 2, 330);

	// メッセージ（折り返し）
	ctx.fillStyle = "#3A2E2B";
	ctx.font = "bold 52px sans-serif";
	const maxWidth = W - 220;
	const lines: string[] = [];
	let line = "";
	for (const ch of message) {
		if (ch === "\n" || ctx.measureText(line + ch).width > maxWidth) {
			lines.push(line);
			line = ch === "\n" ? "" : ch;
		} else {
			line += ch;
		}
	}
	if (line) lines.push(line);

	const lineHeight = 74;
	let y = H / 2 - ((lines.length - 1) * lineHeight) / 2 + 30;
	for (const l of lines) {
		ctx.fillText(l, W / 2, y);
		y += lineHeight;
	}

	// フッター
	ctx.fillStyle = "#9B8579";
	ctx.font = "32px sans-serif";
	ctx.fillText("よしよしAI", W / 2, H - 90);

	return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export function CheerCard({
	persona,
	message,
	onReset,
}: {
	persona: Persona;
	message: string;
	onReset: () => void;
}) {
	const [copied, setCopied] = useState(false);
	const [sharing, setSharing] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(message);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleImage = async () => {
		setSharing(true);
		try {
			const blob = await drawCard(persona, message);
			if (!blob) return;
			const file = new File([blob], "yoshiyoshi.png", { type: "image/png" });
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({
					files: [file],
					text: "よしよしAIに応援してもらった",
				});
			} else {
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "yoshiyoshi.png";
				a.click();
				URL.revokeObjectURL(url);
			}
		} catch {
			// キャンセル等は無視
		} finally {
			setSharing(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="rounded-3xl border border-primary/30 bg-white p-7 shadow-sm text-center">
				<div className="text-5xl mb-2">{persona.emoji}</div>
				<div className="text-xs font-bold text-primary mb-4">
					{persona.label}より
				</div>
				<p className="text-lg font-bold leading-relaxed text-foreground whitespace-pre-wrap">
					{message}
				</p>
			</div>

			<button
				type="button"
				onClick={handleImage}
				disabled={sharing}
				className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 transition-all hover:brightness-110 cursor-pointer disabled:opacity-50"
			>
				<Download size={17} />
				画像で保存・シェア
			</button>
			<div className="grid grid-cols-2 gap-3">
				<button
					type="button"
					onClick={handleCopy}
					className="py-3 bg-muted border border-border text-foreground rounded-2xl flex items-center justify-center gap-2 transition-all hover:border-primary/50 cursor-pointer text-sm"
				>
					{copied ? (
						<>
							<ClipboardCheck size={15} />
							コピーした
						</>
					) : (
						<>
							<ClipboardCopy size={15} />
							コピー
						</>
					)}
				</button>
				<button
					type="button"
					onClick={onReset}
					className="py-3 border border-border text-muted-foreground rounded-2xl flex items-center justify-center gap-2 transition-all hover:text-foreground hover:border-primary/50 cursor-pointer text-sm"
				>
					<RotateCcw size={15} />
					もう一度
				</button>
			</div>

			<p className="text-[11px] text-muted-foreground text-center leading-relaxed">
				これは医療・治療を目的としたサービスではありません。
				<br />
				つらさが続くときは、専門の窓口や医療機関にご相談ください。
			</p>
		</div>
	);
}
