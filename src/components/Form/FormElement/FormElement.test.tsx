import React, { type ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { getTranslation } from "../../../i18n";
import { GenderSelection } from "../../../types/location";
import { FormElement } from ".";

const countries = [
  { name: "Ukraine", iso2: "UA" },
  { name: "United States", iso2: "US" },
];

const defaultProps: ComponentProps<typeof FormElement> = {
  city: {
    cities: [
      { value: "Kyiv", label: "Kyiv" },
      { value: "Lviv", label: "Lviv" },
    ],
    city: null,
  },
  country: {
    countries,
    countryIso: "UA",
    selectedCountry: countries[0],
  },
  outfitProfile: GenderSelection.Woman,
  language: "en",
  handlers: {
    onCityChange: vi.fn(),
    onCountryChange: vi.fn(),
    onOutfitProfileChange: vi.fn(),
    onSubmit: vi.fn((event) => event.preventDefault()),
  },
  status: {
    loading: false,
    showValidationError: false,
  },
  translation: getTranslation("en"),
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
    outfitProfile: props.outfitProfile ?? defaultProps.outfitProfile,
    language: props.language ?? defaultProps.language,
    handlers: {
      ...defaultProps.handlers,
      ...props.handlers,
    },
    status: {
      ...defaultProps.status,
      ...props.status,
    },
    translation: props.translation ?? defaultProps.translation,
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

  it("calls the handler when changing the selected outfit profile", async () => {
    const user = userEvent.setup();
    const props = renderFormElement();

    await user.click(screen.getByRole("checkbox", { name: "Man" }));

    expect(props.handlers.onOutfitProfileChange).toHaveBeenCalledWith(
      GenderSelection.Man,
    );
  });

  it("renders the stored selected outfit profile", () => {
    renderFormElement({ outfitProfile: GenderSelection.Man });

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

  it("renders localized city labels and emits canonical city values", async () => {
    const user = userEvent.setup();
    const italy = { name: "Italy", iso2: "IT" };
    const props = renderFormElement({
      city: {
        cities: [{ value: "Rome", label: "Roma" }],
        city: null,
      },
      country: {
        countries: [italy],
        countryIso: "IT",
        selectedCountry: italy,
      },
      language: "it",
      translation: getTranslation("it"),
    });

    await user.type(screen.getByRole("combobox", { name: "Città" }), "Roma");
    await user.click(await screen.findByRole("option", { name: "Roma" }));

    expect(props.handlers.onCityChange).toHaveBeenCalledWith("Rome");
  });

  it("shows validation status messages", () => {
    renderFormElement({
      status: {
        loading: false,
        showValidationError: true,
      },
    });

    expect(screen.getByText("Choose a city.")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Get weather and outfit today" }),
    ).toBeEnabled();
  });
});
