import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "副業バレリスク診断";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#FAFBFC",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					fontSize: 56,
					fontWeight: 700,
					color: "#1A1A2E",
					marginBottom: 16,
				}}
			>
				副業バレリスク診断
			</div>
			<div
				style={{
					fontSize: 24,
					color: "#6B7280",
					marginBottom: 32,
				}}
			>
				3つの質問で、副業がバレるリスクと対策がわかる
			</div>
			<div
				style={{
					fontSize: 20,
					color: "#10B981",
					fontWeight: 600,
				}}
			>
				Southern Cross Lab
			</div>
		</div>,
	);
}
