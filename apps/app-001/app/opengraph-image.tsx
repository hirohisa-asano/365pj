import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "あなたに合う漫画提案AI";
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
				backgroundColor: "#FFF8F0",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					fontSize: 56,
					fontWeight: 700,
					color: "#1A1A1A",
					marginBottom: 16,
				}}
			>
				あなたに合う漫画提案AI
			</div>
			<div
				style={{
					fontSize: 24,
					color: "#8B7355",
				}}
			>
				好きな漫画と気分から、ぴったりの作品を提案
			</div>
			<div
				style={{
					fontSize: 18,
					color: "#B0A090",
					marginTop: 24,
				}}
			>
				Southern Cross Lab
			</div>
		</div>,
	);
}
