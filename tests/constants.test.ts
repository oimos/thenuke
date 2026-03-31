import { describe, it, expect } from "vitest";
import {
  DEFAULT_SETTINGS,
  STORAGE_KEY,
  PRESET_BLACKLISTS,
  PANIC_LEVELS,
} from "../src/shared/constants";

describe("DEFAULT_SETTINGS", () => {
  it("has an empty blacklist by default", () => {
    expect(DEFAULT_SETTINGS.blacklist).toEqual([]);
  });

  it("defaults to safeUrl camouflage mode", () => {
    expect(DEFAULT_SETTINGS.camouflageMode).toBe("safeUrl");
  });

  it("has a valid default safe URL", () => {
    expect(DEFAULT_SETTINGS.safeUrl).toMatch(/^https:\/\//);
  });

  it("defaults to 0 panic minutes", () => {
    expect(DEFAULT_SETTINGS.panicMinutes).toBe(0);
  });

  it("is enabled by default", () => {
    expect(DEFAULT_SETTINGS.enabled).toBe(true);
  });
});

describe("STORAGE_KEY", () => {
  it("is a non-empty string", () => {
    expect(STORAGE_KEY).toBeTruthy();
    expect(typeof STORAGE_KEY).toBe("string");
  });
});

describe("PRESET_BLACKLISTS", () => {
  it("contains Social Media category", () => {
    expect(PRESET_BLACKLISTS["Social Media"]).toBeDefined();
    expect(PRESET_BLACKLISTS["Social Media"].length).toBeGreaterThan(0);
  });

  it("contains Video category", () => {
    expect(PRESET_BLACKLISTS["Video"]).toBeDefined();
    expect(PRESET_BLACKLISTS["Video"].length).toBeGreaterThan(0);
  });

  it("contains News category", () => {
    expect(PRESET_BLACKLISTS["News"]).toBeDefined();
  });

  it("contains Gaming category", () => {
    expect(PRESET_BLACKLISTS["Gaming"]).toBeDefined();
  });

  it("all domains are valid hostname format (no protocol, no path)", () => {
    for (const [, domains] of Object.entries(PRESET_BLACKLISTS)) {
      for (const domain of domains) {
        expect(domain).not.toMatch(/^https?:\/\//);
        expect(domain).not.toContain("/");
        expect(domain).toContain(".");
      }
    }
  });
});

describe("PANIC_LEVELS", () => {
  it("has 5 levels", () => {
    expect(PANIC_LEVELS).toHaveLength(5);
  });

  it("starts at 0", () => {
    expect(PANIC_LEVELS[0].value).toBe(0);
  });

  it("values are in ascending order", () => {
    for (let i = 1; i < PANIC_LEVELS.length; i++) {
      expect(PANIC_LEVELS[i].value).toBeGreaterThan(
        PANIC_LEVELS[i - 1].value,
      );
    }
  });

  it("every level has a label", () => {
    for (const level of PANIC_LEVELS) {
      expect(level.label).toBeTruthy();
      expect(typeof level.label).toBe("string");
    }
  });
});
