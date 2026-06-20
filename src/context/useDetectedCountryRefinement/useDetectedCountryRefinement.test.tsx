import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchCountryIsoByCoordinates } from "../../api/geocodingApi";
import { getCurrentCoordinates } from "../../utils/geolocation";
import { useDetectedCountryRefinement } from ".";

vi.mock("../../api/geocodingApi", () => ({
  fetchCountryIsoByCoordinates: vi.fn(),
}));

vi.mock("../../utils/geolocation", () => ({
  getCurrentCoordinates: vi.fn(),
}));

interface TestComponentProps {
  canApplyDetectedCountryIso?: boolean;
  onApply?: (countryIso: string) => boolean;
}

const TestComponent = ({
  canApplyDetectedCountryIso = true,
  onApply = vi.fn(),
}: TestComponentProps) => {
  useDetectedCountryRefinement({
    applyDetectedCountryIso: onApply,
    canApplyDetectedCountryIso,
  });

  return null;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentCoordinates).mockResolvedValue(null);
  vi.mocked(fetchCountryIsoByCoordinates).mockResolvedValue(null);
});

describe("useDetectedCountryRefinement", () => {
  it("applies reverse geocoded country from current coordinates", async () => {
    const applyDetectedCountryIso = vi.fn().mockReturnValue(true);
    vi.mocked(getCurrentCoordinates).mockResolvedValue({
      latitude: 50.45,
      longitude: 30.52,
    });
    vi.mocked(fetchCountryIsoByCoordinates).mockResolvedValue("UA");

    render(<TestComponent onApply={applyDetectedCountryIso} />);

    await waitFor(() =>
      expect(applyDetectedCountryIso).toHaveBeenCalledWith("UA"),
    );
    expect(fetchCountryIsoByCoordinates).toHaveBeenCalledWith(
      50.45,
      30.52,
      expect.any(AbortSignal),
    );
  });

  it("does not request geolocation when auto detection is locked", () => {
    render(<TestComponent canApplyDetectedCountryIso={false} />);

    expect(getCurrentCoordinates).not.toHaveBeenCalled();
    expect(fetchCountryIsoByCoordinates).not.toHaveBeenCalled();
  });

  it("ignores missing coordinates or reverse geocoding result", async () => {
    const applyDetectedCountryIso = vi.fn();
    vi.mocked(getCurrentCoordinates).mockResolvedValue(null);

    render(<TestComponent onApply={applyDetectedCountryIso} />);

    await waitFor(() => expect(getCurrentCoordinates).toHaveBeenCalled());
    expect(fetchCountryIsoByCoordinates).not.toHaveBeenCalled();
    expect(applyDetectedCountryIso).not.toHaveBeenCalled();
  });
});
