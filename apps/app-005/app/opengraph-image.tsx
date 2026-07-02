import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "よしよしAI — ダメな自分を全力で肯定・応援してくれるAI";
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
				backgroundColor: "#FFFBF7",
				fontFamily: "sans-serif",
			}}
		>
			<div style={{ fontSize: 90, marginBottom: 8, display: "flex" }}>🩹</div>
			<div
				style={{
					fontSize: 72,
					fontWeight: 800,
					marginBottom: 20,
					display: "flex",
				}}
			>
				<span style={{ color: "#3A2E2B" }}>よしよし</span>
				<span style={{ color: "#FF8A65" }}>AI</span>
			</div>
			<div
				style={{
					fontSize: 30,
					color: "#9B8579",
					textAlign: "center",
					maxWidth: 760,
					lineHeight: 1.5,
				}}
			>
				今日ダメだったことを話すと、AIが全力で「よしよし」してくれる
			</div>
			<div style={{ fontSize: 22, color: "#C4B2A6", marginTop: 36 }}>
				Southern Cross Lab
			</div>
		</div>,
	);
}
