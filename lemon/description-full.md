# The Nuke — Emergency Privacy for Chrome

**Close targeted tabs, wipe history, and camouflage your screen in under 200ms.**

---

## The Problem

You're browsing Reddit, Twitter, or YouTube at work. Someone walks up behind you. A meeting starts and you need to share your screen. You need those tabs gone — **now**.

Manually closing tabs leaves traces. History entries remain. The tab bar tells a story.

## The Solution

**The Nuke** is a Chrome extension that eliminates distracting tabs, erases their history, and covers your screen — all triggered by a single hotkey.

### How It Works

1. **You define your watchlist** — domains like twitter.com, reddit.com, youtube.com
2. **You press Alt+Shift+X** (or hold the panic button)
3. **In under 200ms:**
   - All matching tabs close instantly across all windows
   - Their browsing history entries are deleted
   - Your screen is camouflaged with either a safe redirect or a fake Excel dashboard

That's it. No traces. No evidence. Just a clean, professional screen.

---

## Features

### ⚡ Instant Activation
- Global hotkey: **Alt+Shift+X** (works from any tab, any window)
- Hidden hold-to-activate panic button in the popup

### 🎯 Smart Domain Matching
- Custom watchlist — add any domain
- Built-in presets: Social Media, Video, News, Gaming
- Subdomain matching (m.facebook.com, mobile.twitter.com)

### 🧹 Complete Trace Removal
- Closes all matching tabs in one API call
- Deletes individual URL history entries
- Optional time-based wipe (last 5, 15, 30, or 60 minutes)

### 🎭 Two Camouflage Modes

**Safe Redirect** — Navigate to LinkedIn, Google Docs, or any URL you choose

**Dashboard Overlay** — A pixel-perfect fake Excel spreadsheet covers your entire screen:
- "Q4 Financial Summary - CONFIDENTIAL" header
- Realistic department/revenue/expense data
- Full ribbon toolbar, formula bar, sheet tabs, status bar
- Cell selection and hover effects
- Press ESC to dismiss

### ⚙️ Full Control
- Settings page for managing everything
- Test scan to preview affected tabs without closing them
- Enable/disable toggle
- All data stored locally — nothing sent to external servers

---

## Who Is This For?

- **Office workers** who browse during downtime
- **Remote workers** who share screens in video calls
- **Anyone** who values their browsing privacy

---

## What You Get

- Chrome extension (.zip) ready to install
- Lifetime updates via GitHub releases
- Source code access
- Priority support via GitHub Issues

## Technical Details

- **Manifest V3** — latest Chrome extension standard
- **React + TypeScript** — modern, maintainable codebase
- **<200ms execution** — parallel API calls for maximum speed
- **Shadow DOM** — fake UI doesn't interfere with page styles
- **Zero external dependencies** at runtime
