"use client";

import {
	type HTMLMotionProps,
	type Variants,
	motion,
	useInView,
} from "motion/react";
import { type ReactNode, useRef } from "react";

// --- FadeIn ---
// マウント時にふわっと表示。direction で方向指定可能。
export function FadeIn({
	children,
	direction = "up",
	delay = 0,
	duration = 0.5,
	className,
	...props
}: {
	children: ReactNode;
	direction?: "up" | "down" | "left" | "right" | "none";
	delay?: number;
	duration?: number;
	className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
	const offset = { up: [20, 0], down: [-20, 0], left: [0, -20], right: [0, 20], none: [0, 0] };
	const [y, x] = offset[direction];

	return (
		<motion.div
			initial={{ opacity: 0, y, x }}
			animate={{ opacity: 1, y: 0, x: 0 }}
			transition={{ duration, delay, ease: "easeOut" }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

// --- FadeInView ---
// スクロールで画面内に入ったら表示。once で1回だけ発火。
export function FadeInView({
	children,
	direction = "up",
	delay = 0,
	className,
}: {
	children: ReactNode;
	direction?: "up" | "down" | "left" | "right" | "none";
	delay?: number;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "-60px" });
	const offset = { up: 24, down: -24, left: -24, right: 24, none: 0 };

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: direction === "up" || direction === "down" ? offset[direction] : 0, x: direction === "left" || direction === "right" ? offset[direction] : 0 }}
			animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
			transition={{ duration: 0.5, delay, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// --- Stagger ---
// 子要素を順番にアニメーション。診断結果のリスト表示などに。
const staggerContainer: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.08 } },
};

const staggerItem: Variants = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Stagger({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			variants={staggerContainer}
			initial="hidden"
			animate="show"
			className={className}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<motion.div variants={staggerItem} className={className}>
			{children}
		</motion.div>
	);
}

// --- CountUp ---
// 数字をカウントアップ表示。診断スコアの演出に。
export function CountUp({
	value,
	duration = 1.2,
	suffix = "",
	className,
}: {
	value: number;
	duration?: number;
	suffix?: string;
	className?: string;
}) {
	return (
		<motion.span
			className={className}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
		>
			<motion.span
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				{/* CountUp はクライアントで useMotionValue + useTransform を使う */}
				<CountUpInner value={value} duration={duration} />
				{suffix}
			</motion.span>
		</motion.span>
	);
}

import { useMotionValue, useTransform, animate as motionAnimate } from "motion/react";
import { useEffect, useState } from "react";

function CountUpInner({ value, duration }: { value: number; duration: number }) {
	const motionVal = useMotionValue(0);
	const rounded = useTransform(motionVal, (v) =>
		Number.isInteger(value) ? Math.round(v) : v.toFixed(1),
	);
	const [display, setDisplay] = useState("0");

	useEffect(() => {
		const controls = motionAnimate(motionVal, value, {
			duration,
			ease: "easeOut",
		});
		const unsubscribe = rounded.on("change", (v) => setDisplay(String(v)));
		return () => {
			controls.stop();
			unsubscribe();
		};
	}, [value, duration, motionVal, rounded]);

	return <>{display}</>;
}

// --- ScoreReveal ---
// 診断結果の「ドン！」演出。ローディング → スコア表示。
export function ScoreReveal({
	children,
	delay = 0.3,
	className,
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{
				delay,
				duration: 0.5,
				ease: [0.16, 1, 0.3, 1], // spring-like
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// --- PressScale ---
// ボタンを押した時のバウンス感。CTAに使う。
export function PressScale({
	children,
	className,
	...props
}: {
	children: ReactNode;
	className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.97 }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}
