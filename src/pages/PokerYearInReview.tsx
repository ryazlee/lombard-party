import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPokerStats, getPlayerStats } from "../services/pokerService";
import { PlayerStat } from "../types/poker/types";
import { PageWithParticles } from "../components/common/Page";
import StatsCard from "../components/PokerStats/StatsCard";
import {
	Box,
	Typography,
	CircularProgress,
	useTheme,
	Divider,
	Chip,
} from "@mui/material";

const convertNameToSnakeCase = (name?: string) => {
	if (!name) return "";
	return name.toLowerCase().replace(/\s+/g, "_");
};

export const PokerYearInReview: React.FC = () => {
	const { name } = useParams<{ name: string }>();
	const theme = useTheme();
	const [loading, setLoading] = useState(true);

	const [currentUserStats, setCurrentUserStats] = useState<PlayerStat | null>(
		null
	);

	useEffect(() => {
		const loadPokerStats = async () => {
			try {
				const rawStats = await fetchPokerStats();
				const stats = getPlayerStats(
					rawStats.sessions,
					rawStats.playerSummaries
				);

				// iterate through stats to find current user
				const userStats = stats.find(
					(stat) => convertNameToSnakeCase(stat.player) === name
				);

				if (userStats) {
					setCurrentUserStats(userStats);
				}

				setLoading(false);
			} catch (error) {
				console.error("Error fetching poker stats:", error);
				setLoading(false);
			}
		};

		void loadPokerStats();
	}, [name]);

	if (loading) {
		return (
			<PageWithParticles title="Your 2025 Poker Wrapped">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "50vh",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<CircularProgress size={24} />
						<Typography variant="h6" color="text.secondary">
							Loading your poker year...
						</Typography>
					</Box>
				</Box>
			</PageWithParticles>
		);
	}

	if (!currentUserStats) {
		return (
			<PageWithParticles title="Your 2025 Poker Wrapped">
				<StatsCard>
					<Typography
						variant="h6"
						color="text.secondary"
						textAlign="center"
					>
						No stats found for {name}
					</Typography>
				</StatsCard>
			</PageWithParticles>
		);
	}

	const isWinner = currentUserStats.totalWinnings > 0;
	const totalAmount = Math.abs(currentUserStats.totalWinnings || 0);
	const biggestSession = Math.abs(currentUserStats.highestSingleWinning || 0);

	return (
		<PageWithParticles
			title={`${currentUserStats.player}'s 2025 Poker Wrapped`}
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
					gap: 2,
				}}
			>
				{/* Main Stats Card */}
				<StatsCard>
					<Box sx={{ textAlign: "center", py: 1 }}>
						<Typography
							variant="overline"
							color="text.secondary"
							sx={{ fontSize: "0.75rem", letterSpacing: 1 }}
						>
							This Year You
						</Typography>
						<Typography
							variant="h3"
							fontWeight="bold"
							sx={{
								my: 1,
								color: isWinner ? "#4caf50" : "#ff6b35",
							}}
						>
							{isWinner ? "📈 Won" : "📉 Lost"}
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{ color: theme.palette.text.primary }}
						>
							${totalAmount.toFixed(2)}
						</Typography>
					</Box>
				</StatsCard>

				{/* Sessions Played */}
				<StatsCard>
					<Box sx={{ textAlign: "center", py: 1 }}>
						<Typography
							variant="overline"
							color="text.secondary"
							sx={{ fontSize: "0.75rem", letterSpacing: 1 }}
						>
							Sessions Played
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{ my: 1, color: "#2563eb" }}
						>
							{currentUserStats.sessions}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							times at the table
						</Typography>
					</Box>
				</StatsCard>

				{/* Biggest Session */}
				<StatsCard>
					<Box sx={{ textAlign: "center", py: 1 }}>
						<Typography variant="h2" sx={{ fontSize: 50 }}>
							🔥
						</Typography>
						<Typography
							variant="overline"
							color="text.secondary"
							sx={{ fontSize: "0.75rem", letterSpacing: 1 }}
						>
							{currentUserStats.highestSingleWinning > 0
								? "Biggest Win"
								: "Biggest Loss"}
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{ my: 1, color: "#ff6b35" }}
						>
							${biggestSession.toFixed(2)}
						</Typography>
					</Box>
				</StatsCard>

				{/* ROI Card */}
				<StatsCard>
					<Box sx={{ textAlign: "center", py: 1 }}>
						<Typography
							variant="overline"
							color="text.secondary"
							sx={{ fontSize: "0.75rem", letterSpacing: 1 }}
						>
							ROI
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{
								my: 1,
								color:
									currentUserStats.roi > 0
										? "#4caf50"
										: "#f44336",
							}}
						>
							{currentUserStats.roi.toFixed(1)}%
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Avg: ${currentUserStats.avgProfit.toFixed(2)} per
							session
						</Typography>
					</Box>
				</StatsCard>

				{/* Final Message */}
				<StatsCard>
					<Box
						sx={{
							textAlign: "center",
							py: 1,
							gridColumn: { xs: "1", md: "1 / -1" },
						}}
					>
						<Typography variant="h2" sx={{ fontSize: 50, mb: 1 }}>
							🏆
						</Typography>
						<Typography
							variant="h6"
							fontWeight="bold"
							sx={{ mb: 1 }}
						>
							{currentUserStats.roi > 0
								? "🎉 Congratulations, High Roller!"
								: "💪 There's Always Next Year!"}
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
							sx={{ mb: 1 }}
						>
							{currentUserStats.roi > 0
								? "You crushed it this year! You are officially too good for us. 😅"
								: "Thanks for being a great sport and keeping the games fun! 🚀"}
						</Typography>
						<Chip
							label="Welcome Back Anytime! 🎰"
							color="primary"
							size="small"
							sx={{ mt: 1 }}
						/>
					</Box>
				</StatsCard>
			</Box>
		</PageWithParticles>
	);
};
