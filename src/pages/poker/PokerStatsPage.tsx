import React, { useEffect, useMemo, useState } from "react";
import { fetchPokerStats, getPlayerStats } from "../../services/pokerService";
import { PlayerSummaryTable } from "../../components/PokerStats/PlayerSummaryTable";
import PerformanceChart from "../../components/PokerStats/PerformanceChart";
import StatsCard from "../../components/PokerStats/StatsCard";
import { PageWithParticles } from "../../components/common/Page";
import { PlayerSummary, PokerSession } from "../../types/poker/types";
import {
	Box,
	Typography,
	CircularProgress,
	Alert,
	useTheme,
	useMediaQuery,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

export const PokerStatsPage: React.FC = () => {
	const [selectedYear, setSelectedYear] = useState<number | "all">("all");
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

	const yearOptions = useMemo(() => {
		const yearsSet = new Set<number>();
		sessions.forEach((s) => {
			yearsSet.add(s.date.getFullYear());
		});
		return ["all" as const, ...Array.from(yearsSet).sort((a, b) => b - a)] as (number | "all")[];
	}, [sessions]);

	const filteredSessions = useMemo(() => {
		if (selectedYear === "all") {
			return sessions;
		}
		return sessions.filter((s) => s.date.getFullYear() === selectedYear);
	}, [sessions, selectedYear]);

	const playerStats = useMemo(() => {
		return getPlayerStats(filteredSessions, playerSummaries);
	}, [filteredSessions, playerSummaries]);

	const renderContent = () => {
		if (filteredSessions.length === 0) {
			return (
				<Typography variant="body1" color="text.secondary">
					No poker sessions found for {selectedYear === "all" ? "all years" : selectedYear}, try a different year.
				</Typography>
			);
		} else {
			return (
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						gap: 4,
					}}
				>
					{/* Performance Chart */}
					<StatsCard>
						<PerformanceChart sessions={filteredSessions} />
					</StatsCard>

					{/* Player Summary */}
					<StatsCard>
						<PlayerSummaryTable playerStats={playerStats} />
					</StatsCard>
				</Box>)
		}
	}

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
		<PageWithParticles title="Poker Stats" rightAdornment={
			<PokerStatsYearSelector
				yearOptions={yearOptions}
				selectedYear={selectedYear}
				onYearChange={setSelectedYear}
			/>
		}>
			{renderContent()}
		</PageWithParticles>
	);
};

const PokerStatsYearSelector: React.FC<{
	yearOptions: (number | "all")[];
	selectedYear: number | "all";
	onYearChange: (year: number | "all") => void;
}> = ({ yearOptions, selectedYear, onYearChange }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	// Filter out "all" from yearOptions since it has its own MenuItem
	const years = yearOptions.filter((year): year is number => year !== "all");

	return (
		<FormControl
			sx={{
				minWidth: isMobile ? 200 : 250,
				bgcolor: "white",
				borderRadius: 1,
			}}
			size={isMobile ? "small" : "medium"}
		>
			<InputLabel id="year-selector-label">Filter by Year</InputLabel>
			<Select
				labelId="year-selector-label"
				id="year-selector"
				value={selectedYear}
				label="Filter by Year"
				onChange={(e) => {
					const value = e.target.value;
					onYearChange(value === "all" ? "all" : Number(value));
				}}
			>
				<MenuItem value="all">All Years</MenuItem>
				{years.map((year) => (
					<MenuItem key={year} value={year}>
						{year}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
