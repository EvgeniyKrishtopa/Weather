import React, { type ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FormElement } from ".";

const countries = [
  { name: "Ukraine", iso2: "UA" },
  { name: "United States", iso2: "US" },
];

const defaultProps: ComponentProps<typeof FormElement> = {
  city: {
    cities: ["Kyiv", "Lviv"],
    citiesLoading: false,
    city: null,
  },
  country: {
    countries,
    countriesLoading: false,
    countryIso: "UA",
    selectedCountry: countries[0],
  },
  gender: "woman",
  handlers: {
    onCityChange: vi.fn(),
    onCountryChange: vi.fn(),
    onGenderChange: vi.fn(),
    onSubmit: vi.fn((event) => event.preventDefault()),
  },
  status: {
    loading: false,
    locationError: "",
    showValidationError: false,
  },
};

const renderFormElement = (
  props: Partial<ComponentProps<typeof FormElement>> = {},
) => {
  const mergedProps: ComponentProps<typeof FormElement> = {
    ...defaultProps,
    ...props,
    city: {
      ...defaultProps.city,
      ...props.city,
    },
    country: {
      ...defaultProps.country,
      ...props.country,
    },
    gender: props.gender ?? defaultProps.gender,
    handlers: {
      ...defaultProps.handlers,
      ...props.handlers,
    },
    status: {
      ...defaultProps.status,
      ...props.status,
    },
  };

  render(<FormElement {...mergedProps} />);

  return mergedProps;
};

describe("FormElement", () => {
  it("renders country, city, and submit controls", () => {
    renderFormElement();

    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent(
      "Ukraine",
    );
    expect(screen.getByRole("combobox", { name: "City" })).toBeEnabled();
    expect(screen.getByRole("checkbox", { name: "Woman" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Man" })).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: "Get weather and outfit today" }),
    ).toBeEnabled();
  });

  it("calls the handler when changing the selected outfit gender", async () => {
    const user = userEvent.setup();
    const props = renderFormElement();

    await user.click(screen.getByRole("checkbox", { name: "Man" }));

    expect(props.handlers.onGenderChange).toHaveBeenCalledWith("man");
  });

  it("renders the stored selected outfit gender", () => {
    renderFormElement({ gender: "man" });

    expect(screen.getByRole("checkbox", { name: "Woman" })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Man" })).toBeChecked();
  });

  it("calls handlers for country, city, and submit interactions", async () => {
    const user = userEvent.setup();
    const props = renderFormElement();

    await user.click(screen.getByRole("combobox", { name: "Country" }));
    await user.click(screen.getByRole("option", { name: "United States" }));
    await user.type(screen.getByRole("combobox", { name: "City" }), "Kyiv");
    await user.click(await screen.findByRole("option", { name: "Kyiv" }));
    await user.click(
      screen.getByRole("button", { name: "Get weather and outfit today" }),
    );

    expect(props.handlers.onCountryChange).toHaveBeenCalled();
    expect(props.handlers.onCityChange).toHaveBeenCalledWith("Kyiv");
    expect(props.handlers.onSubmit).toHaveBeenCalled();
  });

  it("shows status messages and disables submit when location loading failed", () => {
    renderFormElement({
      status: {
        locationError: "Unable to load countries.",
        loading: false,
        showValidationError: true,
      },
    });

    expect(screen.getByText("Unable to load countries.")).toBeVisible();
    expect(screen.getByText("Choose a city.")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Get weather and outfit today" }),
    ).toBeDisabled();
  });
});
