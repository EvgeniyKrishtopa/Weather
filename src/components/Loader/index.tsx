import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import { LoaderCard, LoaderContent } from "./Loader.styles";

const Loader = () => (
  <LoaderCard elevation={8}>
    <LoaderContent role="status">
      <CircularProgress aria-label="Loading weather" />
      <Typography color="text.secondary">Loading weather...</Typography>
    </LoaderContent>
  </LoaderCard>
);

export default Loader;
