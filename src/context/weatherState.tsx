import React, { useState, type ReactNode } from "react";
import { WeatherStore } from "../store/weatherStore";
import { WeatherContext } from "./weatherContext";

interface WeatherStateProps {
  children: ReactNode;
}

const WeatherState = ({ children }: WeatherStateProps) => {
  const [store] = useState(() => new WeatherStore());

  return (
    <WeatherContext.Provider value={store}>{children}</WeatherContext.Provider>
  );
};

export default WeatherState;
