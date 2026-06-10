import { Paper, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";

export const LoaderCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

export const LoaderContent = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(2),
}));
