export interface WeatherSuccess {
  cod: 200;
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface WeatherError {
  cod: number | string;
  message: string;
}

export type WeatherResponse = WeatherSuccess | WeatherError;

export const isWeatherSuccess = (
  weather: WeatherResponse,
): weather is WeatherSuccess => weather.cod === 200;

export const isWeatherResponse = (value: unknown): value is WeatherResponse => {
  if (!value || typeof value !== "object" || !("cod" in value)) {
    return false;
  }

  const response = value as Record<string, unknown>;

  if (response.cod === 200) {
    const main = response.main as Record<string, unknown> | undefined;
    const wind = response.wind as Record<string, unknown> | undefined;
    const weather = response.weather;

    return (
      typeof response.name === "string" &&
      !!main &&
      typeof main.temp === "number" &&
      typeof main.humidity === "number" &&
      Array.isArray(weather) &&
      weather.length > 0 &&
      weather.every(
        (condition) =>
          !!condition &&
          typeof condition === "object" &&
          "main" in condition &&
          typeof condition.main === "string",
      ) &&
      !!wind &&
      typeof wind.speed === "number"
    );
  }

  return typeof response.message === "string";
};
