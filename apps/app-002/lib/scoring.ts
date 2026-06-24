export type FormData = {
	sideJobPolicy: "prohibited" | "permitted" | "free" | "unknown";
	companySize: "large" | "medium" | "startup";
	sideJobType: "freelance" | "parttime" | "investment" | "online" | "content";
	annualIncome: number;
	visibility: "anonymous" | "realname" | "sns";
	taxExperience: "experienced" | "first" | "unnecessary";
	taxPayment: "ordinary" | "special" | "unknown";
};

export type RiskRoute = {
	id: string;
	title: string;
	description: string;
	level: "safe" | "warning" | "danger";
};

export type DiagnosisResult = {
	score: number;
	level: "safe" | "warning" | "danger";
	routes: RiskRoute[];
	needsTaxReturn: boolean;
	checklist: string[];
};

export function calculateRisk(data: FormData): DiagnosisResult {
	let score = 0;

	// ベーススコア（副業規定）
	const policyScores = {
		prohibited: 40,
		permitted: 15,
		free: 0,
		unknown: 25,
	};
	score += policyScores[data.sideJobPolicy];

	// 副業種類
	const typeScores = {
		parttime: 20,
		freelance: 10,
		investment: 5,
		online: 10,
		content: 10,
	};
	score += typeScores[data.sideJobType];

	// 収入
	if (data.annualIncome <= 20) {
		score += 0;
	} else if (data.annualIncome <= 100) {
		score += 10;
	} else if (data.annualIncome <= 300) {
		score += 15;
	} else {
		score += 20;
	}

	// 公開度
	const visibilityScores = { anonymous: 0, realname: 15, sns: 20 };
	score += visibilityScores[data.visibility];

	// 住民税対策
	const taxScores = { ordinary: -15, special: 0, unknown: 10 };
	score += taxScores[data.taxPayment];

	// 会社規模
	const sizeScores = { large: 5, medium: 0, startup: -5 };
	score += sizeScores[data.companySize];

	score = Math.min(Math.max(score, 0), 100);

	const level: DiagnosisResult["level"] =
		score <= 30 ? "safe" : score <= 60 ? "warning" : "danger";

	const routes = buildRoutes(data);
	const needsTaxReturn = data.annualIncome > 20;
	const checklist = buildChecklist(data);

	return { score, level, routes, needsTaxReturn, checklist };
}

function buildRoutes(data: FormData): RiskRoute[] {
	const routes: RiskRoute[] = [];

	// 住民税ルート
	if (data.taxPayment !== "ordinary") {
		routes.push({
			id: "tax",
			title: "住民税ルート",
			description:
				"副業収入があると住民税が増額します。特別徴収（給与天引き）のままだと、経理担当が住民税額の変化に気づく可能性があります。",
			level:
				data.taxPayment === "special"
					? "danger"
					: data.annualIncome > 20
						? "warning"
						: "safe",
		});
	} else {
		routes.push({
			id: "tax",
			title: "住民税ルート",
			description:
				"普通徴収（自分で納付）を選択済みです。住民税経由でバレるリスクは低いです。",
			level: "safe",
		});
	}

	// 社会保険ルート
	if (data.sideJobType === "parttime") {
		routes.push({
			id: "insurance",
			title: "社会保険ルート",
			description:
				"アルバイト・パートで一定時間以上働くと、副業先でも社会保険に加入する必要が生じます。その場合、本業の会社に通知が届きます。",
			level: "danger",
		});
	} else {
		routes.push({
			id: "insurance",
			title: "社会保険ルート",
			description:
				"フリーランスや投資の場合、社会保険経由でバレるリスクはほぼありません。",
			level: "safe",
		});
	}

	// SNS・密告ルート
	if (data.visibility !== "anonymous") {
		routes.push({
			id: "sns",
			title: "SNS・密告ルート",
			description:
				"実名やSNSで副業を公開していると、同僚や取引先経由で会社に伝わる可能性があります。",
			level: data.visibility === "sns" ? "danger" : "warning",
		});
	} else {
		routes.push({
			id: "sns",
			title: "SNS・密告ルート",
			description: "匿名で活動している場合、SNS経由でバレるリスクは低いです。",
			level: "safe",
		});
	}

	// マイナンバールート（常に安心材料）
	routes.push({
		id: "mynumber",
		title: "マイナンバールート",
		description:
			"マイナンバーから直接副業がバレることはありません。マイナンバーは税務処理に使われますが、会社が副業情報を照会することはできません。",
		level: "safe",
	});

	return routes;
}

function buildChecklist(data: FormData): string[] {
	const items: string[] = [];

	if (data.taxPayment !== "ordinary" && data.annualIncome > 20) {
		items.push("確定申告で住民税を「自分で納付（普通徴収）」にする");
	}

	if (data.visibility !== "anonymous") {
		items.push("SNSでは匿名で活動する、または副業アカウントを分ける");
	}

	items.push("同僚に副業の話をしない");

	if (data.sideJobType === "parttime") {
		items.push(
			"アルバイト先の労働時間を週20時間未満に抑え、社会保険加入を避ける",
		);
	}

	if (data.annualIncome > 20 && data.taxExperience !== "experienced") {
		items.push("確定申告の準備を始める（年間収入20万円超のため必要）");
	}

	if (data.sideJobPolicy === "prohibited") {
		items.push("就業規則を再確認し、副業解禁の動きがないか確認する");
	}

	if (data.sideJobPolicy === "permitted") {
		items.push("会社に副業許可の申請を出す（許可制の場合、申請が最も安全）");
	}

	return items;
}
