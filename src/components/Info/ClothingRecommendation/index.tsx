import React from "react";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import ManRoundedIcon from "@mui/icons-material/ManRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { Box } from "@mui/material";
import type { GenderSelection } from "../../../types/location";
import {
  ClothingItem,
  ClothingItems,
  ClothingRecommendationDescription,
  ClothingRecommendationEyebrow,
  ClothingRecommendationHeader,
  ClothingRecommendationIcon,
  ClothingRecommendationSection,
  ClothingRecommendationTitle,
} from "../Weather.styles";

interface ClothingRecommendationProps {
  gender: GenderSelection;
}

const clothingRecommendations: Record<
  GenderSelection,
  {
    audience: string;
    title: string;
    items: string[];
    description: string;
    Icon: SvgIconComponent;
  }
> = {
  woman: {
    audience: "Woman",
    title: "Light layered outfit",
    items: [
      "Light jacket",
      "Long-sleeve top",
      "Comfortable trousers",
      "Closed shoes",
    ],
    description:
      "A breathable layered look keeps you comfortable if the temperature shifts, while closed shoes add enough coverage for mild wind.",
    Icon: CheckroomRoundedIcon,
  },
  man: {
    audience: "Man",
    title: "Smart casual layers",
    items: ["Light coat", "Cotton shirt", "Chinos", "Casual sneakers"],
    description:
      "Easy layers give enough warmth without feeling heavy, and casual sneakers keep the outfit practical for mild outdoor conditions.",
    Icon: ManRoundedIcon,
  },
};

export const ClothingRecommendation = ({
  gender,
}: ClothingRecommendationProps) => {
  const clothingRecommendation = clothingRecommendations[gender];
  const RecommendationIcon = clothingRecommendation.Icon;

  return (
    <ClothingRecommendationSection
      aria-label="Clothing recommendation"
      role="region"
    >
      <ClothingRecommendationHeader>
        <ClothingRecommendationIcon aria-hidden="true">
          <RecommendationIcon />
        </ClothingRecommendationIcon>
        <Box>
          <ClothingRecommendationEyebrow>
            For {clothingRecommendation.audience}
          </ClothingRecommendationEyebrow>
          <ClothingRecommendationTitle>
            {clothingRecommendation.title}
          </ClothingRecommendationTitle>
        </Box>
      </ClothingRecommendationHeader>
      <ClothingItems aria-label="Recommended clothing">
        {clothingRecommendation.items.map((item) => (
          <ClothingItem key={item}>{item}</ClothingItem>
        ))}
      </ClothingItems>
      <ClothingRecommendationDescription>
        {clothingRecommendation.description}
      </ClothingRecommendationDescription>
    </ClothingRecommendationSection>
  );
};
