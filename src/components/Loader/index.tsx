import React from "react";
import { CircularProgress, Typography } from "@mui/material";
import type { TranslationDictionary } from "../../i18n";
import { LoaderCard, LoaderContent } from "./Loader.styles";

interface LoaderProps {
  translation: TranslationDictionary;
}

const Loader = ({ translation }: LoaderProps) => (
  <LoaderCard elevation={8}>
    <LoaderContent role="status">
      <CircularProgress aria-label={translation.loader.loadingWeatherAria} />
      <Typography color="text.secondary">
        {translation.loader.loadingWeather}
      </Typography>
    </LoaderContent>
  </LoaderCard>
);

export default Loader;
