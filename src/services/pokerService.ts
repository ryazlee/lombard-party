import { PokerSession, PlayerSummary } from "../types/poker/types";

const SHEET_ID = "1Hm-MOWeBZf6b4YTOhJe0rDc8KC6rXPdprqLRbxBscis";
const SHEET_NAME = "data";
const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || "";

export const fetchPokerStats = async (): Promise<{
	sessions: PokerSession[];
	playerSummaries: PlayerSummary[];
}> => {
	try {
		// If no API key, use public CSV export
		if (!API_KEY) {
			const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;
			const response = await fetch(csvUrl);

			if (!response.ok) {
				throw new Error(
					"Failed to fetch poker stats. Make sure the Google Sheet is publicly accessible (Anyone with the link can view)."
				);
			}

			const csvText = await response.text();
			const lines = csvText.split("\n");
			const rows = lines.map((line) => {
				const cells: string[] = [];
				let currentCell = "";
				let inQuotes = false;

				for (let i = 0; i < line.length; i++) {
					const char = line[i];
					if (char === '"') {
						inQuotes = !inQuotes;
					} else if (char === "," && !inQuotes) {
						cells.push(currentCell.trim());
						currentCell = "";
					} else {
						currentCell += char;
					}
				}
				cells.push(currentCell.trim());
				return cells;
			});

			return parseSheetData(rows);
		}

		// Using Google Sheets API v4 with API key
		const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("Failed to fetch poker stats");
		}

		const data = await response.json();
		const rows = data.values;

		if (!rows || rows.length === 0) {
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

				sessions.push({
					date,
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
) => {
	const playerMap = new Map<
		string,
		{
			totalProfit: number;
			sessions: number;
			totalBuyIn: number;
			highestSingleWinning: number;
			normalizedAverage: number;
		}
	>();

	sessions.forEach((session) => {
		const existing = playerMap.get(session.player) || {
			totalProfit: 0,
			sessions: 0,
			totalBuyIn: 0,
			highestSingleWinning: 0,
			normalizedAverage: 0,
		};

		playerMap.set(session.player, {
			totalProfit: existing.totalProfit + session.profit,
			sessions: existing.sessions + 1,
			totalBuyIn: existing.totalBuyIn + session.buyIn,
			highestSingleWinning: Math.max(
				existing.highestSingleWinning,
				session.profit
			),
			normalizedAverage:
				existing.totalBuyIn + session.buyIn > 0
					? ((existing.totalProfit + session.profit) /
							(existing.totalBuyIn + session.buyIn)) *
					  100
					: 0,
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
