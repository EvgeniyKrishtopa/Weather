import React from "react";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import ManRoundedIcon from "@mui/icons-material/ManRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import type { GenderSelection } from "../../../types/location";
import type { OutfitRecommendation } from "../../../types/outfitRecommendation";
import {
  ClothingRecommendationLoading,
  ClothingRecommendationSection,
} from "../Weather.styles";
import { ClothingRecommendationDescription } from "./Description";
import { ClothingRecommendationHeader } from "./Header";
import { ClothingRecommendationList } from "./List";

interface ClothingRecommendationProps {
  fallbackRecommendation: OutfitRecommendation;
  gender: GenderSelection;
  loading?: boolean;
  recommendation: OutfitRecommendation | null;
}

const clothingRecommendationAudiences: Record<
  GenderSelection,
  {
    audience: string;
    Icon: SvgIconComponent;
  }
> = {
  woman: {
    audience: "Woman",
    Icon: CheckroomRoundedIcon,
  },
  man: {
    audience: "Man",
    Icon: ManRoundedIcon,
  },
};

export const ClothingRecommendation = ({
  fallbackRecommendation,
  gender,
  loading = false,
  recommendation,
}: ClothingRecommendationProps) => {
  const clothingRecommendationAudience =
    clothingRecommendationAudiences[gender];
  const visibleRecommendation = recommendation ?? fallbackRecommendation;

  return (
    <ClothingRecommendationSection
      aria-label="Clothing recommendation"
      role="region"
    >
      <ClothingRecommendationHeader
        audience={clothingRecommendationAudience.audience}
        Icon={clothingRecommendationAudience.Icon}
        title={
          loading
            ? "Preparing outfit recommendation"
            : visibleRecommendation.title
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
          <ClothingRecommendationList items={visibleRecommendation.items} />
          <ClothingRecommendationDescription
            description={visibleRecommendation.description}
          />
        </>
      )}
    </ClothingRecommendationSection>
  );
};
