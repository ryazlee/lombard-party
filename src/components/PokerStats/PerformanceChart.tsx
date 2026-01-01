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

	const tooltipFormatter = (value: number, name: string, props: any) => {
		const dayProfit = props.payload[`${name}_dayProfit`];
		if (dayProfit !== undefined) {
			const sign = dayProfit >= 0 ? "+" : "";
			return `$${value.toFixed(2)} (${sign}$${dayProfit.toFixed(2)})`;
		}
		return `$${value.toFixed(2)}`;
	};

	const players = Array.from(playerData.keys()).sort();

	// Apply mobile friendly logic to chart height
	const chartHeight = isMobile ? 400 : 700;
	// Adjust XAxis angle and height for mobile
	const xAxisAngle = isMobile ? -90 : -45;
	const xAxisHeight = isMobile ? 100 : 80;
	const xAxisInterval = isMobile ? "preserveStart" : 0;
	const tickFontSize = isMobile ? 8 : 12;

	return (
		<>
			<Box
				sx={{
					px: isMobile ? 2 : 3,
				}}
			>
				<Typography
					variant={isMobile ? "h5" : "h4"}
					component="h2"
					align="center"
					fontWeight="bold"
					sx={{ mb: isMobile ? 2 : 4 }}
				>
					Performance Over Time
				</Typography>
			</Box>

			<Box sx={{ p: isMobile ? 2 : 3 }}>
				<ResponsiveContainer width="100%" height={chartHeight}>
					<LineChart
						data={chartData}
						margin={{
							top: 5,
							right: 10,
							bottom: isMobile ? 5 : 10,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							angle={xAxisAngle}
							textAnchor="end"
							height={xAxisHeight}
							tick={{ fontSize: tickFontSize }}
							interval={xAxisInterval}
							type="category"
							allowDuplicatedCategory={false}
							axisLine={true}
							tickLine={true}
							tickFormatter={(date) => {
								if (date instanceof Date) {
									const month = (date.getMonth() + 1)
										.toString()
										.padStart(2, "0");
									const day = date
										.getDate()
										.toString()
										.padStart(2, "0");
									const year = date
										.getFullYear()
										.toString()
										.slice(-2);
									return `${month}/${day}/${year}`;
								}
								return date;
							}}
						/>
						<YAxis
							tick={{ fontSize: isMobile ? 10 : 12 }}
							type="number"
							tickFormatter={(value) => `$${value}`}
						/>
						{!isMobile && <Tooltip formatter={tooltipFormatter} />}
						<Legend
							onClick={handleLegendClick}
							iconType="circle"
							wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
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
		</>
	);
};

export default PerformanceChart;
