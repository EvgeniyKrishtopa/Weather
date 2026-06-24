import React from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import { Box } from "@mui/material";
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
}

export const ClothingRecommendationHeader = ({
  audience,
  Icon,
  title,
}: ClothingRecommendationHeaderProps) => (
  <StyledClothingRecommendationHeader>
    <ClothingRecommendationIcon aria-hidden="true">
      <Icon />
    </ClothingRecommendationIcon>
    <Box>
      <ClothingRecommendationEyebrow>
        For {audience}
      </ClothingRecommendationEyebrow>
      <ClothingRecommendationTitle>{title}</ClothingRecommendationTitle>
    </Box>
  </StyledClothingRecommendationHeader>
);
