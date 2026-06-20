import { afterEach, describe, expect, it, vi } from "vitest";
import { currentDate } from ".";

afterEach(() => {
  vi.useRealTimers();
});

describe("currentDate", () => {
  it("formats the current date for display", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 5));

    expect(currentDate()).toBe("June 05, 2026");
  });
});
