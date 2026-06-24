import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ClothingRecommendation } from ".";

describe("ClothingRecommendation", () => {
  it("renders the mock clothing recommendation for women", () => {
    render(<ClothingRecommendation gender="woman" />);

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

  it("renders the mock clothing recommendation for men", () => {
    render(<ClothingRecommendation gender="man" />);

    expect(screen.getByText("Smart casual layers")).toBeVisible();
    expect(screen.getByText("For Man")).toBeVisible();
    expect(screen.getByText(/Easy layers/i)).toBeVisible();
    expect(screen.getByText(/Light coat/)).toBeVisible();
    expect(screen.getByText(/Cotton shirt/)).toBeVisible();
    expect(screen.getByText(/Chinos/)).toBeVisible();
    expect(screen.getByText(/Casual sneakers/)).toBeVisible();
  });
});
