import { useEffect } from "react";
import { fetchCountryIsoByCoordinates } from "../../api/geocodingApi";
import type { WeatherStore } from "../../store/weatherStore";
import { getCurrentCoordinates } from "../../utils/geolocation";

type DetectedCountryStore = Pick<
  WeatherStore,
  "applyDetectedCountryIso" | "canApplyDetectedCountryIso"
>;

export const useDetectedCountryRefinement = (
  store: DetectedCountryStore,
): void => {
  useEffect(() => {
    if (!store.canApplyDetectedCountryIso) {
      return;
    }

    const controller = new AbortController();

    const refineCountryFromGeolocation = async () => {
      const coordinates = await getCurrentCoordinates(controller.signal);

      if (!coordinates || controller.signal.aborted) {
        return;
      }

      const countryIso = await fetchCountryIsoByCoordinates(
        coordinates.latitude,
        coordinates.longitude,
        controller.signal,
      );

      if (countryIso && !controller.signal.aborted) {
        store.applyDetectedCountryIso(countryIso);
      }
    };

    void refineCountryFromGeolocation();

    return () => controller.abort();
  }, [store]);
};
