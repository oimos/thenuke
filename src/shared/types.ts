export interface NukeSettings {
  blacklist: string[];
  camouflageMode: "safeUrl" | "fakeUI";
  safeUrl: string;
  panicMinutes: number;
  enabled: boolean;
}

export interface NukeResult {
  closedTabs: number;
  deletedUrls: number;
  camouflageApplied: boolean;
  durationMs: number;
}

export interface MatchedTab {
  tabId: number;
  url: string;
  domain: string;
  title: string;
}
