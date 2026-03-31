import { useCallback, useEffect, useState } from "react";
import type { NukeSettings, MatchedTab } from "@/shared/types";
import { getSettings, saveSettings } from "@/shared/storage";
import { PRESET_BLACKLISTS, PANIC_LEVELS } from "@/shared/constants";
import { sendMessage } from "@/shared/messaging";

export function Options() {
  const [settings, setSettings] = useState<NukeSettings | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState<MatchedTab[] | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const save = useCallback(
    async (patch: Partial<NukeSettings>) => {
      if (!settings) return;
      const updated = { ...settings, ...patch };
      setSettings(updated);
      setSaving(true);
      await saveSettings(patch);
      setTimeout(() => setSaving(false), 600);
    },
    [settings],
  );

  const addDomain = useCallback(() => {
    if (!settings || !domainInput.trim()) return;
    const domain = domainInput
      .trim()
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .replace(/\/.*$/, "");
    if (settings.blacklist.includes(domain)) {
      setDomainInput("");
      return;
    }
    save({ blacklist: [...settings.blacklist, domain] });
    setDomainInput("");
  }, [settings, domainInput, save]);

  const removeDomain = useCallback(
    (domain: string) => {
      if (!settings) return;
      save({ blacklist: settings.blacklist.filter((d) => d !== domain) });
    },
    [settings, save],
  );

  const addPreset = useCallback(
    (domains: string[]) => {
      if (!settings) return;
      const merged = Array.from(
        new Set([...settings.blacklist, ...domains]),
      );
      save({ blacklist: merged });
      setShowPresets(false);
    },
    [settings, save],
  );

  const testScan = useCallback(async () => {
    const res = await sendMessage({ action: "scan-tabs" });
    if (res.success && "matched" in res) {
      setTestResult(res.matched);
    }
  }, []);

  if (!settings) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-2xl bg-white px-6 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Workspace Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your workspace cleanup preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saving && (
            <span className="text-xs text-green-500">✓ Saved</span>
          )}
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-sm text-gray-600">Active</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => save({ enabled: e.target.checked })}
                className="peer sr-only"
              />
              <div className="h-5 w-9 rounded-full bg-gray-300 transition peer-checked:bg-blue-600" />
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
            </div>
          </label>
        </div>
      </div>

      {/* Blacklist */}
      <section className="mb-6 rounded-lg border border-gray-200 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">
              Domain Watchlist
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Tabs matching these domains will be closed during cleanup
            </p>
          </div>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
          >
            + Presets
          </button>
        </div>

        {/* Presets dropdown */}
        {showPresets && (
          <div className="mb-4 rounded-md border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-xs font-medium text-gray-500">
              Quick Add Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PRESET_BLACKLISTS).map(([name, domains]) => (
                <button
                  key={name}
                  onClick={() => addPreset(domains)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                >
                  {name}
                  <span className="ml-1 text-gray-400">
                    ({domains.length})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Domain input */}
        <div className="mb-3 flex gap-2">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addDomain()}
            placeholder="e.g. twitter.com"
            className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button
            onClick={addDomain}
            disabled={!domainInput.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add
          </button>
        </div>

        {/* Domain list */}
        {settings.blacklist.length > 0 ? (
          <div className="max-h-[200px] space-y-1 overflow-y-auto">
            {settings.blacklist.map((domain) => (
              <div
                key={domain}
                className="group flex items-center justify-between rounded-md px-3 py-1.5 transition hover:bg-gray-50"
              >
                <span className="text-sm text-gray-600">{domain}</span>
                <button
                  onClick={() => removeDomain(domain)}
                  className="text-xs text-gray-300 transition hover:text-red-500 group-hover:text-gray-400"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-xs text-gray-300">
            No domains added yet. Add domains or use presets above.
          </p>
        )}
      </section>

      {/* Camouflage Mode */}
      <section className="mb-6 rounded-lg border border-gray-200 p-5">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">
          Camouflage Mode
        </h2>
        <p className="mb-4 text-xs text-gray-400">
          What happens after cleanup completes
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => save({ camouflageMode: "safeUrl" })}
            className={`rounded-lg border-2 p-3 text-left transition ${
              settings.camouflageMode === "safeUrl"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="mb-1 text-lg">🔗</div>
            <div className="text-xs font-medium text-gray-700">
              Safe Redirect
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">
              Navigate to a safe URL
            </div>
          </button>
          <button
            onClick={() => save({ camouflageMode: "fakeUI" })}
            className={`rounded-lg border-2 p-3 text-left transition ${
              settings.camouflageMode === "fakeUI"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="mb-1 text-lg">📊</div>
            <div className="text-xs font-medium text-gray-700">
              Dashboard Overlay
            </div>
            <div className="mt-0.5 text-[10px] text-gray-400">
              Show fake Excel spreadsheet
            </div>
          </button>
        </div>

        {/* Safe URL input */}
        {settings.camouflageMode === "safeUrl" && (
          <div className="mt-3">
            <label className="mb-1 block text-xs text-gray-500">
              Redirect URL
            </label>
            <input
              type="url"
              value={settings.safeUrl}
              onChange={(e) => save({ safeUrl: e.target.value })}
              placeholder="https://www.linkedin.com/feed/"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-300 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        )}
      </section>

      {/* Panic Level */}
      <section className="mb-6 rounded-lg border border-gray-200 p-5">
        <h2 className="mb-1 text-sm font-semibold text-gray-700">
          History Cleanup
        </h2>
        <p className="mb-4 text-xs text-gray-400">
          How much browsing history to clear in addition to closed tab URLs
        </p>
        <div className="space-y-2">
          {PANIC_LEVELS.map(({ value, label }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition ${
                settings.panicMinutes === value
                  ? "bg-blue-50 ring-1 ring-blue-200"
                  : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="panic"
                checked={settings.panicMinutes === value}
                onChange={() => save({ panicMinutes: value })}
                className="accent-blue-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
              {value > 0 && (
                <span className="ml-auto text-[10px] text-gray-400">
                  {value}m
                </span>
              )}
            </label>
          ))}
        </div>
      </section>

      {/* Test */}
      <section className="rounded-lg border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">
              Test Scan
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Preview which tabs would be affected (no tabs will be closed)
            </p>
          </div>
          <button
            onClick={testScan}
            className="rounded-md bg-gray-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-900"
          >
            Run Test
          </button>
        </div>

        {testResult !== null && (
          <div className="mt-3 rounded-md bg-gray-50 p-3">
            {testResult.length === 0 ? (
              <p className="text-center text-xs text-green-600">
                ✓ No matching tabs found
              </p>
            ) : (
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-amber-600">
                  {testResult.length} tab(s) would be closed:
                </p>
                {testResult.map((tab) => (
                  <div
                    key={tab.tabId}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="text-amber-400">●</span>
                    <span className="font-medium text-gray-600">
                      {tab.domain}
                    </span>
                    <span className="truncate text-gray-400">
                      {tab.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-300">
        Quick Workspace Manager v1.0.0 &middot; Alt+Shift+X to activate
      </div>
    </div>
  );
}
