import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FilmPick — あなたの好みで映画を探す";
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
				backgroundColor: "#0F0F1A",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					fontSize: 72,
					fontWeight: 900,
					color: "#E8E6E3",
					marginBottom: 8,
					display: "flex",
				}}
			>
				<span style={{ color: "#F59E0B" }}>Film</span>
				<span>Pick</span>
			</div>
			<div
				style={{
					fontSize: 28,
					color: "#9CA3AF",
					marginBottom: 32,
				}}
			>
				あなたの好みで映画を探す
			</div>
			<div
				style={{
					fontSize: 18,
					color: "#6B7280",
				}}
			>
				Southern Cross Lab
			</div>
		</div>,
	);
}
