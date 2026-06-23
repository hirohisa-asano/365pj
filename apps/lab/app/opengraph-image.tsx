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
					color: "#D6DFF0",
					textAlign: "center",
					lineHeight: 1.6,
				}}
			>
				世界は征服する戦場ではなく、
				<br />
				共に航海する海である。
			</div>
		</div>,
	);
}
