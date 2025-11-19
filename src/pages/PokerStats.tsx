import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPokerStats, getPlayerStats } from "../services/pokerService";
import PlayerSummaryTable from "../components/PokerStats/PlayerSummaryTable";
import PerformanceChart from "../components/PokerStats/PerformanceChart";
import StatsCard from "../components/PokerStats/StatsCard";
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
					p: 2, // Mobile padding
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
			<Box
				sx={{
					minHeight: "100vh",
					bgcolor: "#f3f4f6",
					p: isMobile ? 2 : 4,
				}}
			>
				<Box sx={{ maxWidth: 900, mx: "auto" }}>
					<Link
						to="/"
						style={{
							color: theme.palette.primary.main,
							textDecoration: "none",
							marginBottom: theme.spacing(2),
							display: "inline-block",
						}}
					>
						← Back to Home
					</Link>
					<Alert severity="error">
						<Typography component="p" fontWeight="bold">
							Error
						</Typography>
						<Typography component="p">{error}</Typography>
					</Alert>
				</Box>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				minHeight: "100vh",
				p: 2,
			}}
		>
			<Box
				sx={{
					width: "100%",
					maxWidth: "1200px", // Adjusted from 7xl equivalent for better control
					mx: "auto",
				}}
			>
				<Box sx={{ mb: 2 }}>
					<Link
						to="/"
						style={{
							color: theme.palette.primary.main,
							textDecoration: "none",
						}}
					>
						← Back to Home
					</Link>
				</Box>

				<Typography
					variant={"h4"}
					fontWeight="bold"
					color="text.primary"
					sx={{ mb: 3 }}
				>
					Poker Stats
				</Typography>

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
			</Box>
		</Box>
	);
};

export default PokerStats;
