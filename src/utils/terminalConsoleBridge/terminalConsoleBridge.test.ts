import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enableTerminalConsoleBridge } from ".";
import { CONSOLE_LEVEL_VALUES } from "../../constants";
import type { ConsoleLevel } from "../../types/console";
import { TERMINAL_CONSOLE_BRIDGE_URL } from "../../urls";

const originalConsoleMethods = Object.fromEntries(
  CONSOLE_LEVEL_VALUES.map((level) => [level, console[level]]),
) as Record<ConsoleLevel, typeof console.log>;

const bridgeWindow = window as Window & {
  __terminalConsoleBridgeEnabled?: boolean;
};

let consoleSpies: Record<ConsoleLevel, ReturnType<typeof vi.fn>>;

const installConsoleSpies = (): Record<
  ConsoleLevel,
  ReturnType<typeof vi.fn>
> => {
  const spies = {} as Record<ConsoleLevel, ReturnType<typeof vi.fn>>;

  for (const level of CONSOLE_LEVEL_VALUES) {
    spies[level] = vi
      .spyOn(console, level)
      .mockImplementation(() => undefined) as ReturnType<typeof vi.fn>;
  }

  return spies;
};

beforeEach(() => {
  bridgeWindow.__terminalConsoleBridgeEnabled = false;
  consoleSpies = installConsoleSpies();
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null)));
});

afterEach(() => {
  bridgeWindow.__terminalConsoleBridgeEnabled = false;
  vi.unstubAllGlobals();

  for (const level of CONSOLE_LEVEL_VALUES) {
    console[level] = originalConsoleMethods[level];
  }
});

describe("enableTerminalConsoleBridge", () => {
  it("sends browser console logs to the dev server bridge", () => {
    enableTerminalConsoleBridge();

    console.warn("Weather warning");

    expect(fetch).toHaveBeenCalledWith(
      TERMINAL_CONSOLE_BRIDGE_URL,
      expect.objectContaining({
        method: "POST",
        keepalive: true,
      }),
    );
    expect(consoleSpies.warn).toHaveBeenCalledWith("Weather warning");

    const request = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body)) as {
      level: string;
      message: string;
      url: string;
    };

    expect(body.level).toBe("warn");
    expect(body.message).toContain("Weather warning");
    expect(body.url).toBe("/");
  });

  it("serializes errors, arrays, bigints, undefined, and circular objects", () => {
    enableTerminalConsoleBridge();

    const circular: { name: string; self?: unknown } = { name: "loop" };
    circular.self = circular;

    console.error(new Error("boom"), [1, undefined], 10n, circular, null);

    const request = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(request.body)) as {
      message: string;
    };
    const message = JSON.parse(body.message) as unknown[];

    expect(message).toEqual([
      expect.objectContaining({
        name: "Error",
        message: "boom",
      }),
      [1, "undefined"],
      "10",
      {
        name: "loop",
        self: "[Circular]",
      },
      null,
    ]);
  });

  it("does not wrap console methods more than once", () => {
    enableTerminalConsoleBridge();
    enableTerminalConsoleBridge();

    console.info("ready");

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("ignores bridge request failures", () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    enableTerminalConsoleBridge();

    expect(() => console.debug("still logs")).not.toThrow();
    expect(consoleSpies.debug).toHaveBeenCalledWith("still logs");
  });
});
