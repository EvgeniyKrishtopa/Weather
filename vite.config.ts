import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug";
const validConsoleLevels = new Set<ConsoleLevel>([
  "log",
  "info",
  "warn",
  "error",
  "debug",
]);

function terminalConsoleBridgePlugin(): Plugin {
  return {
    name: "terminal-console-bridge",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(
        "/__terminal-console",
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
                  : "log";
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

export default defineConfig({
  base: "/Weather/",
  plugins: [react()],
  server: {
    open: "/Weather/",
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
});
