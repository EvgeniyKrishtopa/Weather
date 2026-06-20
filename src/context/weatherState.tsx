import React, { useState, type ReactNode } from "react";
import { WeatherStore } from "../store/weatherStore";
import { WeatherContext } from "./weatherContext";
import { useDetectedCountryRefinement } from "./useDetectedCountryRefinement";

interface WeatherStateProps {
  children: ReactNode;
}

const WeatherState = ({ children }: WeatherStateProps) => {
  const [store] = useState(() => new WeatherStore());

  useDetectedCountryRefinement(store);

  return (
    <WeatherContext.Provider value={store}>{children}</WeatherContext.Provider>
  );
};

export default WeatherState;
