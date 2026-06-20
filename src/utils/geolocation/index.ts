import type { CurrentCoordinates } from "../../types/location";

const positionOptions: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 3000,
  maximumAge: 300000,
};

export const getCurrentCoordinates = (
  signal?: AbortSignal,
): Promise<CurrentCoordinates | null> =>
  new Promise((resolve) => {
    if (signal?.aborted || !globalThis.navigator?.geolocation) {
      resolve(null);
      return;
    }

    let settled = false;

    const finish = (coordinates: CurrentCoordinates | null) => {
      if (settled) {
        return;
      }

      settled = true;
      signal?.removeEventListener("abort", handleAbort);
      resolve(coordinates);
    };

    const handleAbort = () => finish(null);

    signal?.addEventListener("abort", handleAbort, { once: true });

    globalThis.navigator.geolocation.getCurrentPosition(
      (position) =>
        finish({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => finish(null),
      positionOptions,
    );
  });
