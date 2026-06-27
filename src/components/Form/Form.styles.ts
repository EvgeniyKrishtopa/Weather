import { Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { themeAlpha } from "../../theme";

export const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${themeAlpha.paperBorder}`,
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(2.5),
  },
}));

export const FormContent = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
}));

export const FormHeader = styled(Stack)(({ theme }) => ({
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: theme.spacing(1),
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    alignItems: "center",
  },
}));

export const FormDescription = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(0.25),
}));

export const FormFields = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(1.5),
}));

export const OutfitProfileOptions = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(0.25),
}));

export const FormElement = styled("form")({});
