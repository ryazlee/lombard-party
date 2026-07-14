import React, { useMemo, useState } from "react";
import { PlayerSummaryTable } from "../../components/PokerStats/PlayerSummaryTable";
import PerformanceChart from "../../components/PokerStats/PerformanceChart";
import StatsCard from "../../components/PokerStats/StatsCard";
import { PageWithParticles } from "../../components/common/Page";
import { QuerySpinner } from "../../components/common/QuerySpinner";
import { QueryError } from "../../components/common/QueryError";
import { useServices } from "../../context/ServicesContext";
import { usePokerStats } from "../../hooks/usePokerStats";
import type { YearFilter } from "../../types/poker/types";
import {
	Box,
	Typography,
	useTheme,
	useMediaQuery,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

export const PokerStatsPage: React.FC = () => {
	const { pokerService } = useServices();
	const [selectedYear, setSelectedYear] = useState<YearFilter>("all");

	const { data, isLoading, error } = usePokerStats();

	const sessions = useMemo(() => data?.sessions ?? [], [data?.sessions]);

	const yearOptions = useMemo(
		() =>
			["all" as const, ...pokerService.getAvailableYears(sessions)] as YearFilter[],
		[pokerService, sessions]
	);

	const filteredSessions = useMemo(
		() => pokerService.filterSessionsByYear(sessions, selectedYear),
		[pokerService, sessions, selectedYear]
	);

	const playerStats = useMemo(
		() => pokerService.getPlayerStats(filteredSessions),
		[pokerService, filteredSessions]
	);

	const renderContent = () => {
		if (filteredSessions.length === 0) {
			return (
				<Typography variant="body1" color="text.secondary">
					No poker sessions found for{" "}
					{selectedYear === "all" ? "all years" : selectedYear}, try a
					different year.
				</Typography>
			);
		}

		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 4,
				}}
			>
				<StatsCard>
					<PerformanceChart sessions={filteredSessions} />
				</StatsCard>

				<StatsCard>
					<PlayerSummaryTable playerStats={playerStats} />
				</StatsCard>
			</Box>
		);
	};

	if (isLoading) {
		return <QuerySpinner message="Loading poker stats..." />;
	}

	if (error) {
		return (
			<QueryError
				title="Poker Stats"
				message="Failed to load poker stats. Make sure the Google Sheet is publicly accessible and the API key is set."
				error={error}
			/>
		);
	}

	return (
		<PageWithParticles
			title="Poker Stats"
			rightAdornment={
				<PokerStatsYearSelector
					yearOptions={yearOptions}
					selectedYear={selectedYear}
					onYearChange={setSelectedYear}
				/>
			}
		>
			{renderContent()}
		</PageWithParticles>
	);
};

const PokerStatsYearSelector: React.FC<{
	yearOptions: YearFilter[];
	selectedYear: YearFilter;
	onYearChange: (year: YearFilter) => void;
}> = ({ yearOptions, selectedYear, onYearChange }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const years = yearOptions.filter((year): year is number => year !== "all");

	return (
		<FormControl
			sx={{
				minWidth: 150,
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
};
