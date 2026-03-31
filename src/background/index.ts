import type { NukeSettings, NukeResult, MatchedTab } from "../shared/types";
import type { MessageType, MessageResponse } from "../shared/messaging";
import {
  getSettings,
  getCachedSettings,
  initStorageListener,
} from "../shared/storage";
import { domainMatches } from "../shared/domain-matcher";

initStorageListener();
getSettings();

chrome.commands.onCommand.addListener((command) => {
  if (command === "trigger-nuke") {
    executeNuke();
  }
});

chrome.runtime.onMessage.addListener(
  (
    message: MessageType,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: MessageResponse) => void,
  ) => {
    if (message.action === "trigger-nuke") {
      executeNuke()
        .then((result) => sendResponse({ success: true, result }))
        .catch((err) =>
          sendResponse({ success: false, error: String(err) }),
        );
      return true;
    }

    if (message.action === "scan-tabs") {
      scanMatchingTabs()
        .then((matched) => sendResponse({ success: true, matched }))
        .catch((err) =>
          sendResponse({ success: false, error: String(err) }),
        );
      return true;
    }

    return false;
  },
);

async function scanMatchingTabs(): Promise<MatchedTab[]> {
  const settings = getCachedSettings();
  const allTabs = await chrome.tabs.query({});
  const blacklistSet = new Set(settings.blacklist);

  return allTabs
    .filter((tab) => tab.url && domainMatches(tab.url, blacklistSet))
    .map((tab) => ({
      tabId: tab.id!,
      url: tab.url!,
      domain: new URL(tab.url!).hostname,
      title: tab.title || "",
    }));
}

async function executeNuke(): Promise<NukeResult> {
  const start = performance.now();
  const settings = getCachedSettings();

  if (!settings.enabled) {
    return {
      closedTabs: 0,
      deletedUrls: 0,
      camouflageApplied: false,
      durationMs: 0,
    };
  }

  const allTabs = await chrome.tabs.query({});
  const blacklistSet = new Set(settings.blacklist);

  const matched = allTabs.filter(
    (tab) => tab.url && domainMatches(tab.url, blacklistSet),
  );
  const tabIds = matched.map((t) => t.id!).filter(Boolean);
  const urls = matched.map((t) => t.url!).filter(Boolean);

  const safeTab = allTabs.find(
    (tab) => tab.active && !matched.some((m) => m.id === tab.id),
  );

  const tasks: Promise<unknown>[] = [];

  if (tabIds.length > 0) {
    tasks.push(chrome.tabs.remove(tabIds));
  }

  for (const url of urls) {
    tasks.push(chrome.history.deleteUrl({ url }));
  }

  if (settings.panicMinutes > 0) {
    tasks.push(wipePanicHistory(settings.panicMinutes));
  }

  tasks.push(applyCamouflage(settings, safeTab, allTabs));

  await Promise.all(tasks);

  const durationMs = Math.round(performance.now() - start);

  return {
    closedTabs: tabIds.length,
    deletedUrls: urls.length,
    camouflageApplied: true,
    durationMs,
  };
}

async function wipePanicHistory(minutes: number): Promise<void> {
  const endTime = Date.now();
  const startTime = endTime - minutes * 60 * 1000;
  await chrome.history.deleteRange({ startTime, endTime });
}

async function applyCamouflage(
  settings: NukeSettings,
  safeTab: chrome.tabs.Tab | undefined,
  allTabs: chrome.tabs.Tab[],
): Promise<void> {
  if (settings.camouflageMode === "safeUrl") {
    const targetTab =
      safeTab ?? allTabs.find((t) => t.active) ?? allTabs[0];
    if (targetTab?.id) {
      await chrome.tabs.update(targetTab.id, { url: settings.safeUrl });
    }
    return;
  }

  const targetTab = safeTab ?? allTabs.find((t) => t.active) ?? allTabs[0];
  if (!targetTab?.id) return;

  try {
    await chrome.tabs.sendMessage(targetTab.id, {
      action: "inject-fake-ui",
    });
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId: targetTab.id },
      files: ["content.js"],
    });
    await new Promise((r) => setTimeout(r, 100));
    await chrome.tabs.sendMessage(targetTab.id, {
      action: "inject-fake-ui",
    });
  }
}
