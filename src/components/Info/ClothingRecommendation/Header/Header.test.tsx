import React from "react";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClothingRecommendationHeader } from ".";

describe("ClothingRecommendationHeader", () => {
  it("renders the recommendation audience, title, and icon", () => {
    render(
      <ClothingRecommendationHeader
        audience="Woman"
        Icon={CheckroomRoundedIcon}
        title="Light layered outfit"
      />,
    );

    expect(screen.getByText("For Woman")).toBeVisible();
    expect(screen.getByText("Light layered outfit")).toBeVisible();
    expect(screen.getByTestId("CheckroomRoundedIcon")).toBeVisible();
  });
});
