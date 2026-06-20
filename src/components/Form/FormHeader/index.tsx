import React from "react";
import { Chip, Typography } from "@mui/material";
import { currentDate } from "../../../helpers/currentDate";
import {
  FormDescription,
  FormHeader as FormHeaderContainer,
} from "../Form.styles";

export const FormHeader = () => (
  <FormHeaderContainer>
    <div>
      <Typography component="h1" variant="h4">
        Get your weather
      </Typography>
      <FormDescription color="text.secondary">
        Search current conditions by city and country.
      </FormDescription>
    </div>
    <Chip label={currentDate()} variant="outlined" color="primary" />
  </FormHeaderContainer>
);
