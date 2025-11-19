import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";

interface StatsCardProps {
	children: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ children }) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	return (
		<Box
			sx={{
				bgcolor: "white",
				borderRadius: 2,
				boxShadow: 3,
				border: `1px solid ${theme.palette.grey[300]}`,
				overflow: "hidden",
				p: isMobile ? 2 : 6,
			}}
		>
			{children}
		</Box>
	);
};

export default StatsCard;
