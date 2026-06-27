import { defineConfig } from "vitest/config";
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import { CONSOLE_LEVEL_VALUES, DEFAULT_CONSOLE_LEVEL } from "./src/constants";
import type { ConsoleLevel } from "./src/types/console";
import { APP_BASE_PATH, TERMINAL_CONSOLE_BRIDGE_URL } from "./src/urls";

const validConsoleLevels = new Set<ConsoleLevel>(CONSOLE_LEVEL_VALUES);

function terminalConsoleBridgePlugin(): Plugin {
  return {
    name: "terminal-console-bridge",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(
        TERMINAL_CONSOLE_BRIDGE_URL,
        (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          if (req.method !== "POST") {
            next();
            return;
          }

          let rawBody = "";

          req.setEncoding("utf8");

          req.on("data", (chunk: string) => {
            rawBody += chunk;
          });

          req.on("end", () => {
            try {
              const payload = JSON.parse(rawBody) as {
                level?: ConsoleLevel;
                message?: string;
                url?: string;
                timestamp?: string;
              };

              const level =
                payload.level && validConsoleLevels.has(payload.level)
                  ? payload.level
                  : DEFAULT_CONSOLE_LEVEL;
              const prefixParts = [
                "[browser]",
                payload.timestamp ?? new Date().toISOString(),
                payload.url,
              ].filter(Boolean);

              const logMethod = console[level] as (...args: unknown[]) => void;

              logMethod(prefixParts.join(" "), payload.message ?? "");
              res.statusCode = 204;
              res.end();
            } catch (error) {
              res.statusCode = 400;
              res.end(
                error instanceof Error
                  ? error.message
                  : "Invalid console payload",
              );
            }
          });

          req.on("error", (error: Error) => {
            res.statusCode = 500;
            res.end(
              error instanceof Error ? error.message : "Console bridge failed",
            );
          });
        },
      );
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: APP_BASE_PATH,
  plugins: [
    react(),
    terminalConsoleBridgePlugin(),
    ...(mode === "test" ? [] : [cloudflare()]),
  ],
  server: {
    open: APP_BASE_PATH,
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    server: {
      deps: {
        inline: [/@mui/, /react-transition-group/],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.styles.ts",
        "src/main.tsx",
        "src/theme.ts",
        "src/vite-env.d.ts",
        "src/test/**",
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
}));
