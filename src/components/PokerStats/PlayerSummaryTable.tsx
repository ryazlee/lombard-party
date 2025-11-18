import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

// --- 1. Player Stat Interface ---
interface PlayerStat {
	player: string;
	sessions: number;
	totalWinnings: number;
	avgProfit: number; // Average Winnings/Profit per session
	roi: number; // Return on Investment (Avg Weighted Average Performance)
	highestSingleWinning: number; // Highest single score
	normalizedAverage: number; // Normalized average (avg % of buy-in won/lost)
}

interface PlayerSummaryTableProps {
	playerStats: PlayerStat[];
}

// Function to format currency, used directly in the DataGrid renderCell
const formatCurrency = (value: number): string => {
	return `$${value.toFixed(2)}`;
};

// Function to format percentage
const formatPercent = (value: number): string => {
	return `${value.toFixed(1)}%`;
};

// Utility function to get the style for color based on value
const getTextColorStyle = (value: number): React.CSSProperties => {
	return {
		color: value >= 0 ? "#16a34a" : "#dc2626", // green-600 or red-600
		fontWeight: "600",
	};
};

// --- 2. Define DataGrid Columns ---
const columns: GridColDef<PlayerStat>[] = [
	{
		field: "player",
		headerName: "Player",
		flex: 1,
		sortable: true,
		headerClassName: "super-app-theme--header",
	},
	{
		field: "sessions",
		headerName: "Sessions",
		flex: 1,
		type: "number",
		sortable: true,
		headerClassName: "super-app-theme--header",
	},
	{
		field: "totalWinnings",
		headerName: "Total Winnings",
		flex: 1,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value && (
				<span style={getTextColorStyle(params.value)}>
					{formatCurrency(params.value)}
				</span>
			),
	},
	{
		field: "avgProfit",
		headerName: "Avg Profit",
		flex: 1,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value && (
				<span style={getTextColorStyle(params.value)}>
					{formatCurrency(params.value)}
				</span>
			),
	},
	{
		field: "highestSingleWinning",
		headerName: "Highest Single Win",
		flex: 1,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		valueFormatter: (value) => formatCurrency(value),
	},
	{
		field: "normalizedAverage",
		headerName: "Normalized Avg (%)",
		flex: 1,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value && (
				<span style={getTextColorStyle(params.value)}>
					{formatPercent(params.value)}
				</span>
			),
	},
	{
		field: "roi",
		headerName: "ROI (%)",
		flex: 1,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value && (
				<span style={getTextColorStyle(params.value)}>
					{formatPercent(params.value)}
				</span>
			),
	},
];

// --- 3. Refactored Component using DataGrid ---
const PlayerSummaryTableDataGrid: React.FC<PlayerSummaryTableProps> = ({
	playerStats,
}) => {
	// DataGrid rows require a unique 'id' field.
	const rowsWithId = playerStats.map((stat, index) => ({
		...stat,
		id: index + 1, // Using index as a stable ID for this example
	}));

	return (
		<Box sx={{ p: 6, minHeight: "100vh", bgcolor: "#f3f4f6" }}>
			<Typography
				variant="h4"
				component="h2"
				align="center"
				fontWeight="bold"
				sx={{ mb: 4, color: "#1f2937" }}
			>
				Poker Player Profit Summary
			</Typography>

			<Box
				sx={{
					height: 600, // Fixed height is often required for DataGrid
					width: "100%",
					mx: "auto",
					maxWidth: 1200,
					boxShadow: 3,
					borderRadius: 2,
					overflow: "hidden",
					bgcolor: "white",
					// Custom header styling (optional)
					"& .super-app-theme--header": {
						bgcolor: "rgba(243, 244, 246, 1)", // gray-100
						fontWeight: "bold",
						color: "rgba(75, 85, 99, 1)", // gray-600
					},
				}}
			>
				<DataGrid
					rows={rowsWithId}
					columns={columns}
					// Basic features
					initialState={{
						pagination: {
							paginationModel: { pageSize: 10 },
						},
					}}
					pageSizeOptions={[5, 10, 20]}
					disableRowSelectionOnClick
					// Styling props for a cleaner look
					sx={{
						border: "none",
						"& .MuiDataGrid-cell": {
							py: 1.5,
							px: 2,
						},
					}}
				/>
			</Box>
		</Box>
	);
};

export default PlayerSummaryTableDataGrid;
