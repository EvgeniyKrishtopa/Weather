import React from "react";
import { ClothingItem, ClothingItems } from "../../Weather.styles";

interface ClothingRecommendationListProps {
  items: string[];
}

export const ClothingRecommendationList = ({
  items,
}: ClothingRecommendationListProps) => (
  <ClothingItems aria-label="Recommended clothing">
    {items.map((item) => (
      <ClothingItem key={item}>{item}</ClothingItem>
    ))}
  </ClothingItems>
);
