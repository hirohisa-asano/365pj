import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Southern Cross Lab";
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
				backgroundColor: "#080E1C",
				fontFamily: "serif",
			}}
		>
			<div
				style={{
					fontSize: 18,
					letterSpacing: "0.3em",
					color: "#A8C4F0",
					marginBottom: 24,
					textTransform: "uppercase",
				}}
			>
				Southern Cross Lab
			</div>
			<div
				style={{
					fontSize: 36,
					color: "#E8EFF8",
					textAlign: "center",
					lineHeight: 1.6,
				}}
			>
				Web アプリの実験場
			</div>
			<div
				style={{
					fontSize: 18,
					color: "#B0C0D4",
					marginTop: 16,
				}}
			>
				作っては出す。試しては変える。
			</div>
		</div>,
	);
}
