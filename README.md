# Quick Workspace Manager (The Nuke)

Emergency privacy Chrome extension that closes specific tabs, wipes history, and applies camouflage instantly.

## Setup

```bash
npm install
npm run build
```

## Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` folder

## Usage

### Trigger

- **Keyboard shortcut**: `Alt+Shift+X`
- **Popup button**: Click the extension icon → hold "Clean Workspace" for 1.5s

### Configuration

Click the extension icon → gear icon → or go to `chrome://extensions` → Quick Workspace Manager → Options.

- **Domain Watchlist**: Add domains to monitor (e.g. `twitter.com`, `reddit.com`). Use presets for quick setup.
- **Camouflage Mode**: Choose between Safe URL redirect or Fake Dashboard overlay.
- **History Cleanup**: Set how many minutes of history to wipe (0 = closed URLs only).
- **Test Scan**: Preview which tabs match without closing anything.

### Fake Dashboard

When "Dashboard Overlay" mode is selected, an Excel-style spreadsheet fills the screen on the active tab after cleanup. Press `Esc` to dismiss.

## Development

```bash
npm run dev
```

## Architecture

```
src/
├── background/index.ts    # Service Worker - Nuke Engine
├── content/index.ts       # Content Script - Fake UI injection via Shadow DOM
├── popup/                 # Extension popup with hidden panic button
├── options/               # Settings page (blacklist, mode, panic level)
└── shared/                # Types, storage wrapper, messaging, constants
```
