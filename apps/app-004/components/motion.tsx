"use client";

import { type HTMLMotionProps, motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

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
	const offset = {
		up: [20, 0],
		down: [-20, 0],
		left: [0, -20],
		right: [0, 20],
		none: [0, 0],
	};
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

// --- Stagger ---
// 子要素を順番にアニメーション。結果リスト表示に使用。
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
