"use client";

import { Share2 } from "lucide-react";

type BucketListItem = {
	emoji: string;
	title: string;
	reason: string;
};

export function ShareButton({ items }: { items: BucketListItem[] }) {
	const titles = items
		.slice(0, 5)
		.map((item) => `${item.emoji} ${item.title}`)
		.join("\n");
	const text = `BucketAIで作った「やりたいことリスト」:\n${titles}\n\nあなたも3つの質問に答えるだけ`;

	const handleShare = () => {
		const url = typeof window !== "undefined" ? window.location.href : "";
		if (navigator.share) {
			navigator.share({ text, url });
		} else {
			const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
			window.open(tweetUrl, "_blank", "noopener,noreferrer");
		}
	};

	return (
		<button
			type="button"
			onClick={handleShare}
			className="w-full py-3 bg-muted border border-border text-foreground rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:border-primary/50 cursor-pointer text-sm font-medium"
		>
			<Share2 size={15} />
			結果をシェアする
		</button>
	);
}
