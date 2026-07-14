import type { PlayerSummary, PokerSession } from "../../types/poker/types";
import { fetchSheetRows } from "./GoogleSheetsClient";
import type { IPokerStore, PokerData } from "./IPokerStore";

const SHEET_ID = "1Hm-MOWeBZf6b4YTOhJe0rDc8KC6rXPdprqLRbxBscis";
const SHEET_NAME = "data";

export class PokerStore implements IPokerStore {
	async getPokerData(): Promise<PokerData> {
		const rows = await fetchSheetRows({
			sheetId: SHEET_ID,
			sheetName: SHEET_NAME,
		});

		if (rows.length === 0) {
			return { sessions: [], playerSummaries: [] };
		}

		return parseSheetData(rows);
	}
}

/**
 * Sheet layout:
 * - Row 0: headers (Winnings, Count, Name, then dates)
 * - Row 1: buy-in amounts
 * - Row 2+: player data
 */
function parseSheetData(rows: string[][]): PokerData {
	if (rows.length < 3) {
		return { sessions: [], playerSummaries: [] };
	}

	const headerRow = rows[0];
	const buyInRow = rows[1];
	const playerRows = rows.slice(2);

	const dates = headerRow.slice(3).filter((d) => d && d.trim());

	const sessions: PokerSession[] = [];
	const playerSummaries: PlayerSummary[] = [];

	playerRows.forEach((row) => {
		const winnings = parseFloat(row[0]?.replace(/[$,]/g, "") || "0");
		const count = parseInt(row[1] || "0", 10);
		const playerName = row[2];

		if (!playerName) return;

		playerSummaries.push({
			player: playerName,
			totalWinnings: winnings,
			sessionCount: count,
		});

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
