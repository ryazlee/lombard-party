import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, useTheme, SxProps, Theme } from "@mui/material";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

export interface PageProps {
	title?: string;
	children: React.ReactNode;
	maxWidth?: string | number;
	showBackButton?: boolean;
	centered?: boolean;
	contentSx?: SxProps<Theme>;
}

/**
 * Base page wrapper component with consistent styling (no particles)
 */
export const Page: React.FC<PageProps> = ({
	title,
	children,
	maxWidth = "1200px",
	showBackButton = true,
	centered = false,
	contentSx = {},
}) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "#f3f4f6",
				p: 2,
				position: "relative",
				...(centered && {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}),
			}}
		>
			<Box
				sx={{
					width: "100%",
					maxWidth,
					mx: "auto",
					position: "relative",
					zIndex: 1,
					...contentSx,
				}}
			>
				{showBackButton && (
					<Box sx={{ mb: 2 }}>
						<Link
							to="/"
							style={{
								color: theme.palette.primary.main,
								textDecoration: "none",
							}}
						>
							← Back to Home
						</Link>
					</Box>
				)}

				{title && (
					<Typography
						variant="h4"
						fontWeight="bold"
						color="text.primary"
						sx={{ mb: 3 }}
					>
						{title}
					</Typography>
				)}

				{children}
			</Box>
		</Box>
	);
};

/**
 * Page wrapper component with animated particle background
 */
export const PageWithParticles: React.FC<PageProps> = ({
	title,
	children,
	maxWidth = "1200px",
	showBackButton = true,
	centered = false,
	contentSx = {},
}) => {
	const theme = useTheme();

	const particlesInit = useCallback(async (engine: Engine) => {
		await loadSlim(engine);
	}, []);

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "#f3f4f6",
				p: 2,
				position: "relative",
				...(centered && {
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}),
			}}
		>
			<Particles
				id="tsparticles"
				init={particlesInit}
				options={{
					background: {
						color: {
							value: "transparent",
						},
					},
					fpsLimit: 120,
					interactivity: {
						events: {
							onClick: {
								enable: true,
								mode: "push",
							},
							onHover: {
								enable: true,
								mode: ["grab", "bubble"],
							},
							resize: true,
						},
						modes: {
							push: {
								quantity: 4,
							},
							grab: {
								distance: 140,
								links: {
									opacity: 0.7,
									color: "#ff6b35",
								},
							},
							bubble: {
								distance: 200,
								size: 8,
								duration: 2,
								opacity: 0.8,
							},
						},
					},
					particles: {
						color: {
							value: ["#ff6b35", "#f7931e", "#fdc830"],
						},
						links: {
							color: "#ff8c42",
							distance: 150,
							enable: true,
							opacity: 0.4,
							width: 1.5,
						},
						move: {
							direction: "none",
							enable: true,
							outModes: {
								default: "bounce",
							},
							random: true,
							speed: 2,
							straight: false,
							attract: {
								enable: true,
								rotateX: 600,
								rotateY: 1200,
							},
						},
						number: {
							density: {
								enable: true,
								area: 800,
							},
							value: 100,
						},
						opacity: {
							value: { min: 0.3, max: 0.7 },
							animation: {
								enable: true,
								speed: 1,
								minimumValue: 0.3,
								sync: false,
							},
						},
						shape: {
							type: ["circle", "triangle", "star"],
						},
						size: {
							value: { min: 2, max: 6 },
							animation: {
								enable: true,
								speed: 3,
								minimumValue: 2,
								sync: false,
							},
						},
						rotate: {
							value: 0,
							random: true,
							direction: "random",
							animation: {
								enable: true,
								speed: 5,
								sync: false,
							},
						},
					},
					detectRetina: true,
				}}
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					zIndex: 0,
				}}
			/>
			<Box
				sx={{
					width: "100%",
					maxWidth,
					mx: "auto",
					position: "relative",
					zIndex: 1,
					...contentSx,
				}}
			>
				{showBackButton && (
					<Box sx={{ mb: 2 }}>
						<Link
							to="/"
							style={{
								color: theme.palette.primary.main,
								textDecoration: "none",
							}}
						>
							← Back to Home
						</Link>
					</Box>
				)}

				{title && (
					<Typography
						variant="h4"
						fontWeight="bold"
						color="text.primary"
						sx={{ mb: 3 }}
					>
						{title}
					</Typography>
				)}

				{children}
			</Box>
		</Box>
	);
};
