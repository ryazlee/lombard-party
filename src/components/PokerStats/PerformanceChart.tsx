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
} from "recharts";
import { PokerSession } from "../../types/poker/types";
import { stringToColor } from "./utils";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

interface PerformanceChartProps {
	sessions: PokerSession[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ sessions }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const [hiddenPlayers, setHiddenPlayers] = React.useState<Set<string>>(
		new Set()
	);
	const [selectedPlayer, setSelectedPlayer] = React.useState<string | null>(
		null
	);

	const handleLegendClick = (data: any) => {
		const playerName = data.value;
		if (selectedPlayer === playerName) {
			setSelectedPlayer(null);
		} else {
			setSelectedPlayer(playerName);
		}
	};

	const parseDate = (dateStr: string) => {
		const [month, day, year] = dateStr.split("/").map(Number);
		const fullYear = year < 100 ? 2000 + year : year;
		return new Date(fullYear, month - 1, day);
	};

	const playerData = new Map<string, { date: string; profit: number }[]>();

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
			(a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
		);
	});

	const cumulativeData = new Map<
		string,
		{ date: string; cumulative: number }[]
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

	const allDates = Array.from(new Set(sessions.map((s) => s.date))).sort(
		(a, b) => {
			return parseDate(a).getTime() - parseDate(b).getTime();
		}
	);

	const chartData = allDates.map((date) => {
		const dataPoint: any = { date };
		const dateTime = parseDate(date).getTime();

		cumulativeData.forEach((sessions, player) => {
			const relevantSessions = sessions.filter(
				(s) => parseDate(s.date).getTime() <= dateTime
			);
			if (relevantSessions.length > 0) {
				const lastSession =
					relevantSessions[relevantSessions.length - 1];
				if (lastSession.date === date) {
					dataPoint[player] = lastSession.cumulative;

					const playerSession = sessions.find((s) => s.date === date);
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

	const tooltipFormatter = (value: number, name: string, props: any) => {
		const dayProfit = props.payload[`${name}_dayProfit`];
		if (dayProfit !== undefined) {
			const sign = dayProfit >= 0 ? "+" : "";
			return `$${value.toFixed(2)} (${sign}$${dayProfit.toFixed(2)})`;
		}
		return `$${value.toFixed(2)}`;
	};

	const players = Array.from(playerData.keys()).sort();
	const chartHeight = isMobile ? 400 : 600;

	return (
		<Box
			sx={{
				p: isMobile ? 2 : 6,
				minHeight: 500,
				bgcolor: "#f3f4f6",
				// Centering content
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<Typography
				variant={isMobile ? "h5" : "h4"}
				component="h2"
				align="center"
				fontWeight="bold"
				sx={{
					mb: isMobile ? 2 : 4,
					color: "#1f2937",
					maxWidth: 1200,
					width: "100%",
				}}
			>
				Performance Over Time
			</Typography>

			{/* Chart Container - Centered and constrained */}
			<Box
				sx={{
					bgcolor: "white",
					boxShadow: 3,
					borderRadius: 2,
					p: isMobile ? 1.5 : 4,
					width: "100%",
					maxWidth: 1200, // Explicit max width for centering
				}}
			>
				<ResponsiveContainer width="100%" height={chartHeight}>
					<LineChart
						data={chartData}
						margin={{
							top: 5,
							right: isMobile ? 0 : 20,
							left: isMobile ? -20 : 0,
							bottom: isMobile ? 0 : 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							angle={isMobile ? -90 : -45}
							textAnchor="end"
							height={isMobile ? 100 : 80}
							tick={{ fontSize: isMobile ? 8 : 12 }}
							interval={isMobile ? "preserveStart" : 0}
							type="category"
							allowDuplicatedCategory={false}
						/>
						<YAxis
							tick={{ fontSize: isMobile ? 10 : 12 }}
							label={{
								value: "Cumulative Profit ($)",
								angle: -90,
								position: "insideLeft",
								fontSize: isMobile ? 10 : 14,
								offset: isMobile ? 5 : 10,
							}}
						/>
						<Tooltip formatter={tooltipFormatter} />
						<Legend
							onClick={handleLegendClick}
							iconType="circle"
							wrapperStyle={
								isMobile
									? { fontSize: 10, padding: "5px 0" }
									: {}
							}
						/>
						{players
							.filter((player) => !hiddenPlayers.has(player))
							.map((player) => (
								<Line
									key={player}
									type="monotone"
									dataKey={player}
									stroke={stringToColor(player)}
									strokeWidth={
										selectedPlayer === null ||
										selectedPlayer === player
											? 3
											: 1.5
									}
									opacity={
										selectedPlayer === null ||
										selectedPlayer === player
											? 1
											: 0.15
									}
									dot={
										selectedPlayer === null ||
										selectedPlayer === player
											? { r: 4, strokeWidth: 2 }
											: { r: 2, strokeWidth: 1 }
									}
									activeDot={{ r: 6 }}
									connectNulls={true}
								/>
							))}
					</LineChart>
				</ResponsiveContainer>
			</Box>
		</Box>
	);
};

export default PerformanceChart;
