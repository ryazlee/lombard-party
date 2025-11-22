const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || "";

export interface GoogleSheetConfig {
	sheetId: string;
	sheetName: string;
}

/**
 * Fetches data from a Google Sheet using either CSV export (public) or API key
 */
export const fetchSheetData = async (
	config: GoogleSheetConfig
): Promise<string[][]> => {
	const { sheetId, sheetName } = config;

	try {
		// If no API key, use public CSV export
		if (!API_KEY) {
			return await fetchSheetDataViaCsv(sheetId, sheetName);
		}

		// Using Google Sheets API v4 with API key
		return await fetchSheetDataViaApi(sheetId, sheetName);
	} catch (error) {
		console.error("Error fetching sheet data:", error);
		throw error;
	}
};

/**
 * Fetches sheet data via public CSV export
 */
const fetchSheetDataViaCsv = async (
	sheetId: string,
	sheetName: string
): Promise<string[][]> => {
	const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
	const response = await fetch(csvUrl);

	if (!response.ok) {
		throw new Error(
			"Failed to fetch sheet data. Make sure the Google Sheet is publicly accessible (Anyone with the link can view)."
		);
	}

	const csvText = await response.text();
	return parseCsv(csvText);
};

/**
 * Fetches sheet data via Google Sheets API v4
 */
const fetchSheetDataViaApi = async (
	sheetId: string,
	sheetName: string
): Promise<string[][]> => {
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${API_KEY}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Failed to fetch sheet data via API");
	}

	const data = await response.json();
	const rows = data.values;

	if (!rows || rows.length === 0) {
		return [];
	}

	return rows;
};

/**
 * Parses CSV text into a 2D array of strings
 */
const parseCsv = (csvText: string): string[][] => {
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

	return rows;
};
