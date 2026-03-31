import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubGlobal("chrome", {
  runtime: {
    sendMessage: vi.fn(),
  },
});

import { sendMessage } from "../src/shared/messaging";

describe("messaging", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends trigger-nuke message", async () => {
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({
      success: true,
      result: {
        closedTabs: 3,
        deletedUrls: 3,
        camouflageApplied: true,
        durationMs: 42,
      },
    });

    const res = await sendMessage({ action: "trigger-nuke" });

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: "trigger-nuke",
    });
    expect(res.success).toBe(true);
  });

  it("sends scan-tabs message", async () => {
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({
      success: true,
      matched: [
        {
          tabId: 1,
          url: "https://twitter.com",
          domain: "twitter.com",
          title: "Twitter",
        },
      ],
    });

    const res = await sendMessage({ action: "scan-tabs" });

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: "scan-tabs",
    });
    expect(res.success).toBe(true);
    if (res.success && "matched" in res) {
      expect(res.matched).toHaveLength(1);
    }
  });

  it("sends inject-fake-ui message", async () => {
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({
      success: true,
    });

    const res = await sendMessage({ action: "inject-fake-ui" });

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: "inject-fake-ui",
    });
    expect(res.success).toBe(true);
  });

  it("sends dismiss-fake-ui message", async () => {
    vi.mocked(chrome.runtime.sendMessage).mockResolvedValueOnce({
      success: true,
    });

    const res = await sendMessage({ action: "dismiss-fake-ui" });

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
      action: "dismiss-fake-ui",
    });
    expect(res.success).toBe(true);
  });
});
