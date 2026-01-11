import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts";
import { PokerSession } from "../../types/poker/types";
import { stringToColor } from "./utils";
import { Box, Typography, useTheme, useMediaQuery, Chip } from "@mui/material";

interface PerformanceChartProps {
	sessions: PokerSession[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ sessions }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.down("md"));

	const [selectedPlayer, setSelectedPlayer] = React.useState<string | null>(
		null
	);

	const playerData = new Map<string, { date: Date; profit: number }[]>();

	sessions.forEach((session) => {
		if (!playerData.has(session.player)) {
			playerData.set(session.player, []);
		}
		playerData.get(session.player)!.push({
			date: session.date,
			profit: session.profit,
		});
	});

	playerData.forEach((sessions) => {
		sessions.sort(
			(a, b) => a.date.getTime() - b.date.getTime()
		);
	});

	const cumulativeData = new Map<
		string,
		{ date: Date; cumulative: number }[]
	>();

	playerData.forEach((sessions, player) => {
		let cumulative = 0;
		const cumData = sessions.map((session) => {
			cumulative += session.profit;
			return {
				date: session.date,
				cumulative,
			};
		});
		cumulativeData.set(player, cumData);
	});

	// Get unique dates by timestamp
	const uniqueDateTimes = Array.from(
		new Set(sessions.map((s) => s.date.getTime()))
	).sort((a, b) => a - b);

	const allDates = uniqueDateTimes.map((time) => new Date(time));

	const chartData = allDates.map((date) => {
		const dataPoint: any = { date };
		const dateTime = date.getTime();

		cumulativeData.forEach((sessions, player) => {
			const relevantSessions = sessions.filter(
				(s) => s.date.getTime() <= dateTime
			);
			if (relevantSessions.length > 0) {
				const lastSession =
					relevantSessions[relevantSessions.length - 1];
				if (lastSession.date.getTime() === dateTime) {
					dataPoint[player] = lastSession.cumulative;

					const playerSession = sessions.find(
						(s) => s.date.getTime() === dateTime
					);
					if (playerSession) {
						const dayProfit =
							playerSession.cumulative -
							(relevantSessions.length > 1
								? relevantSessions[relevantSessions.length - 2]
									.cumulative
								: 0);
						dataPoint[`${player}_dayProfit`] = dayProfit;
					}
				}
			}
		});

		return dataPoint;
	});

	// Custom tooltip component - clean single-line format per player
	const CustomTooltip = ({ active, payload, label }: any) => {
		if (!active || !payload || payload.length === 0) return null;

		const date = label instanceof Date ? label.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		}) : label;

		// Sort by cumulative value descending
		const sortedPayload = [...payload].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

		return (
			<Box
				sx={{
					bgcolor: "rgba(255, 255, 255, 0.95)",
					border: "1px solid #ddd",
					borderRadius: 1,
					boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
					p: 1,
					fontSize: 12,
				}}
			>
				<Typography variant="caption" fontWeight="bold" sx={{ mb: 0.5, display: "block" }}>
					{date}
				</Typography>
				{sortedPayload.map((entry: any) => {
					const dayProfit = entry.payload[`${entry.name}_dayProfit`];
					const total = entry.value ?? 0;
					const daySign = dayProfit >= 0 ? "+" : "";
					const totalSign = total >= 0 ? "+" : "";

					return (
						<Box key={entry.name} sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.25 }}>
							<Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: entry.stroke, flexShrink: 0 }} />
							<Typography variant="caption" sx={{ fontWeight: 500 }}>
								{entry.name}:
							</Typography>
							{dayProfit !== undefined && (
								<Typography variant="caption" sx={{ color: dayProfit >= 0 ? "success.main" : "error.main" }}>
									{daySign}${dayProfit.toFixed(0)}
								</Typography>
							)}
							<Typography variant="caption" sx={{ color: "text.secondary" }}>
								({totalSign}${total.toFixed(0)})
							</Typography>
						</Box>
					);
				})}
			</Box>
		);
	};

	const players = Array.from(playerData.keys()).sort();

	// Responsive chart configuration - unified approach
	const chartHeight = isMobile ? 500 : isTablet ? 550 : 600;

	// Show fewer x-axis labels on smaller screens for readability
	const getXAxisInterval = () => {
		const totalDates = allDates.length;
		if (isMobile) {
			// Show ~5-6 labels on mobile
			return Math.max(1, Math.floor(totalDates / 5));
		}
		if (isTablet) {
			// Show ~8-10 labels on tablet
			return Math.max(1, Math.floor(totalDates / 8));
		}
		// Desktop: show all or reasonable amount
		return totalDates > 20 ? Math.floor(totalDates / 15) : 0;
	};

	return (
		<>
			<Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
				<Typography
					variant="h5"
					component="h2"
					align="center"
					fontWeight="bold"
					sx={{
						mb: 0.5,
						fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }
					}}
				>
					📈 Performance Over Time
				</Typography>
				<Typography
					variant="body2"
					align="center"
					color="text.secondary"
					sx={{ mb: { xs: 1, md: 2 } }}
				>
					Cumulative profit/loss over {allDates.length} sessions
				</Typography>
			</Box>

			<Box
				sx={{
					px: { xs: 0, sm: 1, md: 2 },
					pb: { xs: 1, md: 2 },
				}}
			>
				<Box sx={{ width: "100%" }}>
					<ResponsiveContainer width="100%" height={chartHeight}>
						<LineChart
							data={chartData}
							margin={{
								top: 10,
								right: isMobile ? 10 : 20,
								bottom: 10,
								left: isMobile ? -10 : 0,
							}}
						>
							<CartesianGrid strokeDasharray="3 3" opacity={0.6} />
							<ReferenceLine
								y={0}
								stroke="#666"
								strokeWidth={1.5}
								strokeDasharray="4 4"
							/>
							<XAxis
								dataKey="date"
								angle={-45}
								textAnchor="end"
								height={70}
								tick={{ fontSize: isMobile ? 10 : 12 }}
								interval={getXAxisInterval()}
								type="category"
								allowDuplicatedCategory={false}
								tickFormatter={(date) => {
									if (date instanceof Date) {
										// Shorter format for mobile
										const month = (date.getMonth() + 1).toString();
										const day = date.getDate().toString();
										return `${month}/${day}`;
									}
									return date;
								}}
							/>
							<YAxis
								type="number"
								width={isMobile ? 50 : 65}
								tick={({ x, y, payload }: any) => {
									const value = payload.value;
									const isPositive = value >= 0;
									const color = value === 0 ? "#666" : isPositive ? "#2e7d32" : "#d32f2f";
									const formatted = Math.abs(value) >= 1000
										? `$${(value / 1000).toFixed(1)}k`
										: `$${value}`;
									return (
										<text
											x={x}
											y={y}
											textAnchor="end"
											fill={color}
											fontSize={isMobile ? 10 : 12}
											fontWeight={value === 0 ? 600 : 400}
											dy={4}
										>
											{formatted}
										</text>
									);
								}}
							/>
							{!isMobile && (
								<Tooltip
									content={<CustomTooltip />}
									cursor={{ strokeDasharray: "3 3", stroke: "#999" }}
								/>
							)}
							<Legend
								content={({ payload }) => (
									<Box
										sx={{
											display: "flex",
											flexWrap: "wrap",
											justifyContent: "center",
											gap: { xs: "6px 14px", sm: "8px 20px" },
											pt: 2,
											px: 1,
										}}
									>
										{payload?.map((entry: any) => (
											<Box
												key={entry.value}
												onClick={() => {
													if (selectedPlayer === entry.value) {
														setSelectedPlayer(null);
													} else {
														setSelectedPlayer(entry.value);
													}
												}}
												sx={{
													display: "flex",
													alignItems: "center",
													gap: 0.5,
													cursor: "pointer",
													opacity: selectedPlayer && selectedPlayer !== entry.value ? 0.4 : 1,
													transition: "opacity 0.2s ease",
												}}
											>
												<Box
													sx={{
														width: isMobile ? 10 : 12,
														height: isMobile ? 10 : 12,
														borderRadius: "50%",
														bgcolor: entry.color,
													}}
												/>
												<Typography
													variant="body2"
													sx={{
														fontSize: isMobile ? 12 : 14,
														fontWeight: selectedPlayer === entry.value ? 700 : 500,
														textDecoration: selectedPlayer === entry.value ? "underline" : "none",
													}}
												>
													{entry.value}
												</Typography>
											</Box>
										))}
									</Box>
								)}
							/>
							{players.map((player) => (
								<Line
									key={player}
									type="monotone"
									dataKey={player}
									stroke={stringToColor(player)}
									strokeWidth={
										selectedPlayer === null || selectedPlayer === player
											? isMobile ? 2 : 2.5
											: 1
									}
									opacity={
										selectedPlayer === null || selectedPlayer === player
											? 1
											: 0.2
									}
									dot={{
										r: selectedPlayer === null || selectedPlayer === player
											? (isMobile ? 3 : 4)
											: 2,
										strokeWidth: 1,
									}}
									activeDot={{ r: isMobile ? 6 : 7 }}
									connectNulls={true}
								/>
							))}
						</LineChart>
					</ResponsiveContainer>
				</Box>
			</Box>
		</>
	);
};

export default PerformanceChart;
