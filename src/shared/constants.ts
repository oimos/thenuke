import type { NukeSettings } from "./types";

export const DEFAULT_SETTINGS: NukeSettings = {
  blacklist: [],
  camouflageMode: "safeUrl",
  safeUrl: "https://www.linkedin.com/feed/",
  panicMinutes: 0,
  enabled: true,
};

export const STORAGE_KEY = "nukeSettings";

export const PRESET_BLACKLISTS: Record<string, string[]> = {
  "Social Media": [
    "twitter.com",
    "x.com",
    "facebook.com",
    "instagram.com",
    "tiktok.com",
    "snapchat.com",
    "reddit.com",
    "threads.net",
    "mastodon.social",
  ],
  Video: [
    "youtube.com",
    "twitch.tv",
    "netflix.com",
    "disneyplus.com",
    "hulu.com",
    "crunchyroll.com",
    "primevideo.com",
  ],
  News: [
    "news.ycombinator.com",
    "buzzfeed.com",
    "9gag.com",
    "dailymail.co.uk",
  ],
  Gaming: [
    "store.steampowered.com",
    "twitch.tv",
    "discord.com",
    "epicgames.com",
  ],
};

export const PANIC_LEVELS = [
  { value: 0, label: "Closed URLs only" },
  { value: 5, label: "Last 5 minutes" },
  { value: 15, label: "Last 15 minutes" },
  { value: 30, label: "Last 30 minutes" },
  { value: 60, label: "Last hour" },
] as const;
