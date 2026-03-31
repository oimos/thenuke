# Chrome Web Store — Permissions Justification

Below are the justifications for each permission requested by The Nuke.
Use these when filling out the Chrome Web Store developer dashboard.

---

## tabs

**Justification:**
This extension needs the `tabs` permission to query all open tabs across all windows and read their URLs. This is required to match tab URLs against the user's configured domain watchlist. When a match is found, the extension uses `chrome.tabs.remove()` to close those tabs. The extension also uses `chrome.tabs.update()` to redirect the active tab to a safe URL as part of its camouflage feature.

---

## history

**Justification:**
This extension needs the `history` permission to delete browsing history entries for URLs that were closed during the cleanup operation. It uses `chrome.history.deleteUrl()` for individual URL deletion and `chrome.history.deleteRange()` for time-based history cleanup based on the user's configured "panic level" setting. No history data is read or transmitted — it is only deleted at the user's explicit request.

---

## storage

**Justification:**
This extension needs the `storage` permission to persist user settings using `chrome.storage.sync`. Stored data includes: the domain watchlist, camouflage mode preference, safe redirect URL, panic level setting, and enabled/disabled state. All data remains within the user's Chrome sync storage and is never transmitted externally.

---

## scripting

**Justification:**
This extension needs the `scripting` permission to dynamically inject a content script into the active tab when the camouflage "Dashboard Overlay" mode is activated. The injected script renders a full-screen overlay (a simulated Excel spreadsheet) inside a Shadow DOM to conceal the underlying page content. This is used only when explicitly triggered by the user.

---

## activeTab

**Justification:**
This extension needs the `activeTab` permission to interact with the currently active tab for its camouflage feature — either redirecting it to a safe URL or injecting the dashboard overlay content script. This permission is used only in response to an explicit user action (keyboard shortcut or button press).

---

## host_permissions: <all_urls>

**Justification:**
This extension needs the `<all_urls>` host permission to read the URLs of all open tabs for domain matching against the user's watchlist. Without this permission, `chrome.tabs.query()` would not return the `url` property of tabs, making it impossible to determine which tabs match the user's configured domains. This permission is also required to inject the camouflage overlay content script on any page the user may be viewing. No data from any website is collected, read, or transmitted — URLs are only compared locally against the user's own watchlist.
