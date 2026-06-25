"use client";

export function QuestionStep({
	question,
	value,
	onChange,
	placeholder,
}: {
	question: string;
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
}) {
	return (
		<div className="space-y-6">
			<h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-foreground">
				{question}
			</h2>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				rows={4}
				className="w-full bg-transparent border-b border-border outline-none resize-none text-lg md:text-xl text-foreground placeholder:text-muted-foreground/40 leading-relaxed focus:border-primary/50 transition-colors"
			/>
		</div>
	);
}
