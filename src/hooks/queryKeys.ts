export const queryKeys = {
	pokerStats: ["pokerStats"] as const,
	pokerYearInReview: (name: string) =>
		["pokerYearInReview", name] as const,
};
