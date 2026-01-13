import React, { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { PokerSession } from "../../types/poker/types";
import { stringToColor } from "./utils";

interface PerformanceChartProps {
	sessions: PokerSession[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ sessions }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [selectedPlayer, setSelectedPlayer] = React.useState<string | null>(null);

	const players = Array.from(new Set(sessions.map(s => s.player))).sort();
	const allDates = Array.from(new Set(sessions.map(s => s.date.getTime())))
		.sort((a, b) => a - b)
		.map(timestamp => new Date(timestamp));

	const dateLabels = allDates.map(date => date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	}));

	const colorsWithOpacity = players.map(player => {
		const isSelected = selectedPlayer === null || selectedPlayer === player;
		const baseColor = stringToColor(player);
		if (selectedPlayer === null || isSelected) return baseColor;

		const r = parseInt(baseColor.slice(1, 3), 16), g = parseInt(baseColor.slice(3, 5), 16), b = parseInt(baseColor.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, 0.1)`;
	});

	const strokeWidths = players.map(player => {
		const isSelected = selectedPlayer === null || selectedPlayer === player;
		if (selectedPlayer === null) return isMobile ? 1.5 : 2.5;
		return isSelected ? (isMobile ? 3 : 4) : 1;
	});

	const markerSizes = players.map(player => {
		const isSelected = selectedPlayer === null || selectedPlayer === player;
		if (selectedPlayer === null) return isMobile ? 3 : 4;
		return isSelected ? (isMobile ? 5 : 6) : 0;
	});

	const series = useMemo(() => {
		return players.map((player) => {
			const playerSessions = sessions
				.filter(s => s.player === player)
				.sort((a, b) => a.date.getTime() - b.date.getTime());

			let cumulative = 0;
			const data = playerSessions.map(session => {
				cumulative += session.profit;
				const dateIndex = allDates.findIndex(date => date.getTime() === session.date.getTime());
				return { x: dateIndex, y: cumulative, dayProfit: session.profit };
			});
			return { name: player, data: data };
		});
	}, [players, sessions, allDates]);

	const yRange = useMemo(() => {
		const allValues = series.flatMap(s => s.data.map(d => d.y));
		if (allValues.length === 0) {
			return 100;
		}

		// Find max absolute value and add $5 buffer for symmetric bounds around zero
		const maxAbsValue = Math.max(...allValues.map(v => Math.abs(v)));

		return maxAbsValue + 5;
	}, [series]);

	const options: ApexOptions = {
		chart: {
			type: "line",
			fontFamily: "inherit",
			toolbar: { show: false },
			zoom: { enabled: false },
			animations: {
				enabled: true,
				speed: 350,
				animateGradually: { enabled: true, delay: 20 },
				dynamicAnimation: { enabled: true, speed: 150 }
			},
			events: {
				legendClick: (ctx, index?: number) => {
					if (typeof index === 'number') {
						const clickedPlayer = players[index];
						setSelectedPlayer(prev => (prev === clickedPlayer ? null : clickedPlayer));
					}
				}
			}
		},
		colors: colorsWithOpacity,
		stroke: {
			curve: "monotoneCubic",
			width: strokeWidths,
			lineCap: "round"
		},
		states: {
			hover: { filter: { type: "none" } },
			active: { filter: { type: "none" } }
		},
		xaxis: {
			type: "category",
			categories: dateLabels,
			tooltip: { enabled: false },
			axisBorder: { show: false },
			labels: {
				style: { fontSize: isMobile ? "9px" : "11px", colors: "#999" },
				rotate: isMobile ? -45 : 0,
				hideOverlappingLabels: true
			},
			// CROSSHAIR GUIDE
			crosshairs: {
				show: true,
				width: 1,
				position: 'back',
				stroke: { color: '#ccc', width: 1, dashArray: 3 },
			}
		},
		yaxis: {
			min: -yRange,
			max: yRange,
			tickAmount: isMobile ? 4 : 6,
			labels: {
				formatter: (val) => `$${Math.round(val)}`,
				style: { colors: "#999", fontSize: isMobile ? "9px" : "11px" }
			}
		},
		annotations: {
			yaxis: [{
				y: 0,
				borderColor: "#bbb",
				borderWidth: 1,
				strokeDashArray: 4, // Dashed line for the zero-base
				opacity: 0.8
			}]
		},
		legend: {
			show: true,
			position: "bottom",
			fontSize: isMobile ? "11px" : "13px",
			itemMargin: { horizontal: isMobile ? 5 : 10, vertical: 5 },
			onItemHover: { highlightDataSeries: false },
			onItemClick: { toggleDataSeries: false },
		},
		tooltip: {
			enabled: true,
			shared: false,
			intersect: true,
			theme: "light",
			style: { fontSize: isMobile ? "10px" : "12px" },
			y: {
				formatter: (val, { seriesIndex, dataPointIndex, w }) => {
					const dayProfit = w.config.series[seriesIndex].data[dataPointIndex].dayProfit;
					const sign = dayProfit >= 0 ? "+" : "";
					return `${sign}$${dayProfit} (${val >= 0 ? "+" : ""}$${Math.round(val)} total)`;
				}
			}
		},
		markers: {
			size: markerSizes,
			strokeWidth: isMobile ? 1 : 2,
			strokeColors: "#fff",
		},
		grid: {
			borderColor: "#e8e8e8",
			strokeDashArray: 2, // Faint dashed crossgrid
			xaxis: { lines: { show: true } }, // Vertical lines
			yaxis: { lines: { show: true } }, // Horizontal lines
			padding: {
				left: isMobile ? 5 : 15,
				right: isMobile ? 5 : 15,
				bottom: isMobile ? 0 : 10
			}
		}
	};

	return (
		<Box sx={{ width: "100%", py: isMobile ? 1 : 2 }}>
			<Box sx={{ textAlign: "center", mb: isMobile ? 0.5 : 1 }}>
				<Typography variant="h6" fontWeight="bold" sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem" }}>
					📈 Performance
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: -0.5 }}>
					{`Over ${sessions.length} Sessions`}
				</Typography>
			</Box>

			<Chart
				key={`chart-${sessions.length}-${players.length}`}
				options={options}
				series={series}
				type="line"
				height={isMobile ? 320 : 500}
			/>
		</Box>
	);
};

export default PerformanceChart;