"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ResultView } from "@/components/result-view";
import { StepForm } from "@/components/step-form";
import type { FormData } from "@/lib/scoring";
import { calculateRisk, type DiagnosisResult } from "@/lib/scoring";

export default function Home() {
	const [result, setResult] = useState<DiagnosisResult | null>(null);

	const handleSubmit = (data: FormData) => {
		const r = calculateRisk(data);
		setResult(r);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleReset = () => {
		setResult(null);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="min-h-[80vh] px-4 py-12">
			<div className="text-center mb-10">
				<ShieldCheck className="mx-auto mb-4 text-primary" size={48} />
				<h1 className="text-3xl sm:text-4xl font-bold font-heading">
					副業バレリスク診断
				</h1>
				<p className="mt-3 text-muted-foreground max-w-md mx-auto">
					{result
						? "あなたの診断結果"
						: "3つの質問に答えるだけで、副業が会社にバレるリスクと対策がわかります"}
				</p>
			</div>

			{result ? (
				<ResultView result={result} onReset={handleReset} />
			) : (
				<StepForm onSubmit={handleSubmit} />
			)}
		</div>
	);
}
