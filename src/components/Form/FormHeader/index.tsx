import React from "react";
import { Chip, Typography } from "@mui/material";
import { currentDate } from "../../../helpers/currentDate";
import type { SupportedLanguage, TranslationDictionary } from "../../../i18n";
import {
  FormDescription,
  FormHeader as FormHeaderContainer,
} from "../Form.styles";

interface FormHeaderProps {
  language: SupportedLanguage;
  translation: TranslationDictionary;
}

export const FormHeader = ({ language, translation }: FormHeaderProps) => (
  <FormHeaderContainer>
    <div>
      <Typography component="h1" variant="h5">
        {translation.form.title}
      </Typography>
      <FormDescription color="text.secondary">
        {translation.form.description}
      </FormDescription>
    </div>
    <Chip label={currentDate(language)} variant="outlined" color="primary" />
  </FormHeaderContainer>
);
