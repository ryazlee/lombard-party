import React from "react";
import { Box, Typography } from "@mui/material";
import { PageWithParticles } from "../components/common/Page";

const ChristmasCard: React.FC = () => {
	return (
		<PageWithParticles title="Wifi QR Code">
			<Box
				sx={{
					textAlign: "center",
					maxWidth: 600,
					mx: "auto",
					mt: 4,
				}}
			>
				<Typography
					variant="h5"
					color="text.secondary"
					sx={{ mb: 4, fontWeight: 500 }}
				>
					Scan the QR code below to connect
				</Typography>

				<Box
					sx={{
						bgcolor: "white",
						borderRadius: 4,
						p: 4,
						boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
						mb: 3,
					}}
				>
					<img
						src={`${process.env.PUBLIC_URL}/media/wifi-qr-code.png`}
						alt="Wifi QR Code"
						style={{
							width: "100%",
							maxWidth: 300,
							height: "auto",
							display: "block",
							margin: "0 auto",
						}}
					/>
				</Box>

				<Box
					sx={{
						bgcolor: "white",
						borderRadius: 3,
						p: 3,
						boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
					}}
				>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 1 }}
					>
						Network Details
					</Typography>
					<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
						📶 NutBusters
					</Typography>
					<Typography
						variant="body1"
						color="text.secondary"
						sx={{ fontFamily: "monospace" }}
					>
						🔑 GoBears99!
					</Typography>
				</Box>
			</Box>
		</PageWithParticles>
	);
};

export default ChristmasCard;
