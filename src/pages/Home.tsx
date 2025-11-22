import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, ButtonProps } from "@mui/material";
import { PageWithParticles } from "../components/common/Page";

interface LinkButtonProps extends Omit<ButtonProps, "component"> {
	to: string;
	children: React.ReactNode;
}

const LinkButton: React.FC<LinkButtonProps> = ({
	to,
	children,
	sx,
	...props
}) => {
	return (
		<Button
			component={Link as any}
			to={to}
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
				...sx,
			}}
			{...props}
		>
			{children}
		</Button>
	);
};

const Home: React.FC = () => {
	return (
		<PageWithParticles
			centered
			showBackButton={false}
			contentSx={{ textAlign: "center" }}
		>
			<Typography
				variant="h3"
				fontWeight="bold"
				sx={{ mb: 2, color: "#1f2937" }}
			>
				Welcome to 548 Lombard
			</Typography>
			<Typography variant="subtitle1" sx={{ mb: 4, color: "#4b5563" }}>
				Apartment hub for all things fun
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: 2,
					flexWrap: "wrap",
					justifyContent: "center",
				}}
			>
				<LinkButton to="/poker-stats">Poker Stats</LinkButton>
				<LinkButton disabled to="/christmas-card">
					2025 Christmas Card
				</LinkButton>
			</Box>
		</PageWithParticles>
	);
};

export default Home;
