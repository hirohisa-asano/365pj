import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "App";
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
				backgroundColor: "#FFFFFF",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					fontSize: 64,
					fontWeight: 700,
					color: "#171717",
					marginBottom: 16,
				}}
			>
				App Name
			</div>
			<div
				style={{
					fontSize: 28,
					color: "#737373",
				}}
			>
				Southern Cross Lab
			</div>
		</div>,
	);
}
