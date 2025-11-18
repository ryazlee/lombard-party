import React from "react";
// Removed dependency on @mui/x-data-grid to resolve compilation error

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

// Function to format currency, used directly in the JSX
const formatCurrency = (value: number): string => {
	return `$${value.toFixed(2)}`;
};

// Function to format percentage
const formatPercent = (value: number): string => {
	return `${value.toFixed(1)}%`;
};

// Utility function to get the Tailwind color class based on value
const getColorClass = (value: number): string => {
	return value >= 0
		? "text-green-600 font-semibold"
		: "text-red-600 font-semibold";
};

const PlayerSummaryTable: React.FC<PlayerSummaryTableProps> = ({
	playerStats,
}) => {
	// A simple HTML table is used here instead of DataGrid to avoid dependency issues.
	return (
		<div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
			<h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-tight">
				Poker Player Profit Summary
			</h1>

			<div className="mx-auto max-w-7xl shadow-2xl rounded-xl overflow-hidden bg-white border border-gray-200">
				<div className="overflow-x-auto">
					<table className="min-w-full divide-y divide-gray-200">
						<thead className="bg-gray-100">
							<tr>
								<th className="px-4 py-3 sm:px-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider rounded-tl-xl">
									Player
								</th>
								<th className="px-4 py-3 sm:px-6 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
									Sessions
								</th>
								<th className="px-4 py-3 sm:px-6 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
									Total Winnings
								</th>
								<th className="px-4 py-3 sm:px-6 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
									Avg Profit
								</th>
								<th className="px-4 py-3 sm:px-6 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
									Highest Single Win
								</th>
								<th className="px-4 py-3 sm:px-6 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
									Normalized Avg (%)
								</th>
								<th className="px-4 py-3 sm:px-6 text-right text-xs font-bold text-gray-600 uppercase tracking-wider rounded-tr-xl">
									ROI (%)
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-100">
							{playerStats.map((stat, index) => (
								<tr
									key={index}
									className="hover:bg-indigo-50/30 transition duration-150 ease-in-out"
								>
									<td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-900">
										{stat.player}
									</td>
									<td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-gray-700">
										{stat.sessions}
									</td>
									<td
										className={`px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-right ${getColorClass(
											stat.totalWinnings
										)}`}
									>
										{formatCurrency(stat.totalWinnings)}
									</td>
									<td
										className={`px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-right ${getColorClass(
											stat.avgProfit
										)}`}
									>
										{formatCurrency(stat.avgProfit)}
									</td>
									<td className="px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-right text-gray-800">
										{formatCurrency(
											stat.highestSingleWinning
										)}
									</td>
									<td
										className={`px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-right ${getColorClass(
											stat.normalizedAverage
										)}`}
									>
										{formatPercent(stat.normalizedAverage)}
									</td>
									<td
										className={`px-4 py-4 sm:px-6 whitespace-nowrap text-sm text-right ${getColorClass(
											stat.roi
										)}`}
									>
										{formatPercent(stat.roi)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			{/* Added a note for better mobile view on small screens */}
			<p className="text-center text-xs text-gray-500 mt-4 italic sm:hidden">
				(Scroll table horizontally to view all columns on small screens)
			</p>
		</div>
	);
};

export default PlayerSummaryTable;
