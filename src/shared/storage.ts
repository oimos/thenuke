import type { NukeSettings } from "./types";
import { DEFAULT_SETTINGS, STORAGE_KEY } from "./constants";

let cachedSettings: NukeSettings | null = null;

export async function getSettings(): Promise<NukeSettings> {
  if (cachedSettings) return cachedSettings;

  const result = await chrome.storage.sync.get(STORAGE_KEY);
  const merged: NukeSettings = { ...DEFAULT_SETTINGS, ...result[STORAGE_KEY] };
  cachedSettings = merged;
  return merged;
}

export async function saveSettings(
  settings: Partial<NukeSettings>,
): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await chrome.storage.sync.set({ [STORAGE_KEY]: updated });
  cachedSettings = updated;
}

export function getCachedSettings(): NukeSettings {
  return cachedSettings ?? DEFAULT_SETTINGS;
}

export function initStorageListener(
  onChange?: (settings: NukeSettings) => void,
): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[STORAGE_KEY]) {
      const updated: NukeSettings = {
        ...DEFAULT_SETTINGS,
        ...changes[STORAGE_KEY].newValue,
      };
      cachedSettings = updated;
      onChange?.(updated);
    }
  });
}

export function useSettingsHook() {
  return { getSettings, saveSettings, getCachedSettings };
}
