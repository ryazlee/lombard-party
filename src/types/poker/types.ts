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