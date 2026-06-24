"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import type { FormData } from "@/lib/scoring";

type Props = {
	onSubmit: (data: FormData) => void;
};

type Draft = {
	[K in keyof FormData]: K extends "annualIncome"
		? number
		: FormData[K] | null;
};

const INITIAL: Draft = {
	sideJobPolicy: null,
	companySize: null,
	sideJobType: null,
	annualIncome: 50,
	visibility: null,
	taxExperience: null,
	taxPayment: null,
};

const STEP_FIELDS: (keyof Draft)[][] = [
	["sideJobPolicy", "companySize"],
	["sideJobType", "visibility"],
	["taxExperience", "taxPayment"],
];

export function StepForm({ onSubmit }: Props) {
	const [step, setStep] = useState(0);
	const [data, setData] = useState<Draft>(INITIAL);
	const [showHint, setShowHint] = useState(false);

	const update = <K extends keyof Draft>(key: K, value: Draft[K]) => {
		setData((prev) => ({ ...prev, [key]: value }));
		setShowHint(false);
	};

	const isStepComplete = (s: number) =>
		STEP_FIELDS[s].every((f) => data[f] !== null);

	const next = () => {
		if (!isStepComplete(step)) {
			setShowHint(true);
			return;
		}
		setShowHint(false);
		setStep((s) => Math.min(s + 1, 2));
	};
	const prev = () => {
		setShowHint(false);
		setStep((s) => Math.max(s - 1, 0));
	};
	const submit = () => {
		if (!isStepComplete(step)) {
			setShowHint(true);
			return;
		}
		onSubmit(data as FormData);
	};

	return (
		<div className="w-full max-w-lg mx-auto">
			<div className="flex gap-2 mb-8">
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						className="flex-1 h-2 rounded-full transition-colors"
						style={{
							backgroundColor:
								i <= step ? "var(--tone-primary)" : "var(--tone-border)",
						}}
					/>
				))}
			</div>

			<div className="bg-white rounded-[var(--tone-radius)] border border-border p-6 shadow-sm">
				{showHint && (
					<p className="text-sm text-amber-600 bg-amber-50 rounded-[var(--tone-radius)] px-4 py-2 mb-4">
						選択肢を確認してから進んでください
					</p>
				)}
				{step === 0 && (
					<div className="space-y-6">
						<h2 className="text-xl font-bold font-heading">
							Step 1: 本業について
						</h2>

						<fieldset className="space-y-2">
							<legend className="text-sm font-medium">
								就業規則での副業規定
							</legend>
							{(
								[
									["prohibited", "副業禁止"],
									["permitted", "許可制（届出が必要）"],
									["free", "自由（制限なし）"],
									["unknown", "わからない"],
								] as const
							).map(([value, label]) => (
								<label
									key={value}
									className={`flex items-center gap-3 p-3 rounded-[var(--tone-radius)] border cursor-pointer transition-colors ${
										data.sideJobPolicy === value
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
								>
									<input
										type="radio"
										name="sideJobPolicy"
										value={value}
										checked={data.sideJobPolicy === value}
										onChange={() => update("sideJobPolicy", value)}
										className="accent-[var(--tone-primary)]"
									/>
									<span>{label}</span>
								</label>
							))}
						</fieldset>

						<fieldset className="space-y-2">
							<legend className="text-sm font-medium">会社の規模</legend>
							{(
								[
									["large", "大企業（従業員300人以上）"],
									["medium", "中小企業"],
									["startup", "スタートアップ・ベンチャー"],
								] as const
							).map(([value, label]) => (
								<label
									key={value}
									className={`flex items-center gap-3 p-3 rounded-[var(--tone-radius)] border cursor-pointer transition-colors ${
										data.companySize === value
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
								>
									<input
										type="radio"
										name="companySize"
										value={value}
										checked={data.companySize === value}
										onChange={() => update("companySize", value)}
										className="accent-[var(--tone-primary)]"
									/>
									<span>{label}</span>
								</label>
							))}
						</fieldset>
					</div>
				)}

				{step === 1 && (
					<div className="space-y-6">
						<h2 className="text-xl font-bold font-heading">
							Step 2: 副業について
						</h2>

						<fieldset className="space-y-2">
							<legend className="text-sm font-medium">副業の種類</legend>
							{(
								[
									["freelance", "フリーランス・業務委託"],
									["parttime", "アルバイト・パート"],
									["investment", "投資・不動産"],
									["online", "ネット副業・アフィリエイト"],
									["content", "コンテンツ販売"],
								] as const
							).map(([value, label]) => (
								<label
									key={value}
									className={`flex items-center gap-3 p-3 rounded-[var(--tone-radius)] border cursor-pointer transition-colors ${
										data.sideJobType === value
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
								>
									<input
										type="radio"
										name="sideJobType"
										value={value}
										checked={data.sideJobType === value}
										onChange={() => update("sideJobType", value)}
										className="accent-[var(--tone-primary)]"
									/>
									<span>{label}</span>
								</label>
							))}
						</fieldset>

						<div className="space-y-2">
							<label htmlFor="income" className="text-sm font-medium">
								年間副業収入（見込み）:{" "}
								<span className="text-primary font-bold">
									{data.annualIncome}万円
								</span>
							</label>
							<input
								id="income"
								type="range"
								min={0}
								max={500}
								step={10}
								value={data.annualIncome}
								onChange={(e) => update("annualIncome", Number(e.target.value))}
								className="w-full accent-[var(--tone-primary)]"
							/>
							<div className="flex justify-between text-xs text-muted-foreground">
								<span>0万円</span>
								<span>500万円</span>
							</div>
						</div>

						<fieldset className="space-y-2">
							<legend className="text-sm font-medium">副業の公開度</legend>
							{(
								[
									["anonymous", "完全匿名"],
									["realname", "実名で活動"],
									["sns", "SNSで発信している"],
								] as const
							).map(([value, label]) => (
								<label
									key={value}
									className={`flex items-center gap-3 p-3 rounded-[var(--tone-radius)] border cursor-pointer transition-colors ${
										data.visibility === value
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
								>
									<input
										type="radio"
										name="visibility"
										value={value}
										checked={data.visibility === value}
										onChange={() => update("visibility", value)}
										className="accent-[var(--tone-primary)]"
									/>
									<span>{label}</span>
								</label>
							))}
						</fieldset>
					</div>
				)}

				{step === 2 && (
					<div className="space-y-6">
						<h2 className="text-xl font-bold font-heading">Step 3: 対策状況</h2>

						<fieldset className="space-y-2">
							<legend className="text-sm font-medium">確定申告の経験</legend>
							{(
								[
									["experienced", "したことがある"],
									["first", "今回が初めて"],
									["unnecessary", "不要な額（20万円以下）"],
								] as const
							).map(([value, label]) => (
								<label
									key={value}
									className={`flex items-center gap-3 p-3 rounded-[var(--tone-radius)] border cursor-pointer transition-colors ${
										data.taxExperience === value
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
								>
									<input
										type="radio"
										name="taxExperience"
										value={value}
										checked={data.taxExperience === value}
										onChange={() => update("taxExperience", value)}
										className="accent-[var(--tone-primary)]"
									/>
									<span>{label}</span>
								</label>
							))}
						</fieldset>

						<fieldset className="space-y-2">
							<legend className="text-sm font-medium">住民税の納付方法</legend>
							{(
								[
									["ordinary", "普通徴収（自分で納付）"],
									["special", "特別徴収（給与天引き）"],
									["unknown", "わからない"],
								] as const
							).map(([value, label]) => (
								<label
									key={value}
									className={`flex items-center gap-3 p-3 rounded-[var(--tone-radius)] border cursor-pointer transition-colors ${
										data.taxPayment === value
											? "border-primary bg-primary/5"
											: "border-border hover:border-primary/50"
									}`}
								>
									<input
										type="radio"
										name="taxPayment"
										value={value}
										checked={data.taxPayment === value}
										onChange={() => update("taxPayment", value)}
										className="accent-[var(--tone-primary)]"
									/>
									<span>{label}</span>
								</label>
							))}
						</fieldset>
					</div>
				)}

				<div className="flex justify-between mt-8">
					{step > 0 ? (
						<button
							type="button"
							onClick={prev}
							className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
						>
							<ChevronLeft className="h-4 w-4" />
							戻る
						</button>
					) : (
						<div />
					)}

					{step < 2 ? (
						<button
							type="button"
							onClick={next}
							className="flex items-center gap-1 px-6 py-2 bg-primary text-primary-foreground rounded-[var(--tone-radius)] font-medium hover:opacity-90 transition-opacity"
						>
							次へ
							<ChevronRight className="h-4 w-4" />
						</button>
					) : (
						<button
							type="button"
							onClick={submit}
							className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-[var(--tone-radius)] font-medium hover:opacity-90 transition-opacity"
						>
							<Search className="h-4 w-4" />
							診断する
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
