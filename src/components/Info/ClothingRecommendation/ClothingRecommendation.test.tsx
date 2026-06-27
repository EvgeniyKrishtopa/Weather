import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GenderSelection } from "../../../types/location";
import { ClothingRecommendation } from ".";
import { fallbackClothingRecommendations } from "./fallbackRecommendations";

describe("ClothingRecommendation", () => {
  it("renders the fallback clothing recommendation for women", () => {
    render(
      <ClothingRecommendation
        fallbackRecommendation={
          fallbackClothingRecommendations[GenderSelection.Woman].current
        }
        outfitProfile={GenderSelection.Woman}
        recommendation={null}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Clothing recommendation" }),
    ).toBeVisible();
    expect(screen.getByText("Light layered outfit")).toBeVisible();
    expect(screen.getByText("For Woman")).toBeVisible();
    expect(screen.getByText(/breathable layered look/i)).toBeVisible();
    expect(screen.getByText(/Light jacket/)).toBeVisible();
    expect(screen.getByText(/Long-sleeve top/)).toBeVisible();
    expect(screen.getByText(/Comfortable trousers/)).toBeVisible();
    expect(screen.getByText(/Closed shoes/)).toBeVisible();
  });

  it("renders the fallback clothing recommendation for men", () => {
    render(
      <ClothingRecommendation
        fallbackRecommendation={
          fallbackClothingRecommendations[GenderSelection.Man].current
        }
        outfitProfile={GenderSelection.Man}
        recommendation={null}
      />,
    );

    expect(screen.getByText("Smart casual layers")).toBeVisible();
    expect(screen.getByText("For Man")).toBeVisible();
    expect(screen.getByText(/Easy layers/i)).toBeVisible();
    expect(screen.getByText(/Light coat/)).toBeVisible();
    expect(screen.getByText(/Cotton shirt/)).toBeVisible();
    expect(screen.getByText(/Chinos/)).toBeVisible();
    expect(screen.getByText(/Casual sneakers/)).toBeVisible();
  });

  it("renders a provider recommendation when one is available", () => {
    render(
      <ClothingRecommendation
        fallbackRecommendation={
          fallbackClothingRecommendations[GenderSelection.Woman].current
        }
        outfitProfile={GenderSelection.Woman}
        recommendation={{
          title: "Rain-ready warm layers",
          items: ["Water-resistant coat", "Warm base layer"],
          description: "Stay warm and dry with compact rain layers.",
        }}
      />,
    );

    expect(screen.getByText("Rain-ready warm layers")).toBeVisible();
    expect(screen.getByText("Water-resistant coat")).toBeVisible();
    expect(screen.getByText("Warm base layer")).toBeVisible();
    expect(
      screen.getByText("Stay warm and dry with compact rain layers."),
    ).toBeVisible();
    expect(screen.queryByText("Light jacket")).not.toBeInTheDocument();
  });

  it("renders a loading state for future recommendation requests", () => {
    render(
      <ClothingRecommendation
        fallbackRecommendation={
          fallbackClothingRecommendations[GenderSelection.Woman].current
        }
        outfitProfile={GenderSelection.Woman}
        loading
        recommendation={null}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();
    expect(
      screen.getByRole("progressbar", {
        name: "Loading clothing recommendation",
      }),
    ).toBeVisible();
    expect(
      screen.getByText("Choosing weather-aware outfit ideas..."),
    ).toBeVisible();
    expect(screen.queryByText("Light jacket")).not.toBeInTheDocument();
  });
});
