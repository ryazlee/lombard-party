import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	fetchPokerStats,
	getPlayerStats,
	PokerSession,
	PlayerSummary,
} from "../services/pokerService";
import PlayerSummaryTable from "../components/PokerStats/PlayerSummaryTable";
import RecentSessionsTable from "../components/PokerStats/RecentSessionsTable";
import PerformanceChart from "../components/PokerStats/PerformanceChart";

const PokerStats: React.FC = () => {
	const [sessions, setSessions] = useState<PokerSession[]>([]);
	const [playerSummaries, setPlayerSummaries] = useState<PlayerSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				const data = await fetchPokerStats();
				setSessions(data.sessions);
				setPlayerSummaries(data.playerSummaries);
				setError(null);
			} catch (err) {
				setError(
					"Failed to load poker stats. Make sure the Google Sheet is publicly accessible and the API key is set."
				);
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	const playerStats =
		sessions.length > 0 ? getPlayerStats(sessions, playerSummaries) : [];

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-xl text-gray-600">
					Loading poker stats...
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 p-8">
				<div className="max-w-4xl mx-auto">
					<Link
						to="/"
						className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
					>
						← Back to Home
					</Link>
					<div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
						<p className="font-semibold">Error</p>
						<p>{error}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-6">
					<Link to="/" className="text-blue-600 hover:text-blue-800">
						← Back to Home
					</Link>
				</div>

				<h1 className="text-4xl font-bold text-gray-900 mb-8">
					Poker Stats
				</h1>

				<div className="space-y-8">
					{/* Player Summary */}
					<PlayerSummaryTable playerStats={playerStats} />

					{/* Performance Chart */}
					<PerformanceChart sessions={sessions} />

					{/* Recent Sessions */}
					<RecentSessionsTable sessions={sessions} />
				</div>
			</div>
		</div>
	);
};

export default PokerStats;
