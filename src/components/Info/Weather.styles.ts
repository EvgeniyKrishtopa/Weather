import { Box, Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { themeAlpha, themeColors } from "../../theme";

export const WeatherCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  color: themeColors.white,
  background: `linear-gradient(135deg, ${themeAlpha.weatherStart}, ${themeAlpha.weatherEnd})`,
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(2.5),
  },
}));

export const WeatherContent = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
}));

export const WeatherHeader = styled(Box)({});

export const WeatherEyebrow = styled(Typography)({
  fontSize: "0.7rem",
  opacity: 0.8,
});

export const ConditionSummary = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: theme.spacing(1.5),
}));

export const WeatherDescription = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.25),
  fontSize: "0.875rem",
  fontWeight: 600,
  opacity: 0.88,
}));

export const Temperature = styled("p")(({ theme }) => ({
  ...theme.typography.h3,
  margin: 0,
  fontWeight: 700,
  lineHeight: 1,
  letterSpacing: "-0.04em",
}));

export const TemperatureUnit = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(0.5),
  fontSize: "0.45em",
  fontWeight: 600,
  letterSpacing: 0,
  verticalAlign: "top",
}));

export const WeatherIconContainer = styled(Box)(({ theme }) => ({
  width: 56,
  height: 56,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  backgroundColor: themeAlpha.whiteSurface,
  "& .MuiSvgIcon-root": {
    fontSize: 36,
    [theme.breakpoints.up("sm")]: {
      fontSize: 42,
    },
  },
  [theme.breakpoints.up("sm")]: {
    width: 64,
    height: 64,
  },
}));

export const Metrics = styled("dl")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.spacing(1),
  margin: 0,
  color: themeColors.white,
}));

export const MetricRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  minWidth: 0,
  gap: theme.spacing(0.75),
  padding: theme.spacing(0.75),
  border: `1px solid ${themeAlpha.whiteDivider}`,
  borderRadius: theme.spacing(1.5),
  backgroundColor: themeAlpha.whiteSurface,
  [theme.breakpoints.up("sm")]: {
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
}));

export const MetricIcon = styled(Box)(({ theme }) => ({
  width: 30,
  height: 30,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: theme.spacing(1),
  color: themeColors.white,
  backgroundColor: themeAlpha.whiteSurface,
  "& .MuiSvgIcon-root": {
    fontSize: 17,
  },
  [theme.breakpoints.up("sm")]: {
    width: 34,
    height: 34,
  },
}));

export const MetricLabel = styled("dt")(({ theme }) => ({
  ...theme.typography.caption,
  color: "inherit",
  opacity: 0.8,
}));

export const MetricValue = styled("dd")(({ theme }) => ({
  ...theme.typography.body2,
  margin: 0,
  color: "inherit",
  fontWeight: 700,
  whiteSpace: "nowrap",
}));

export const ClothingRecommendationSection = styled("section")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
  border: `1px solid ${themeAlpha.whiteDivider}`,
  borderRadius: theme.spacing(1.5),
  backgroundColor: themeAlpha.whiteSurface,
}));

export const ClothingRecommendationHeader = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(0.75),
  minWidth: 0,
}));

export const ClothingRecommendationIcon = styled(Box)(({ theme }) => ({
  width: 30,
  height: 30,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: theme.spacing(1),
  color: themeColors.white,
  backgroundColor: themeAlpha.whiteSurface,
  "& .MuiSvgIcon-root": {
    fontSize: 17,
  },
}));

export const ClothingRecommendationEyebrow = styled(Typography)({
  fontSize: "0.7rem",
  opacity: 0.8,
});

export const ClothingRecommendationTitle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: "inherit",
  fontWeight: 700,
}));

export const ClothingRecommendationDescription = styled(Typography)(
  ({ theme }) => ({
    ...theme.typography.body2,
    color: "inherit",
    opacity: 0.9,
  }),
);

export const ClothingItems = styled("ul")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.spacing(0.75),
  padding: 0,
  width: "100%",
  margin: "0 0 15px",
  listStyle: "none",
}));

export const ClothingItem = styled("li")(({ theme }) => ({
  ...theme.typography.caption,
  minWidth: 0,
  width: "100%",
  padding: theme.spacing(0.5, 0.75),
  borderRadius: theme.spacing(1),
  color: "inherit",
  fontWeight: 700,
  textAlign: "left",
  overflowWrap: "anywhere",
  backgroundColor: themeAlpha.whiteSurface,
}));
