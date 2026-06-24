import React from "react";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import ManRoundedIcon from "@mui/icons-material/ManRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import type { GenderSelection } from "../../../types/location";
import {
  ClothingRecommendationLoading,
  ClothingRecommendationSection,
} from "../Weather.styles";
import { ClothingRecommendationDescription } from "./Description";
import { ClothingRecommendationHeader } from "./Header";
import { ClothingRecommendationList } from "./List";

interface ClothingRecommendationProps {
  gender: GenderSelection;
  loading?: boolean;
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
  loading = false,
}: ClothingRecommendationProps) => {
  const clothingRecommendation = clothingRecommendations[gender];

  return (
    <ClothingRecommendationSection
      aria-label="Clothing recommendation"
      role="region"
    >
      <ClothingRecommendationHeader
        audience={clothingRecommendation.audience}
        Icon={clothingRecommendation.Icon}
        title={
          loading
            ? "Preparing outfit recommendation"
            : clothingRecommendation.title
        }
      />
      {loading ? (
        <ClothingRecommendationLoading aria-live="polite">
          <CircularProgress
            aria-label="Loading clothing recommendation"
            color="inherit"
            size={18}
          />
          <ClothingRecommendationDescription description="Choosing weather-aware outfit ideas..." />
        </ClothingRecommendationLoading>
      ) : (
        <>
          <ClothingRecommendationList items={clothingRecommendation.items} />
          <ClothingRecommendationDescription
            description={clothingRecommendation.description}
          />
        </>
      )}
    </ClothingRecommendationSection>
  );
};
