type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug";

const consoleLevels: ConsoleLevel[] = ["log", "info", "warn", "error", "debug"];
const bridgeUrl = "/__terminal-console";

function serializeValue(value: unknown, seen: WeakSet<object>): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack,
    };
  }

  if (typeof value === "bigint") {
    return value.toString();
  }

  if (value === undefined) {
    return "undefined";
  }

  if (value === null || typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((entry) => serializeValue(entry, seen));
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [
      key,
      serializeValue(entry, seen),
    ]),
  );
}

function serializeArgs(args: unknown[]): string {
  const seen = new WeakSet<object>();

  return JSON.stringify(
    args.map((value) => serializeValue(value, seen)),
    null,
    2,
  );
}

async function sendToTerminal(level: ConsoleLevel, args: unknown[]) {
  try {
    await fetch(bridgeUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        level,
        message: serializeArgs(args),
        timestamp: new Date().toISOString(),
        url: window.location.pathname,
      }),
      keepalive: true,
    });
  } catch {
    // Ignore bridge failures so console logging still works in the browser.
  }
}

export function enableTerminalConsoleBridge() {
  if (!import.meta.env.DEV || typeof window === "undefined") {
    return;
  }

  const globalWindow = window as Window & {
    __terminalConsoleBridgeEnabled?: boolean;
  };

  if (globalWindow.__terminalConsoleBridgeEnabled) {
    return;
  }

  globalWindow.__terminalConsoleBridgeEnabled = true;

  for (const level of consoleLevels) {
    const originalMethod = console[level].bind(console);

    console[level] = (...args: unknown[]) => {
      originalMethod(...args);
      void sendToTerminal(level, args);
    };
  }
}
