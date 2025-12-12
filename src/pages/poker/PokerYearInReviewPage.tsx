import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { fetchPokerStats, getPlayerStats } from "../../services/pokerService";
import { PlayerStat } from "../../types/poker/types";
import { PageWithParticles } from "../../components/common/Page";
import StatsCard from "../../components/PokerStats/StatsCard";
import { convertNameToSnakeCase } from "../../components/PokerStats/utils";
import {
	Box,
	Typography,
	CircularProgress,
	useTheme,
	Chip,
	Button,
} from "@mui/material";
import html2canvas from "html2canvas";

export const PokerYearInReviewPage: React.FC = () => {
	const { name } = useParams<{ name: string }>();
	const theme = useTheme();
	const [loading, setLoading] = useState(true);
	const contentRef = useRef<HTMLDivElement>(null);

	const [currentUserStats, setCurrentUserStats] = useState<PlayerStat | null>(
		null
	);
	const [winRate, setWinRate] = useState<number>(0);

	const playerName = useMemo(() => {
		return currentUserStats ? currentUserStats.player.split(" ")[0] : "Player";
	}, [currentUserStats]);

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

					// Calculate win rate
					const userSessions = rawStats.sessions.filter(
						(session) => convertNameToSnakeCase(session.player) === name
					);
					const winningSessions = userSessions.filter(
						(session) => session.profit > 0
					);
					const winRatePercent = userSessions.length > 0
						? (winningSessions.length / userSessions.length) * 100
						: 0;
					setWinRate(winRatePercent);
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
			<PageWithParticles title="✨ Your 2025 Poker Wrapped ✨">
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
							🎰 Shuffling the cards... Loading your epic poker journey! 🃏
						</Typography>
					</Box>
				</Box>
			</PageWithParticles>
		);
	}

	if (!currentUserStats) {
		return (
			<PageWithParticles title="✨ Your 2025 Poker Wrapped ✨">
				<StatsCard>
					<Typography
						variant="h6"
						color="text.secondary"
						textAlign="center"
					>
						🤔 Hmm... No poker adventures found for {name}! Did you play in disguise? 🎭
					</Typography>
				</StatsCard>
			</PageWithParticles>
		);
	}

	const isWinner = currentUserStats.totalWinnings > 0;
	const totalAmount = Math.abs(currentUserStats.totalWinnings || 0);
	const biggestSession = Math.abs(currentUserStats.highestSingleWinning || 0);


	const handleDownload = async () => {
		if (!contentRef.current) return;

		try {
			// Wait for fonts to load
			await document.fonts.ready;

			// Capture the content as canvas
			const canvas = await html2canvas(contentRef.current, {
				scale: 2, // Higher quality
				backgroundColor: '#f3f4f6',
				allowTaint: true,
				useCORS: true,
			});

			// Convert to blob and download
			canvas.toBlob((blob) => {
				if (blob) {
					const url = URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.download = `${playerName}-poker-wrapped-2025.png`;
					link.href = url;
					link.click();
					URL.revokeObjectURL(url);
				}
			});
		} catch (error) {
			console.error('Error generating image:', error);
		}
	};

	return (
		<PageWithParticles>
			<Box ref={contentRef} sx={{ maxWidth: 800, mx: "auto", px: { xs: 2, sm: 3 }, py: 2 }}>
				{/* Header */}
				<Box sx={{ textAlign: "center", mb: 2 }}>
					<Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
						🎉 {playerName}'s 2025 Lombard Poker Recap! 🎊
					</Typography>
				</Box>

				{/* Main Grid */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "1fr 1fr",
						gap: { xs: 1.5, sm: 2 },
					}}
				>
					{/* Main Win/Loss - Takes full width */}
					<Box
						sx={{
							gridColumn: "1 / -1",
							bgcolor: isWinner ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 107, 53, 0.1)",
							borderRadius: 3,
							p: { xs: 2, sm: 2 },
							textAlign: "center",
							border: `2px solid ${isWinner ? "#4caf50" : "#ff6b35"}`,
						}}
					>
						<Typography
							variant="overline"
							color="text.secondary"
							sx={{ fontSize: "0.75rem", letterSpacing: 1.5, fontWeight: "bold" }}
						>
							✨ THIS YEAR YOU ✨
						</Typography>
						<Typography
							variant="h1"
							fontWeight="bold"
							sx={{
								fontSize: { xs: 40, sm: 50, md: 60 },
								my: 0.5,
								color: isWinner ? "#4caf50" : "#ff6b35",
							}}
						>
							{isWinner ? "WON" : "LOST"}
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{
								fontSize: { xs: 30, sm: 40, md: 50 },
								mb: 0.5,
								color: theme.palette.text.primary,
							}}
						>
							${totalAmount.toFixed(2)}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{isWinner ? "💰 Living the dream!" : "🎲 Fortune favors the brave!"}
						</Typography>
					</Box>

					{/* Sessions Played */}
					<Box
						sx={{
							bgcolor: "rgba(37, 99, 235, 0.1)",
							borderRadius: 3,
							p: 2,
							textAlign: "center",
							border: "2px solid #2563eb",
						}}
					>
						<Typography variant="h1" sx={{ fontSize: 36, mb: 0.5 }}>
							🎴
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{
								fontSize: { xs: 36, md: 48 },
								mb: 0.5,
								color: "#2563eb",
							}}
						>
							{currentUserStats.sessions}
						</Typography>
						<Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
							Games Played
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{currentUserStats.sessions >= 10 ? "🎖️ Poker regular!" : "🌟 Great start!"}
						</Typography>
					</Box>

					{/* ROI */}
					<Box
						sx={{
							bgcolor: currentUserStats.roi > 0 ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)",
							borderRadius: 3,
							p: 2,
							textAlign: "center",
							border: `2px solid ${currentUserStats.roi > 0 ? "#4caf50" : "#f44336"}`,
						}}
					>
						<Typography variant="h1" sx={{ fontSize: 36, mb: 0.5 }}>
							{currentUserStats.roi > 0 ? "📊" : "📉"}
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{
								fontSize: { xs: 36, md: 48 },
								mb: 0.5,
								color: currentUserStats.roi > 0 ? "#4caf50" : "#f44336",
							}}
						>
							{currentUserStats.roi > 0 ? "+" : ""}{currentUserStats.roi.toFixed(1)}%
						</Typography>
						<Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
							💹 Return on Fun
						</Typography>
						<Typography variant="caption" color="text.secondary">
							${currentUserStats.avgProfit.toFixed(2)} per game
						</Typography>
					</Box>

					{/* Biggest Session */}
					<Box
						sx={{
							bgcolor: "rgba(255, 107, 53, 0.1)",
							borderRadius: 3,
							p: 2,
							textAlign: "center",
							border: "2px solid #ff6b35",
						}}
					>
						<Typography variant="h1" sx={{ fontSize: 36, mb: 0.5 }}>
							{currentUserStats.highestSingleWinning > 0 ? "🔥" : "💥"}
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{
								fontSize: { xs: 32, md: 42 },
								mb: 0.5,
								color: "#ff6b35",
							}}
						>
							${biggestSession.toFixed(2)}
						</Typography>
						<Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
							{currentUserStats.highestSingleWinning > 0
								? "🎯 Most Epic Win"
								: "😅 Biggest Oopsie"}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{currentUserStats.highestSingleWinning > 0
								? "What a night! 🌙"
								: "We've all been there! 💪"}
						</Typography>
					</Box>

					{/* Win Rate */}
					<Box
						sx={{
							bgcolor: winRate >= 50 ? "rgba(138, 43, 226, 0.1)" : "rgba(255, 193, 7, 0.1)",
							borderRadius: 3,
							p: 2,
							textAlign: "center",
							border: `2px solid ${winRate >= 50 ? "#8a2be2" : "#ffc107"}`,
						}}
					>
						<Typography variant="h1" sx={{ fontSize: 36, mb: 0.5 }}>
							{winRate >= 50 ? "🎯" : "🎲"}
						</Typography>
						<Typography
							variant="h2"
							fontWeight="bold"
							sx={{
								fontSize: { xs: 36, md: 48 },
								mb: 0.5,
								color: winRate >= 50 ? "#8a2be2" : "#ffc107",
							}}
						>
							{winRate.toFixed(0)}%
						</Typography>
						<Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
							🏆 Win Rate
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{winRate >= 50 ? "Consistent winner! 🔥" : "Room to grow! 💪"}
						</Typography>
					</Box>
				</Box>

				{/* Footer */}
				<Box sx={{ textAlign: "center", mt: 2 }}>
					<Box sx={{ display: "flex", gap: 1, justifyContent: "center", flexWrap: "wrap", mb: 1 }}>
						<Chip
							label="🎰 Same Time Next Year?"
							color="primary"
							size="small"
							sx={{ whiteSpace: "nowrap" }}
						/>
					</Box>
				</Box>
			</Box>

			<Box sx={{ textAlign: "center", mt: 2, mb: 4 }}>
				<Chip
					label="📸 Download & Share Your Year"
					onClick={handleDownload}
					sx={{
						px: 2,
						py: 3,
						borderRadius: 2,
						fontWeight: "bold",
						fontSize: "1.1rem",
						background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
						color: "white",
						"&:hover": {
							background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
						},
					}}
				/>
			</Box>
		</PageWithParticles>
	);
};
