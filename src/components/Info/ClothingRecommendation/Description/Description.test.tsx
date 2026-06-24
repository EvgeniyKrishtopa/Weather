import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClothingRecommendationDescription } from ".";

describe("ClothingRecommendationDescription", () => {
  it("renders the recommendation description", () => {
    render(
      <ClothingRecommendationDescription description="A breathable layered look keeps you comfortable." />,
    );

    expect(
      screen.getByText("A breathable layered look keeps you comfortable."),
    ).toBeVisible();
  });
});
