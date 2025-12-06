import React, { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Box, Typography, useTheme, SxProps, Theme } from "@mui/material";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

// Generate a random seed once when the module loads (persists during navigation, resets on reload)
const particleSeed = Math.random();

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

	// Generate random particle configuration based on the seed
	const particleConfig = useMemo(() => {
		const random = (min: number, max: number) => {
			// Use seed to generate consistent random values during navigation
			const seededRandom = (particleSeed + min + max) % 1;
			return min + seededRandom * (max - min);
		};

		const particleCount = Math.floor(random(40, 150));
		const speed = random(0.5, 4);
		const colors = [
			["#ff6b35", "#f7931e", "#fdc830"], // orange
			["#667eea", "#764ba2", "#f093fb"], // purple
			["#4facfe", "#00f2fe", "#43e97b"], // blue-green
			["#fa709a", "#fee140", "#30cfd0"], // pink-teal
			["#ff6a00", "#ee0979", "#feca57"], // red-orange
			["#06beb6", "#48b1bf", "#06d6a0"], // teal
			["#f857a6", "#ff5858", "#ffd460"], // pink-yellow
			["#4158d0", "#c850c0", "#ffcc70"], // blue-purple-yellow
			["#0093e9", "#80d0c7", "#13547a"], // ocean
			["#d4fc79", "#96e6a1", "#74ebd5"], // green
		];
		const colorIndex = Math.floor(random(0, colors.length));
		const selectedColors = colors[colorIndex];
		const allShapes = ["circle", "triangle", "star", "square", "polygon"];
		
		// Randomly select 1-4 shapes
		const numShapes = Math.floor(random(1, 5));
		const selectedShapes: string[] = [];
		const shuffled = [...allShapes].sort(() => particleSeed - 0.5);
		for (let i = 0; i < numShapes; i++) {
			selectedShapes.push(shuffled[i]);
		}

		const moveDirection = ["none", "top", "bottom", "left", "right"][Math.floor(random(0, 5))];
		const outMode = ["bounce", "out", "destroy"][Math.floor(random(0, 3))];

		return {
			particleCount,
			speed,
			colors: selectedColors,
			shapes: selectedShapes,
			linkDistance: random(80, 250),
			linkOpacity: random(0.1, 0.6),
			linkWidth: random(0.5, 2.5),
			sizeMin: random(1, 4),
			sizeMax: random(4, 10),
			opacityMin: random(0.2, 0.5),
			opacityMax: random(0.5, 0.9),
			moveDirection: moveDirection as any,
			outMode: outMode as any,
			rotateSpeed: random(2, 10),
			attractRotateX: random(400, 800),
			attractRotateY: random(800, 1600),
		};
	}, []); // Empty dependency array - only compute once per app load

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
							value: particleConfig.colors,
						},
						links: {
							color: particleConfig.colors[0],
							distance: particleConfig.linkDistance,
							enable: true,
							opacity: particleConfig.linkOpacity,
							width: particleConfig.linkWidth,
						},
						move: {
							direction: particleConfig.moveDirection,
							enable: true,
							outModes: {
								default: particleConfig.outMode,
							},
							random: true,
							speed: particleConfig.speed,
							straight: false,
							attract: {
								enable: true,
								rotateX: particleConfig.attractRotateX,
								rotateY: particleConfig.attractRotateY,
							},
						},
						number: {
							density: {
								enable: true,
								area: 800,
							},
							value: particleConfig.particleCount,
						},
						opacity: {
							value: { min: particleConfig.opacityMin, max: particleConfig.opacityMax },
							animation: {
								enable: true,
								speed: 1,
								minimumValue: particleConfig.opacityMin,
								sync: false,
							},
						},
						shape: {
							type: particleConfig.shapes,
						},
						size: {
							value: { min: particleConfig.sizeMin, max: particleConfig.sizeMax },
							animation: {
								enable: true,
								speed: 3,
								minimumValue: particleConfig.sizeMin,
								sync: false,
							},
						},
						rotate: {
							value: 0,
							random: true,
							direction: "random",
							animation: {
								enable: true,
								speed: particleConfig.rotateSpeed,
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
