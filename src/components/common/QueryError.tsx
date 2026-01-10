import React from "react";
import { Alert, Typography } from "@mui/material";
import { PageWithParticles } from "./Page";

interface QueryErrorProps {
  title?: string;
  message?: string;
  error?: Error | unknown;
}

export const QueryError: React.FC<QueryErrorProps> = ({
  title = "Poker Stats",
  message,
  error,
}) => {
  const errorMessage =
    message ||
    (error instanceof Error ? error.message : "An unexpected error occurred");

  return (
    <PageWithParticles title={title} maxWidth="900px">
      <Alert severity="error">
        <Typography component="p" fontWeight="bold">
          Error
        </Typography>
        <Typography component="p">{errorMessage}</Typography>
      </Alert>
    </PageWithParticles>
  );
};
