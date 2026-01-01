import { PokerSession, PlayerSummary, PlayerStat } from "../types/poker/types";
import { fetchSheetData } from "./googleDriveService";

const SHEET_ID = "1Hm-MOWeBZf6b4YTOhJe0rDc8KC6rXPdprqLRbxBscis";
const SHEET_NAME = "data";

export const fetchPokerStats = async (): Promise<{
	sessions: PokerSession[];
	playerSummaries: PlayerSummary[];
}> => {
	try {
		const rows = await fetchSheetData({
			sheetId: SHEET_ID,
			sheetName: SHEET_NAME,
		});

		if (rows.length === 0) {
			return { sessions: [], playerSummaries: [] };
		}

		return parseSheetData(rows);
	} catch (error) {
		console.error("Error fetching poker stats:", error);
		throw error;
	}
};

function parseSheetData(rows: string[][]): {
	sessions: PokerSession[];
	playerSummaries: PlayerSummary[];
} {
	if (rows.length < 3) {
		return { sessions: [], playerSummaries: [] };
	}

	// Row 0: Headers (Winnings, Count, Name, then dates)
	// Row 1: Buy-in amounts
	// Row 2+: Player data
	const headerRow = rows[0];
	const buyInRow = rows[1];
	const playerRows = rows.slice(2);

	// Extract dates from header row (starting at column D, index 3)
	const dates = headerRow.slice(3).filter((d) => d && d.trim());

	// Build sessions array
	const sessions: PokerSession[] = [];
	const playerSummaries: PlayerSummary[] = [];

	playerRows.forEach((row) => {
		const winnings = parseFloat(row[0]?.replace(/[$,]/g, "") || "0");
		const count = parseInt(row[1] || "0");
		const playerName = row[2];

		if (!playerName) return;

		playerSummaries.push({
			player: playerName,
			totalWinnings: winnings,
			sessionCount: count,
		});

		// Extract each session (starting at column D, index 3)
		dates.forEach((date, dateIndex) => {
			const dataIndex = dateIndex + 3;
			const buyIn = parseFloat(buyInRow[dataIndex] || "0");
			const profitStr = row[dataIndex];

			if (profitStr && profitStr.trim()) {
				const profit = parseFloat(
					profitStr.replace(/[$,]/g, "") || "0"
				);

				const dateObj = new Date(date);
				dateObj.setHours(0, 0, 0, 0);

				sessions.push({
					date: dateObj,
					player: playerName,
					buyIn,
					profit,
				});
			}
		});
	});

	return { sessions, playerSummaries };
}

export const getPlayerStats = (
	sessions: PokerSession[],
	summaries: PlayerSummary[]
): PlayerStat[] => {
	const playerMap = new Map<
		string,
		{
			totalProfit: number;
			sessions: number;
			totalBuyIn: number;
			highestSingleWinning: number;
		}
	>();

	sessions.forEach((session) => {
		const existing = playerMap.get(session.player) || {
			totalProfit: 0,
			sessions: 0,
			totalBuyIn: 0,
			highestSingleWinning: 0,
		};

		playerMap.set(session.player, {
			totalProfit: existing.totalProfit + session.profit,
			sessions: existing.sessions + 1,
			totalBuyIn: existing.totalBuyIn + session.buyIn,
			highestSingleWinning: Math.max(
				existing.highestSingleWinning,
				session.profit
			),
		});
	});

	return Array.from(playerMap.entries()).map(([player, stats]) => {
		const summary = summaries.find((s) => s.player === player);

		return {
			player,
			...stats,
			totalWinnings: summary?.totalWinnings || stats.totalProfit,
			avgProfit: stats.totalProfit / stats.sessions,
			roi:
				stats.totalBuyIn > 0
					? (stats.totalProfit / stats.totalBuyIn) * 100
					: 0,
		};
	});
};
