import { afterEach, describe, expect, it, vi } from "vitest";
import { getCurrentCoordinates } from ".";

const originalGeolocation = Object.getOwnPropertyDescriptor(
  window.navigator,
  "geolocation",
);

const stubGeolocation = (
  getCurrentPosition: Geolocation["getCurrentPosition"],
) => {
  Object.defineProperty(window.navigator, "geolocation", {
    configurable: true,
    value: { getCurrentPosition },
  });
};

afterEach(() => {
  vi.restoreAllMocks();

  if (originalGeolocation) {
    Object.defineProperty(window.navigator, "geolocation", originalGeolocation);
  } else {
    Reflect.deleteProperty(window.navigator, "geolocation");
  }
});

describe("getCurrentCoordinates", () => {
  it("returns coordinates from browser geolocation", async () => {
    stubGeolocation(
      vi.fn((success) => {
        success({
          coords: {
            latitude: 50.45,
            longitude: 30.52,
          } as GeolocationCoordinates,
        } as GeolocationPosition);
      }),
    );

    await expect(getCurrentCoordinates()).resolves.toEqual({
      latitude: 50.45,
      longitude: 30.52,
    });
  });

  it("returns null when geolocation fails", async () => {
    stubGeolocation(
      vi.fn((_, error) => {
        error?.({ code: 1, message: "denied" } as GeolocationPositionError);
      }),
    );

    await expect(getCurrentCoordinates()).resolves.toBeNull();
  });

  it("returns null when aborted", async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(getCurrentCoordinates(controller.signal)).resolves.toBeNull();
  });
});
