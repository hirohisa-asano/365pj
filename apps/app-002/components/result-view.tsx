"use client";

import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	RotateCcw,
	Share2,
	Shield,
} from "lucide-react";
import { useState } from "react";
import type { DiagnosisResult } from "@/lib/scoring";

type Props = {
	result: DiagnosisResult;
	onReset: () => void;
};

const LEVEL_CONFIG = {
	safe: {
		label: "安全",
		color: "#10B981",
		bg: "#ECFDF5",
		icon: Shield,
	},
	warning: {
		label: "注意",
		color: "#F59E0B",
		bg: "#FFFBEB",
		icon: AlertTriangle,
	},
	danger: {
		label: "危険",
		color: "#EF4444",
		bg: "#FEF2F2",
		icon: AlertCircle,
	},
};

const ROUTE_LEVEL_COLORS = {
	safe: {
		text: "text-emerald-700",
		bg: "bg-emerald-50",
		dot: "bg-emerald-500",
	},
	warning: { text: "text-amber-700", bg: "bg-amber-50", dot: "bg-amber-500" },
	danger: { text: "text-red-700", bg: "bg-red-50", dot: "bg-red-500" },
};

export function ResultView({ result, onReset }: Props) {
	const [checked, setChecked] = useState<Set<number>>(new Set());
	const config = LEVEL_CONFIG[result.level];
	const Icon = config.icon;

	const toggleCheck = (i: number) => {
		setChecked((prev) => {
			const next = new Set(prev);
			if (next.has(i)) next.delete(i);
			else next.add(i);
			return next;
		});
	};

	const shareText = `副業バレリスク診断の結果：${result.score}%（${config.label}）でした！\n\n`;
	const shareUrl = typeof window !== "undefined" ? window.location.href : "";

	const shareX = () => {
		const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
		window.open(url, "_blank");
	};

	const shareLine = () => {
		const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
		window.open(url, "_blank");
	};

	return (
		<div className="w-full max-w-lg mx-auto space-y-6">
			{/* スコア */}
			<div
				className="rounded-[var(--tone-radius)] p-8 text-center"
				style={{ backgroundColor: config.bg }}
			>
				<Icon
					className="mx-auto mb-3"
					size={48}
					style={{ color: config.color }}
				/>
				<p className="text-sm text-muted-foreground mb-1">バレリスク</p>
				<p
					className="text-6xl font-bold font-heading"
					style={{ color: config.color }}
				>
					{result.score}
					<span className="text-2xl">%</span>
				</p>
				<p className="mt-2 text-lg font-bold" style={{ color: config.color }}>
					{config.label}
				</p>
			</div>

			{/* バレるルート */}
			<div className="bg-white rounded-[var(--tone-radius)] border border-border p-6 shadow-sm">
				<h3 className="text-lg font-bold font-heading mb-4">
					バレるルート分析
				</h3>
				<div className="space-y-3">
					{result.routes.map((route) => {
						const c = ROUTE_LEVEL_COLORS[route.level];
						return (
							<div
								key={route.id}
								className={`rounded-[var(--tone-radius)] p-4 ${c.bg}`}
							>
								<div className="flex items-center gap-2 mb-1">
									<span className={`w-2 h-2 rounded-full ${c.dot}`} />
									<span className={`font-medium ${c.text}`}>{route.title}</span>
								</div>
								<p className="text-sm text-foreground/80 ml-4">
									{route.description}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* 確定申告 */}
			<div className="bg-white rounded-[var(--tone-radius)] border border-border p-6 shadow-sm">
				<h3 className="text-lg font-bold font-heading mb-2">
					確定申告の必要性
				</h3>
				{result.needsTaxReturn ? (
					<div className="rounded-[var(--tone-radius)] p-4 bg-amber-50">
						<p className="text-amber-800 font-medium">確定申告が必要です</p>
						<p className="text-sm text-amber-700 mt-1">
							副業の所得（収入−経費）が年間20万円を超える場合、確定申告が必要です。申告時に住民税の納付方法を「自分で納付（普通徴収）」にすることで、会社にバレるリスクを大幅に下げられます。
						</p>
					</div>
				) : (
					<div className="rounded-[var(--tone-radius)] p-4 bg-emerald-50">
						<p className="text-emerald-800 font-medium">確定申告は不要です</p>
						<p className="text-sm text-emerald-700 mt-1">
							副業の所得が年間20万円以下の場合、所得税の確定申告は不要です。ただし、住民税の申告は必要な場合があります。
						</p>
					</div>
				)}
			</div>

			{/* 対策チェックリスト */}
			<div className="bg-white rounded-[var(--tone-radius)] border border-border p-6 shadow-sm">
				<h3 className="text-lg font-bold font-heading mb-4">
					対策チェックリスト
				</h3>
				<div className="space-y-3">
					{result.checklist.map((item, i) => (
						<label key={item} className="flex items-start gap-3 cursor-pointer">
							<span className="mt-0.5">
								{checked.has(i) ? (
									<CheckCircle2 className="text-primary" size={20} />
								) : (
									<span className="block w-5 h-5 rounded-full border-2 border-border" />
								)}
							</span>
							<span
								className={`text-sm ${checked.has(i) ? "line-through text-muted-foreground" : ""}`}
							>
								{item}
							</span>
							<input
								type="checkbox"
								className="sr-only"
								checked={checked.has(i)}
								onChange={() => toggleCheck(i)}
							/>
						</label>
					))}
				</div>
			</div>

			{/* シェア + リセット */}
			<div className="flex flex-col gap-3">
				<div className="flex gap-3">
					<button
						type="button"
						onClick={shareX}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-[var(--tone-radius)] font-medium hover:opacity-90 transition-opacity"
					>
						<Share2 className="h-4 w-4" />
						Xでシェア
					</button>
					<button
						type="button"
						onClick={shareLine}
						className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#06C755] text-white rounded-[var(--tone-radius)] font-medium hover:opacity-90 transition-opacity"
					>
						<Share2 className="h-4 w-4" />
						LINEでシェア
					</button>
				</div>
				<button
					type="button"
					onClick={onReset}
					className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-[var(--tone-radius)] text-muted-foreground hover:text-foreground transition-colors"
				>
					<RotateCcw className="h-4 w-4" />
					もう一度診断する
				</button>
			</div>
			{/* 免責事項 */}
			<p className="text-xs text-muted-foreground text-center">
				※
				本診断は一般的な情報提供を目的としたものであり、税務・法務のアドバイスではありません。正確な判断は税理士・社労士等の専門家にご相談ください。
			</p>
		</div>
	);
}
