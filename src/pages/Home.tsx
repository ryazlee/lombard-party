import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Home: React.FC = () => {
	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "#f3f4f6",
				p: 4,
			}}
		>
			<Box textAlign="center">
				<Typography
					variant="h3"
					fontWeight="bold"
					sx={{ mb: 2, color: "#1f2937" }}
				>
					Welcome to 548 Lombard
				</Typography>
				<Typography
					variant="subtitle1"
					sx={{ mb: 4, color: "#4b5563" }}
				>
					Apartment hub for all things fun
				</Typography>
				<Box>
					<Button
						component={Link}
						to="/poker-stats"
						variant="contained"
						size="large"
						sx={{
							bgcolor: "#2563eb",
							":hover": { bgcolor: "#1d4ed8" },
							color: "white",
							px: 4,
							py: 2,
							borderRadius: 2,
							fontWeight: "bold",
						}}
					>
						Poker Stats
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default Home;
