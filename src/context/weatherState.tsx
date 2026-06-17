import React, { useEffect, useState, type ReactNode } from "react";
import { fetchCountryIsoByCoordinates } from "../api/geocodingApi";
import { WeatherStore } from "../store/weatherStore";
import { WeatherContext } from "./weatherContext";
import { getCurrentCoordinates } from "../utils/geolocation";

interface WeatherStateProps {
  children: ReactNode;
}

const WeatherState = ({ children }: WeatherStateProps) => {
  const [store] = useState(() => new WeatherStore());

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

  return (
    <WeatherContext.Provider value={store}>{children}</WeatherContext.Provider>
  );
};

export default WeatherState;
