import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorWeather } from ".";

describe("ErrorWeather", () => {
  it("renders weather error message", () => {
    render(
      <ErrorWeather currentWeather={{ cod: 404, message: "Not found" }} />,
    );

    expect(screen.getByRole("alert")).toBeVisible();
    expect(screen.getByText("Weather unavailable")).toBeVisible();
    expect(screen.getByText("Not found")).toBeVisible();
  });
});
