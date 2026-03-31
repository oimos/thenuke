import { useCallback, useEffect, useRef, useState } from "react";
import type { NukeSettings, MatchedTab } from "@/shared/types";
import { getSettings } from "@/shared/storage";
import { sendMessage } from "@/shared/messaging";

export function Popup() {
  const [settings, setSettings] = useState<NukeSettings | null>(null);
  const [matched, setMatched] = useState<MatchedTab[]>([]);
  const [nuking, setNuking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStart = useRef<number>(0);

  useEffect(() => {
    getSettings().then(setSettings);
    sendMessage({ action: "scan-tabs" }).then((res) => {
      if (res.success && "matched" in res) {
        setMatched(res.matched);
      }
    });
  }, []);

  const triggerNuke = useCallback(async () => {
    if (nuking) return;
    setNuking(true);
    setResult(null);

    try {
      const res = await sendMessage({ action: "trigger-nuke" });
      if (res.success && "result" in res) {
        setResult(
          `Cleaned ${res.result.closedTabs} tabs in ${res.result.durationMs}ms`,
        );
        setMatched([]);
      } else if (!res.success) {
        setResult("Error: " + res.error);
      }
    } catch (e) {
      setResult("Failed: " + String(e));
    } finally {
      setNuking(false);
    }
  }, [nuking]);

  const onHoldStart = useCallback(() => {
    holdStart.current = Date.now();
    setHoldProgress(0);
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - holdStart.current;
      const progress = Math.min(elapsed / 1500, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        clearInterval(holdTimer.current!);
        holdTimer.current = null;
        setHoldProgress(0);
        triggerNuke();
      }
    }, 30);
  }, [triggerNuke]);

  const onHoldEnd = useCallback(() => {
    if (holdTimer.current) {
      clearInterval(holdTimer.current);
      holdTimer.current = null;
    }
    setHoldProgress(0);
  }, []);

  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div className="w-[320px] bg-white text-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <div>
              <h1 className="text-sm font-semibold leading-tight">
                Workspace Manager
              </h1>
              <p className="text-[10px] opacity-75">v1.0.0</p>
            </div>
          </div>
          <button
            onClick={openOptions}
            className="rounded p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
            title="Settings"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="8" cy="8" r="2.5" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Monitoring</span>
          <span className="font-medium text-blue-600">
            {settings?.blacklist.length ?? 0} domains
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Flagged tabs</span>
          <span
            className={`font-medium ${matched.length > 0 ? "text-amber-600" : "text-green-600"}`}
          >
            {matched.length} {matched.length === 0 ? "✓" : "⚠"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Mode</span>
          <span className="font-medium text-gray-700">
            {settings?.camouflageMode === "fakeUI"
              ? "Dashboard Overlay"
              : "Safe Redirect"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Shortcut</span>
          <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[10px] text-gray-600">
            Alt+Shift+X
          </kbd>
        </div>
      </div>

      {/* Matched tabs */}
      {matched.length > 0 && (
        <div className="border-b border-gray-100 px-4 py-2">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
            Flagged Tabs
          </p>
          <div className="max-h-[120px] space-y-1 overflow-y-auto">
            {matched.map((tab) => (
              <div
                key={tab.tabId}
                className="flex items-center gap-2 rounded bg-amber-50 px-2 py-1"
              >
                <span className="text-[10px] text-amber-500">●</span>
                <span className="truncate text-[11px] text-gray-600">
                  {tab.domain}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result message */}
      {result && (
        <div className="border-b border-gray-100 px-4 py-2">
          <div
            className={`rounded px-2 py-1.5 text-center text-xs ${result.startsWith("Error") || result.startsWith("Failed") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
          >
            {result}
          </div>
        </div>
      )}

      {/* Action area */}
      <div className="px-4 py-3">
        <button
          onMouseDown={onHoldStart}
          onMouseUp={onHoldEnd}
          onMouseLeave={onHoldEnd}
          onTouchStart={onHoldStart}
          onTouchEnd={onHoldEnd}
          disabled={nuking || !settings?.enabled}
          className="relative w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div
            className="absolute inset-y-0 left-0 bg-red-500/10 transition-all"
            style={{ width: `${holdProgress * 100}%` }}
          />
          <span className="relative">
            {nuking
              ? "Cleaning..."
              : holdProgress > 0
                ? "Keep holding..."
                : "🧹 Clean Workspace"}
          </span>
        </button>
        <p className="mt-1.5 text-center text-[10px] text-gray-400">
          Hold for 1.5s to activate
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-2">
        <p className="text-center text-[10px] text-gray-300">
          Quick Workspace Manager
        </p>
      </div>
    </div>
  );
}
