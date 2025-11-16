import React from "react";

interface PlayerStat {
	player: string;
	sessions: number;
	totalWinnings: number;
	avgProfit: number;
	roi: number;
}

interface PlayerSummaryTableProps {
	playerStats: PlayerStat[];
}

const PlayerSummaryTable: React.FC<PlayerSummaryTableProps> = ({
	playerStats,
}) => {
	return (
		<div className="bg-white rounded-lg shadow overflow-hidden">
			<div className="px-6 py-4 bg-gray-100 border-b">
				<h2 className="text-2xl font-semibold text-gray-800">
					Player Summary
				</h2>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Player
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Sessions
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Total Winnings
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Avg Profit
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ROI
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{playerStats
							.sort((a, b) => b.totalWinnings - a.totalWinnings)
							.map((stat, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
										{stat.player}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{stat.sessions}
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
											stat.totalWinnings >= 0
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										${stat.totalWinnings.toFixed(2)}
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm ${
											stat.avgProfit >= 0
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										${stat.avgProfit.toFixed(2)}
									</td>
									<td
										className={`px-6 py-4 whitespace-nowrap text-sm ${
											stat.roi >= 0
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{stat.roi.toFixed(1)}%
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default PlayerSummaryTable;
