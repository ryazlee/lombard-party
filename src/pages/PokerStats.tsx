import React, { useEffect, useState } from "react";
import { fetchPokerStats, getPlayerStats } from "../services/pokerService";
import PlayerSummaryTable from "../components/PokerStats/PlayerSummaryTable";
import PerformanceChart from "../components/PokerStats/PerformanceChart";
import StatsCard from "../components/PokerStats/StatsCard";
import { PageWithParticles } from "../components/common/Page";
import { PlayerSummary, PokerSession } from "../types/poker/types";
import {
	Box,
	Typography,
	CircularProgress,
	Alert,
	useTheme,
	useMediaQuery,
} from "@mui/material";

const PokerStats: React.FC = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
			<Box
				sx={{
					minHeight: "100vh",
					bgcolor: "#f3f4f6",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					p: 2,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<CircularProgress size={24} />
					<Typography variant="h6" color="text.secondary">
						Loading poker stats...
					</Typography>
				</Box>
			</Box>
		);
	}

	if (error) {
		return (
			<PageWithParticles title="Poker Stats" maxWidth="900px">
				<Alert severity="error">
					<Typography component="p" fontWeight="bold">
						Error
					</Typography>
					<Typography component="p">{error}</Typography>
				</Alert>
			</PageWithParticles>
		);
	}

	return (
		<PageWithParticles title="Poker Stats">
			{/* Content Sections: Responsive vertical spacing */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 4,
				}}
			>
				{/* Performance Chart */}
				<StatsCard>
					<PerformanceChart sessions={sessions} />
				</StatsCard>

				{/* Player Summary */}
				<StatsCard>
					<PlayerSummaryTable playerStats={playerStats} />
				</StatsCard>
			</Box>
		</PageWithParticles>
	);
};

export default PokerStats;
