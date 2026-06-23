"use client";

import { useEffect, useRef } from "react";

interface Star {
	x: number;
	y: number;
	size: number;
	opacity: number;
	twinkleSpeed: number;
	twinkleOffset: number;
}

// 南十字星の座標（正規化: 0-1）
const SOUTHERN_CROSS: { x: number; y: number; size: number; name: string }[] =
	[
		{ x: 0.72, y: 0.28, size: 2.8, name: "Acrux" }, // 下
		{ x: 0.68, y: 0.18, size: 2.2, name: "Mimosa" }, // 左
		{ x: 0.72, y: 0.09, size: 2.4, name: "Gacrux" }, // 上
		{ x: 0.78, y: 0.18, size: 1.8, name: "Delta" }, // 右
		{ x: 0.71, y: 0.18, size: 1.4, name: "Epsilon" }, // 中央やや左
	];

function generateStars(count: number): Star[] {
	return Array.from({ length: count }, () => ({
		x: Math.random(),
		y: Math.random(),
		size: Math.random() * 1.5 + 0.3,
		opacity: Math.random() * 0.6 + 0.2,
		twinkleSpeed: Math.random() * 0.02 + 0.005,
		twinkleOffset: Math.random() * Math.PI * 2,
	}));
}

export function StarfieldBackground() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const starsRef = useRef<Star[]>(generateStars(280));
	const frameRef = useRef<number>(0);
	const timeRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};
		resize();
		window.addEventListener("resize", resize);

		const draw = () => {
			const { width, height } = canvas;
			timeRef.current += 1;

			// 背景グラデーション
			const bg = ctx.createRadialGradient(
				width * 0.5,
				height * 0.3,
				0,
				width * 0.5,
				height * 0.5,
				width * 0.8,
			);
			bg.addColorStop(0, "#0D1530");
			bg.addColorStop(0.5, "#080E1C");
			bg.addColorStop(1, "#04080F");
			ctx.fillStyle = bg;
			ctx.fillRect(0, 0, width, height);

			// 星雲のような淡いグロー（右上）
			const nebula = ctx.createRadialGradient(
				width * 0.75,
				height * 0.2,
				0,
				width * 0.75,
				height * 0.2,
				width * 0.3,
			);
			nebula.addColorStop(0, "rgba(100, 130, 200, 0.06)");
			nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = nebula;
			ctx.fillRect(0, 0, width, height);

			// 通常の星
			for (const star of starsRef.current) {
				const twinkle =
					Math.sin(timeRef.current * star.twinkleSpeed + star.twinkleOffset) *
						0.3 +
					0.7;
				ctx.beginPath();
				ctx.arc(
					star.x * width,
					star.y * height,
					star.size,
					0,
					Math.PI * 2,
				);
				ctx.fillStyle = `rgba(200, 215, 240, ${star.opacity * twinkle})`;
				ctx.fill();
			}

			// 南十字星
			for (const s of SOUTHERN_CROSS) {
				const sx = s.x * width;
				const sy = s.y * height;

				// グロー
				const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size * 8);
				glow.addColorStop(0, "rgba(168, 196, 240, 0.6)");
				glow.addColorStop(1, "rgba(168, 196, 240, 0)");
				ctx.fillStyle = glow;
				ctx.beginPath();
				ctx.arc(sx, sy, s.size * 8, 0, Math.PI * 2);
				ctx.fill();

				// 星本体
				ctx.beginPath();
				ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
				ctx.fillStyle = "rgba(220, 235, 255, 0.95)";
				ctx.fill();
			}

			// 南十字星のラベル（薄く）
			ctx.font = "11px 'Noto Sans JP', sans-serif";
			ctx.fillStyle = "rgba(168, 196, 240, 0.35)";
			ctx.letterSpacing = "0.1em";
			ctx.fillText(
				"Southern Cross",
				SOUTHERN_CROSS[2].x * width + 14,
				SOUTHERN_CROSS[2].y * height - 8,
			);

			frameRef.current = requestAnimationFrame(draw);
		};

		draw();

		return () => {
			window.removeEventListener("resize", resize);
			cancelAnimationFrame(frameRef.current);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 -z-10 pointer-events-none"
			aria-hidden="true"
		/>
	);
}
