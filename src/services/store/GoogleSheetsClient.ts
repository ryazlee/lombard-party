const API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || "";

export type GoogleSheetConfig = {
	sheetId: string;
	sheetName: string;
};

/**
 * Low-level Google Sheets transport used by stores.
 * Prefer CSV export when no API key is configured (public sheets).
 */
export async function fetchSheetRows(
	config: GoogleSheetConfig
): Promise<string[][]> {
	const { sheetId, sheetName } = config;

	if (!API_KEY) {
		return fetchSheetDataViaCsv(sheetId, sheetName);
	}

	return fetchSheetDataViaApi(sheetId, sheetName);
}

async function fetchSheetDataViaCsv(
	sheetId: string,
	sheetName: string
): Promise<string[][]> {
	const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
	const response = await fetch(csvUrl);

	if (!response.ok) {
		throw new Error(
			"Failed to fetch sheet data. Make sure the Google Sheet is publicly accessible (Anyone with the link can view)."
		);
	}

	const csvText = await response.text();
	return parseCsv(csvText);
}

async function fetchSheetDataViaApi(
	sheetId: string,
	sheetName: string
): Promise<string[][]> {
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
}

function parseCsv(csvText: string): string[][] {
	const lines = csvText.split("\n");
	return lines.map((line) => {
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
}
