import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { themeAlpha, themeColors } from "../../theme";

export const WeatherCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  color: themeColors.white,
  background: `linear-gradient(135deg, ${themeAlpha.weatherStart}, ${themeAlpha.weatherEnd})`,
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export const WeatherContent = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
}));

export const WeatherHeader = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

export const WeatherEyebrow = styled(Typography)({
  opacity: 0.8,
});

export const WeatherDescription = styled(Typography)({
  opacity: 0.88,
});

export const WeatherIconContainer = styled(Box)(({ theme }) => ({
  "& .MuiSvgIcon-root": {
    fontSize: 64,
    [theme.breakpoints.up("sm")]: {
      fontSize: 80,
    },
  },
}));

export const Temperature = styled("p")(({ theme }) => ({
  ...theme.typography.h2,
  margin: 0,
  fontWeight: 700,
  letterSpacing: "-0.04em",
}));

export const WeatherDivider = styled(Divider)({
  borderColor: themeAlpha.whiteDivider,
});

export const Metrics = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  justifyContent: "space-between",
  gap: theme.spacing(3),
  color: themeColors.white,
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
  },
}));

export const MetricRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1.5),
}));

export const MetricIcon = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  display: "grid",
  placeItems: "center",
  borderRadius: theme.spacing(1),
  color: themeColors.white,
  backgroundColor: themeAlpha.whiteSurface,
}));

export const MetricLabel = styled(Typography)({
  color: "inherit",
  opacity: 0.8,
});

export const MetricValue = styled(Typography)({
  color: "inherit",
  fontWeight: 700,
});
