import { describe, expect, it } from "vitest";
import { isOutfitRecommendation } from "./outfitRecommendation";

describe("outfit recommendation type guards", () => {
  it("recognizes a valid outfit recommendation", () => {
    expect(
      isOutfitRecommendation({
        title: "Rain-ready warm layers",
        items: ["Water-resistant coat", "Warm base layer"],
        description: "A short weather-aware outfit note.",
      }),
    ).toBe(true);
  });

  it.each([
    null,
    {},
    { title: "", items: ["Coat"], description: "Wear layers." },
    { title: "Layers", items: [], description: "Wear layers." },
    { title: "Layers", items: ["Coat", ""], description: "Wear layers." },
    { title: "Layers", items: ["Coat"], description: "" },
  ])("rejects malformed recommendations: %j", (value) => {
    expect(isOutfitRecommendation(value)).toBe(false);
  });
});
