export interface PokerSession {
	date: string;
	player: string;
	buyIn: number;
	profit: number;
}

export interface PlayerSummary {
	player: string;
	totalWinnings: number;
	sessionCount: number;
}

export interface PlayerStat {
	totalWinnings: number;
	avgProfit: number;
	roi: number;
	totalProfit: number;
	sessions: number;
	totalBuyIn: number;
	highestSingleWinning: number;
	player: string;
}
