import type { WeatherResponse } from "../types/weather";

export interface WeatherStateValue {
  weather: WeatherResponse | null;
  city: string;
  loading: boolean;
}

export type WeatherAction =
  | { type: "requestStarted" }
  | { type: "requestCompleted"; payload: WeatherResponse; city: string };

const weatherReducer = (
  state: WeatherStateValue,
  action: WeatherAction,
): WeatherStateValue => {
  switch (action.type) {
    case "requestStarted":
      return { ...state, loading: true };
    case "requestCompleted":
      return {
        ...state,
        weather: action.payload,
        city: action.city,
        loading: false,
      };
    default:
      return state;
  }
};

export default weatherReducer;
