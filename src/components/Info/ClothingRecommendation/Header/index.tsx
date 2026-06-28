import React from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import { Box } from "@mui/material";
import type { TranslationDictionary } from "../../../../i18n";
import {
  ClothingRecommendationEyebrow,
  ClothingRecommendationHeader as StyledClothingRecommendationHeader,
  ClothingRecommendationIcon,
  ClothingRecommendationTitle,
} from "../../Weather.styles";

interface ClothingRecommendationHeaderProps {
  audience: string;
  Icon: SvgIconComponent;
  title: string;
  translation: TranslationDictionary;
}

export const ClothingRecommendationHeader = ({
  audience,
  Icon,
  title,
  translation,
}: ClothingRecommendationHeaderProps) => (
  <StyledClothingRecommendationHeader>
    <ClothingRecommendationIcon aria-hidden="true">
      <Icon />
    </ClothingRecommendationIcon>
    <Box>
      <ClothingRecommendationEyebrow>
        {translation.recommendation.forAudience(audience)}
      </ClothingRecommendationEyebrow>
      <ClothingRecommendationTitle>{title}</ClothingRecommendationTitle>
    </Box>
  </StyledClothingRecommendationHeader>
);
