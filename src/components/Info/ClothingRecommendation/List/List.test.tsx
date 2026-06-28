import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getTranslation } from "../../../../i18n";
import { ClothingRecommendationList } from ".";

describe("ClothingRecommendationList", () => {
  it("renders each recommended clothing item", () => {
    render(
      <ClothingRecommendationList
        items={["Light jacket", "Long-sleeve top", "Closed shoes"]}
        translation={getTranslation("en")}
      />,
    );

    expect(
      screen.getByRole("list", { name: "Recommended clothing" }),
    ).toBeVisible();
    expect(screen.getByText("Light jacket")).toBeVisible();
    expect(screen.getByText("Long-sleeve top")).toBeVisible();
    expect(screen.getByText("Closed shoes")).toBeVisible();
  });
});
