import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";

interface PageProps {
	title: string;
	children: React.ReactNode;
	maxWidth?: string | number;
	showBackButton?: boolean;
}

/**
 * Reusable page wrapper component with consistent styling
 */
export const Page: React.FC<PageProps> = ({
	title,
	children,
	maxWidth = "1200px",
	showBackButton = true,
}) => {
	const theme = useTheme();

	return (
		<Box
			sx={{
				minHeight: "100vh",
				bgcolor: "#f3f4f6",
				p: 2,
			}}
		>
			<Box
				sx={{
					width: "100%",
					maxWidth,
					mx: "auto",
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

				<Typography
					variant="h4"
					fontWeight="bold"
					color="text.primary"
					sx={{ mb: 3 }}
				>
					{title}
				</Typography>

				{children}
			</Box>
		</Box>
	);
};
