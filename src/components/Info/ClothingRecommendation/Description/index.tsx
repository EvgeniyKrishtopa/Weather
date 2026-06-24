import React from "react";
import { ClothingRecommendationDescription as StyledClothingRecommendationDescription } from "../../Weather.styles";

interface ClothingRecommendationDescriptionProps {
  description: string;
}

export const ClothingRecommendationDescription = ({
  description,
}: ClothingRecommendationDescriptionProps) => (
  <StyledClothingRecommendationDescription>
    {description}
  </StyledClothingRecommendationDescription>
);
