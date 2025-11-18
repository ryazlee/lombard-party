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

interface PerformanceChartProps {
	sessions: PokerSession[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ sessions }) => {
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
	// Group sessions by player and calculate cumulative profit over time
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

	// Sort each player's sessions by date before calculating cumulative
	playerData.forEach((sessions, player) => {
		sessions.sort(
			(a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
		);
	});

	// Calculate cumulative profit for each player
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

	// Get all unique dates sorted chronologically
	const allDates = Array.from(new Set(sessions.map((s) => s.date))).sort(
		(a, b) => {
			return parseDate(a).getTime() - parseDate(b).getTime();
		}
	);

	// Build chart data with all players
	const chartData = allDates.map((date) => {
		const dataPoint: any = { date };
		const dateTime = parseDate(date).getTime();

		cumulativeData.forEach((sessions, player) => {
			// Find the cumulative value at or before this date
			const relevantSessions = sessions.filter(
				(s) => parseDate(s.date).getTime() <= dateTime
			);
			if (relevantSessions.length > 0) {
				const lastSession =
					relevantSessions[relevantSessions.length - 1];
				// Only add the data point if the player played on this specific date
				if (lastSession.date === date) {
					dataPoint[player] = lastSession.cumulative;
					// Store the day's profit/loss separately for tooltip
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

	// Custom tooltip formatter
	const tooltipFormatter = (value: number, name: string, props: any) => {
		const dayProfit = props.payload[`${name}_dayProfit`];
		if (dayProfit !== undefined) {
			const sign = dayProfit >= 0 ? "+" : "";
			return `$${value.toFixed(2)} (${sign}$${dayProfit.toFixed(2)})`;
		}
		return `$${value.toFixed(2)}`;
	};

	// Get unique players for lines
	const players = Array.from(playerData.keys()).sort();

	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
			<div className="px-6 py-4 bg-gray-100 border-b">
				<h2 className="text-2xl font-semibold text-gray-800">
					Performance Over Time
				</h2>
			</div>
			<div className="p-6">
				<ResponsiveContainer width="100%" height={700}>
					<LineChart data={chartData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							angle={-45}
							textAnchor="end"
							height={80}
							tick={{ fontSize: 12 }}
							type="category"
							allowDuplicatedCategory={false}
						/>
						<YAxis
							label={{
								value: "Cumulative Profit ($)",
								angle: -90,
								position: "insideLeft",
							}}
						/>
						<Tooltip formatter={tooltipFormatter} />
						<Legend onClick={handleLegendClick} />
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
			</div>
		</div>
	);
};

export default PerformanceChart;
