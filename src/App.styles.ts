import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { themeAlpha, themeColors } from "./theme";

export const Page = styled("main")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  background: `radial-gradient(circle at top left, ${themeAlpha.accentGlow}, ${themeColors.transparent} 38%), linear-gradient(145deg, ${themeColors.background.darkest} 0%, ${themeColors.background.dark} 48%, ${themeColors.background.light} 100%)`,
  [theme.breakpoints.up("sm")]: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
  },
}));

export const ContentStack = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
}));
