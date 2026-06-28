import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { getTranslation } from "../../../i18n";
import { FormHeader } from ".";

vi.mock("../../../helpers/currentDate", () => ({
  currentDate: () => "June 19, 2026",
}));

describe("FormHeader", () => {
  it("renders the form title, description, and current date", () => {
    render(<FormHeader language="en" translation={getTranslation("en")} />);

    expect(
      screen.getByRole("heading", { name: "Weather Outfit Advisor" }),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Search current conditions and outfit ideas by city and country.",
      ),
    ).toBeVisible();
    expect(screen.getByText("June 19, 2026")).toBeVisible();
  });
});
