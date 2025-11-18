import React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

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

const formatCurrency = (value: number): string => {
	return `$${value.toFixed(2)}`;
};

const formatPercent = (value: number): string => {
	return `${value.toFixed(1)}%`;
};

const getTextColorStyle = (value: number): React.CSSProperties => {
	return {
		color: value >= 0 ? "#16a34a" : "#dc2626", // green-600 or red-600
		fontWeight: "600",
	};
};

const baseColumns: GridColDef<PlayerStat>[] = [
	{
		field: "player",
		headerName: "Player",
		flex: 1,
		minWidth: 100, // Ensure minimum width
		sortable: true,
		headerClassName: "super-app-theme--header",
	},
	{
		field: "sessions",
		headerName: "Sessions",
		flex: 0.5,
		minWidth: 80,
		type: "number",
		sortable: true,
		headerClassName: "super-app-theme--header",
	},
	{
		field: "totalWinnings",
		headerName: "Total Winnings",
		flex: 1,
		minWidth: 120,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value !== undefined && ( // Check for undefined/null
				<span style={getTextColorStyle(params.value)}>
					{formatCurrency(params.value)}
				</span>
			),
	},
	{
		field: "avgProfit",
		headerName: "Avg Profit",
		flex: 1,
		minWidth: 100,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value !== undefined && (
				<span style={getTextColorStyle(params.value)}>
					{formatCurrency(params.value)}
				</span>
			),
	},
	{
		field: "highestSingleWinning",
		headerName: "Highest Single Win",
		flex: 1,
		minWidth: 120,
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
		minWidth: 130,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value !== undefined && (
				<span style={getTextColorStyle(params.value)}>
					{formatPercent(params.value)}
				</span>
			),
	},
	{
		field: "roi",
		headerName: "ROI (%)",
		flex: 1,
		minWidth: 90,
		type: "number",
		sortable: true,
		align: "right",
		headerAlign: "right",
		headerClassName: "super-app-theme--header",
		renderCell: (params: GridRenderCellParams<PlayerStat, number>) =>
			params.value !== undefined && (
				<span style={getTextColorStyle(params.value)}>
					{formatPercent(params.value)}
				</span>
			),
	},
];

const PlayerSummaryTableDataGrid: React.FC<PlayerSummaryTableProps> = ({
	playerStats,
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const rowsWithId = playerStats.map((stat, index) => ({
		...stat,
		id: index + 1,
	}));

	return (
		<Box sx={{ p: isMobile ? 2 : 6, minHeight: 500, bgcolor: "#f3f4f6" }}>
			<Typography
				variant={isMobile ? "h5" : "h4"}
				component="h2"
				align="center"
				fontWeight="bold"
				sx={{ mb: isMobile ? 2 : 4, color: "#1f2937" }}
			>
				Poker Player Profit Summary
			</Typography>

			<Box
				sx={{
					height: isMobile ? 450 : 600,
					width: "100%",
					mx: "auto",
					maxWidth: 1200,
					boxShadow: 3,
					borderRadius: 2,
					overflowX: "auto",
					bgcolor: "white",
					"& .super-app-theme--header": {
						bgcolor: "rgba(243, 244, 246, 1)", // gray-100
						fontWeight: "bold",
						color: "rgba(75, 85, 99, 1)", // gray-600
						fontSize: isMobile ? 12 : 14,
					},
				}}
			>
				<DataGrid
					rows={rowsWithId}
					columns={baseColumns}
					initialState={{
						pagination: {
							paginationModel: { pageSize: isMobile ? 5 : 10 }, // 6. Fewer rows per page on mobile
						},
						sorting: {
							sortModel: [
								{ field: "totalWinnings", sort: "desc" },
							],
						},
					}}
					pageSizeOptions={[5, 10, 20]}
					disableRowSelectionOnClick
					sx={{
						border: "none",
						"& .MuiDataGrid-cell": {
							py: isMobile ? 0.5 : 1.5,
							px: isMobile ? 1 : 2,
							fontSize: isMobile ? 12 : 14,
						},
						"& .MuiDataGrid-columnHeaderTitle": {
							whiteSpace: "normal", // Allow header text wrapping
							lineHeight: "normal",
						},
					}}
				/>
			</Box>
		</Box>
	);
};

export default PlayerSummaryTableDataGrid;
