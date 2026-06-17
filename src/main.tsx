import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { appTheme, themeColors } from "./theme";
import { enableTerminalConsoleBridge } from "./utils/terminalConsoleBridge";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

document
  .querySelector('meta[name="theme-color"]')
  ?.setAttribute("content", themeColors.background.darkest);

enableTerminalConsoleBridge();

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
