import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BucketAI — AIがあなたの「やりたいことリスト」を作る";
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
				backgroundColor: "#0C1222",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					fontSize: 64,
					fontWeight: 700,
					marginBottom: 16,
					display: "flex",
				}}
			>
				<span style={{ color: "#D4A574" }}>Bucket</span>
				<span style={{ color: "#E2DDD5" }}>AI</span>
			</div>
			<div
				style={{
					fontSize: 28,
					color: "#8B9AB5",
					textAlign: "center",
					maxWidth: 600,
				}}
			>
				3つの質問に答えるだけ。AIがあなただけの
				「やりたいことリスト」を作ります。
			</div>
			<div
				style={{
					fontSize: 20,
					color: "#8B9AB5",
					marginTop: 32,
				}}
			>
				Southern Cross Lab
			</div>
		</div>,
	);
}
