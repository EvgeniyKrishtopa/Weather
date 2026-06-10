import { GET_WEATHER, SET_LOADING } from "./types";
import type { WeatherResponse } from "../types/weather";

export interface WeatherStateValue {
  weather: WeatherResponse | null;
  loading: boolean;
}

type WeatherAction =
  | { type: typeof GET_WEATHER; payload: WeatherResponse }
  | { type: typeof SET_LOADING };

const weatherReducer = (
  state: WeatherStateValue,
  action: WeatherAction
): WeatherStateValue => {
  switch (action.type) {
    case GET_WEATHER:
      return {
        ...state,
        weather: action.payload,
        loading: false,
      };
    case SET_LOADING:
      return { ...state, loading: true };
    default:
      return state;
  }
};

export default weatherReducer;
