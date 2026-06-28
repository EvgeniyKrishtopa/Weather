import React from "react";
import type { TranslationDictionary } from "../../../../i18n";
import { ClothingItem, ClothingItems } from "../../Weather.styles";

interface ClothingRecommendationListProps {
  items: string[];
  translation: TranslationDictionary;
}

export const ClothingRecommendationList = ({
  items,
  translation,
}: ClothingRecommendationListProps) => (
  <ClothingItems
    aria-label={translation.recommendation.recommendedClothingLabel}
  >
    {items.map((item) => (
      <ClothingItem key={item}>{item}</ClothingItem>
    ))}
  </ClothingItems>
);
