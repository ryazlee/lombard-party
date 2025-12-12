import React from "react";
import { Box, Typography } from "@mui/material";
import { PageWithParticles } from "../components/common/Page";

export const ChristmasCardPage: React.FC = () => {
	return (
		<PageWithParticles title="2025 Christmas Card">
			<Box>
				<Typography variant="body1" color="text.secondary">
					🎄 Under Construction 🎅, Please check again later!
				</Typography>
			</Box>
		</PageWithParticles>
	);
};
