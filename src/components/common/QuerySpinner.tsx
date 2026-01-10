import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface QuerySpinnerProps {
	message?: string;
	size?: number;
}

export const QuerySpinner: React.FC<QuerySpinnerProps> = ({
	message = "Loading...",
	size = 24,
}) => {
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
				<CircularProgress size={size} />
				<Typography variant="h6" color="text.secondary">
					{message}
				</Typography>
			</Box>
		</Box>
	);
};
