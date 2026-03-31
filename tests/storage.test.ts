import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStorage: Record<string, unknown> = {};
const changeListeners: Array<
  (
    changes: Record<string, chrome.storage.StorageChange>,
    area: string,
  ) => void
> = [];

vi.stubGlobal("chrome", {
  storage: {
    sync: {
      get: vi.fn(async (key: string) => {
        return { [key]: mockStorage[key] };
      }),
      set: vi.fn(async (data: Record<string, unknown>) => {
        Object.assign(mockStorage, data);
      }),
    },
    onChanged: {
      addListener: vi.fn((fn: (typeof changeListeners)[0]) => {
        changeListeners.push(fn);
      }),
    },
  },
});

import {
  getSettings,
  saveSettings,
  getCachedSettings,
  initStorageListener,
} from "../src/shared/storage";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "../src/shared/constants";

describe("storage", () => {
  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
    changeListeners.length = 0;
    vi.clearAllMocks();
  });

  describe("getSettings", () => {
    it("returns settings that include all required fields", async () => {
      const settings = await getSettings();
      expect(settings).toHaveProperty("blacklist");
      expect(settings).toHaveProperty("camouflageMode");
      expect(settings).toHaveProperty("safeUrl");
      expect(settings).toHaveProperty("panicMinutes");
      expect(settings).toHaveProperty("enabled");
    });

    it("returns consistent settings on repeated calls (caching)", async () => {
      const first = await getSettings();
      const second = await getSettings();
      expect(first).toBe(second);
    });
  });

  describe("getCachedSettings", () => {
    it("returns DEFAULT_SETTINGS when cache is not yet populated", () => {
      const settings = getCachedSettings();
      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe("saveSettings", () => {
    it("calls chrome.storage.sync.set", async () => {
      await saveSettings({ blacklist: ["reddit.com"] });
      expect(chrome.storage.sync.set).toHaveBeenCalled();
    });

    it("merges with existing settings", async () => {
      await saveSettings({ panicMinutes: 30 });
      const lastCall = vi.mocked(chrome.storage.sync.set).mock.lastCall;
      expect(lastCall).toBeDefined();
      const savedData = lastCall![0] as Record<string, unknown>;
      const saved = savedData[STORAGE_KEY] as typeof DEFAULT_SETTINGS;
      expect(saved.panicMinutes).toBe(30);
      expect(saved.enabled).toBe(true);
    });
  });

  describe("initStorageListener", () => {
    it("registers a chrome.storage.onChanged listener", () => {
      initStorageListener();
      expect(chrome.storage.onChanged.addListener).toHaveBeenCalled();
    });

    it("calls onChange callback when settings change", () => {
      const onChange = vi.fn();
      initStorageListener(onChange);

      const listener = changeListeners[changeListeners.length - 1];
      listener(
        {
          [STORAGE_KEY]: {
            newValue: { blacklist: ["x.com"], enabled: false },
            oldValue: {},
          },
        },
        "sync",
      );

      expect(onChange).toHaveBeenCalledTimes(1);
      const received = onChange.mock.calls[0][0];
      expect(received.blacklist).toEqual(["x.com"]);
      expect(received.enabled).toBe(false);
    });

    it("ignores changes from non-sync areas", () => {
      const onChange = vi.fn();
      initStorageListener(onChange);

      const listener = changeListeners[changeListeners.length - 1];
      listener(
        {
          [STORAGE_KEY]: {
            newValue: { blacklist: ["x.com"] },
            oldValue: {},
          },
        },
        "local",
      );

      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
