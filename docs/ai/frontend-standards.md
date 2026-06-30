# Frontend Standards

## Components

- Use functional React components and hooks.
- Wrap components that read observable store values with `observer`.
- Keep presentational components prop-driven and free of shared request,
  storage, or persistence logic.
- Put component orchestration hooks beside the component domain they serve.
- Group larger prop surfaces into meaningful domain objects such as `city`,
  `country`, `outfitProfile`, `status`, and `handlers`.
- Prefer user-visible loading, empty, fallback, success, and error states.

## Material UI And Styling

- Use Material UI components and shared theme tokens before standalone CSS or
  hard-coded design values.
- Keep component-specific styled elements in adjacent `*.styles.ts` files.
- Preserve stable layout dimensions for interactive controls and loading
  states.
- Use accessible roles, names, labels, disabled states, and visible error text.

## Form Behavior

- Selecting the same country, city, or outfit profile should be a no-op.
- Valid city selections request weather automatically.
- Do not render a weather submit button; valid city selection owns the weather
  request trigger.
- Blurring a selected city or changing outfit profile may request missing
  weather when no weather is currently shown.
- Weather request loaders should remain visible for at least 2 seconds, and
  provider recommendation loaders should remain visible for at least 1 second.
- Manual city text edits should clear stale weather when they diverge from the
  selected city.
- City validation should appear as helper text on the city field after user
  interaction.
- Local validation visibility belongs in the form component.
- Country/city option derivation and retained-city reconciliation belong in
  `src/components/Form/useLocationOptions`.

## Browser Utilities

- Preserve development-only terminal console bridge behavior when touching
  `src/utils/terminalConsoleBridge`, `src/types/console.ts`,
  `src/constants.ts`, `src/urls.ts`, or `vite.config.ts`.
- Console bridge failures must not break normal browser logging.
