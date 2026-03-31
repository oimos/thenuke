# Privacy Policy — The Nuke

**Last updated:** March 31, 2026

## Overview

The Nuke is a browser extension that helps users manage their privacy by closing specific browser tabs and clearing associated browsing history. We are committed to protecting your privacy.

## Data Collection

**The Nuke does not collect, transmit, or store any personal data on external servers.**

Specifically:
- We do **not** collect browsing history
- We do **not** collect or transmit URLs you visit
- We do **not** use analytics or tracking services
- We do **not** send any data to third-party services
- We do **not** use cookies for tracking purposes

## Data Storage

The Nuke stores the following configuration data **locally** in your browser using Chrome's built-in sync storage (`chrome.storage.sync`):

- **Domain watchlist**: The list of domains you configure for monitoring (e.g., "twitter.com", "reddit.com")
- **Camouflage mode preference**: Your choice between "Safe URL redirect" or "Dashboard overlay"
- **Safe URL**: The URL you choose for the redirect feature
- **Panic level**: Your preferred history cleanup duration
- **Enabled state**: Whether the extension is active

This data is synced across your Chrome browsers using your Google account's built-in Chrome sync feature. It is **never** sent to any server operated by us or any third party.

## Permissions

The Nuke requests the following browser permissions, each used solely for its core functionality:

| Permission | Purpose |
|---|---|
| `tabs` | Read tab URLs to match against your watchlist; close matching tabs |
| `history` | Delete browsing history entries for closed tabs |
| `storage` | Save your settings (watchlist, preferences) |
| `scripting` | Inject the camouflage dashboard overlay onto the active tab |
| `activeTab` | Access the currently active tab for camouflage features |
| `host_permissions (<all_urls>)` | Required to read tab URLs across all websites for domain matching |

## Third-Party Services

The Nuke does not integrate with, send data to, or receive data from any third-party services.

## Children's Privacy

The Nuke does not knowingly collect any information from children under the age of 13.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be reflected in the "Last updated" date above.

## Open Source

The Nuke is open source. You can review the complete source code at:
https://github.com/oimos/thenuke

## Contact

If you have any questions about this privacy policy, please open an issue on our GitHub repository:
https://github.com/oimos/thenuke/issues
