import React from "react";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import ManRoundedIcon from "@mui/icons-material/ManRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import type { TranslationDictionary } from "../../../i18n";
import { GenderSelection } from "../../../types/location";
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
  outfitProfile: GenderSelection;
  loading?: boolean;
  recommendation: OutfitRecommendation | null;
  translation: TranslationDictionary;
}

const clothingRecommendationAudiences: Record<
  GenderSelection,
  {
    audience: string;
    Icon: SvgIconComponent;
  }
> = {
  [GenderSelection.Woman]: {
    audience: "Woman",
    Icon: CheckroomRoundedIcon,
  },
  [GenderSelection.Man]: {
    audience: "Man",
    Icon: ManRoundedIcon,
  },
};

export const ClothingRecommendation = ({
  fallbackRecommendation,
  outfitProfile,
  loading = false,
  recommendation,
  translation,
}: ClothingRecommendationProps) => {
  const clothingRecommendationAudience =
    clothingRecommendationAudiences[outfitProfile];
  const visibleRecommendation = recommendation ?? fallbackRecommendation;

  return (
    <ClothingRecommendationSection
      aria-label={translation.recommendation.regionLabel}
      role="region"
    >
      <ClothingRecommendationHeader
        audience={
          translation.outfitProfiles[outfitProfile] ??
          clothingRecommendationAudience.audience
        }
        Icon={clothingRecommendationAudience.Icon}
        title={
          loading
            ? translation.recommendation.preparingTitle
            : visibleRecommendation.title
        }
        translation={translation}
      />
      {loading ? (
        <ClothingRecommendationLoading aria-live="polite">
          <CircularProgress
            aria-label={translation.recommendation.loadingAria}
            color="inherit"
            size={18}
          />
          <ClothingRecommendationDescription
            description={translation.recommendation.loadingDescription}
          />
        </ClothingRecommendationLoading>
      ) : (
        <>
          <ClothingRecommendationList
            items={visibleRecommendation.items}
            translation={translation}
          />
          <ClothingRecommendationDescription
            description={visibleRecommendation.description}
          />
        </>
      )}
    </ClothingRecommendationSection>
  );
};
