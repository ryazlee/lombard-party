import type { IPokerStore, PokerData } from "./IPokerStore";

/**
 * In-memory poker data for local development without Google Sheets.
 * Enable with REACT_APP_USE_MOCK=true.
 */
export class PokerStoreMock implements IPokerStore {
	async getPokerData(): Promise<PokerData> {
		const sessionDate = (iso: string) => {
			const date = new Date(iso);
			date.setHours(0, 0, 0, 0);
			return date;
		};

		return {
			playerSummaries: [
				{ player: "Alex Smith", totalWinnings: 85, sessionCount: 3 },
				{ player: "Jordan Lee", totalWinnings: -40, sessionCount: 2 },
			],
			sessions: [
				{
					date: sessionDate("2025-01-10"),
					player: "Alex Smith",
					buyIn: 20,
					profit: 45,
				},
				{
					date: sessionDate("2025-02-14"),
					player: "Alex Smith",
					buyIn: 20,
					profit: 15,
				},
				{
					date: sessionDate("2025-03-01"),
					player: "Alex Smith",
					buyIn: 20,
					profit: 25,
				},
				{
					date: sessionDate("2025-01-10"),
					player: "Jordan Lee",
					buyIn: 20,
					profit: -20,
				},
				{
					date: sessionDate("2025-02-14"),
					player: "Jordan Lee",
					buyIn: 20,
					profit: -20,
				},
			],
		};
	}
}
