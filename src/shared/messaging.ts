import type { NukeResult, MatchedTab } from "./types";

export type MessageType =
  | { action: "trigger-nuke" }
  | { action: "scan-tabs" }
  | { action: "inject-fake-ui" }
  | { action: "dismiss-fake-ui" };

export type MessageResponse =
  | { success: true; result: NukeResult }
  | { success: true; matched: MatchedTab[] }
  | { success: true }
  | { success: false; error: string };

export function sendMessage(message: MessageType): Promise<MessageResponse> {
  return chrome.runtime.sendMessage(message);
}
