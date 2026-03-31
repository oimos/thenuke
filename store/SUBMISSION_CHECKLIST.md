# Chrome Web Store Submission Checklist

## 1. Developer Account
- [ ] Chrome Web Store Developer アカウント登録済み ($5 one-time fee)
- [ ] https://chrome.google.com/webstore/devconsole/

## 2. Extension Package
- [ ] `npm run build` で `dist/` を生成
- [ ] `dist/` フォルダを ZIP にパッケージ：`cd dist && zip -r ../store/the-nuke.zip .`

## 3. Store Listing — Required Assets

| Asset | Size | File | Status |
|---|---|---|---|
| Store Icon | 128x128 PNG | `public/icons/icon128.png` | ✅ Ready |
| Screenshot 1 (Popup) | 1280x800 PNG | `store/screenshots/screenshot-popup.html` → ブラウザで開いてスクショ | ⬜ TODO |
| Screenshot 2 (Options) | 1280x800 PNG | `store/screenshots/screenshot-options.html` → ブラウザで開いてスクショ | ⬜ TODO |
| Screenshot 3 (Fake UI) | 1280x800 PNG | `store/screenshots/screenshot-fake-ui.html` → ブラウザで開いてスクショ | ⬜ TODO |
| Small Promo Tile | 440x280 PNG | `store/promo-small.png` | ✅ Ready (add text overlay) |
| Marquee Image | 1400x560 PNG | `store/promo-marquee.png` | ✅ Ready (add text overlay) |

### Screenshots の取り方
1. Chrome で各 HTML ファイルを開く
2. DevTools → Ctrl+Shift+M (デバイスモード)
3. Viewport を 1280x800 に設定
4. Ctrl+Shift+P → "Capture full size screenshot"

## 4. Store Listing — Text Content

| Field | Max Length | File |
|---|---|---|
| Name | 75 chars | `The Nuke` |
| Short Description | 132 chars | `store/short-description.txt` |
| Description | 16,000 chars | `store/description.txt` |

## 5. Additional Fields

| Field | Value |
|---|---|
| Category | Productivity |
| Language | English |
| Pricing | Free |
| Visibility | Public |
| Privacy Policy | `store/privacy-policy.md` (GitHub URL or host on own site) |
| Homepage URL | https://github.com/oimos/thenuke |
| Support URL | https://github.com/oimos/thenuke/issues |

## 6. Permissions Justification
- [ ] `store/permissions-justification.md` の内容を Developer Dashboard の各パーミッション入力欄にコピー

## 7. Review Notes (Optional)
Developer Dashboard の「審査担当者向けの注意事項」に記入：

```
This extension helps users quickly close specific browser tabs and clear their history for privacy purposes. 

To test:
1. Go to Options page and add domains to the watchlist (e.g., twitter.com, reddit.com)
2. Open tabs matching those domains
3. Press Alt+Shift+X or use the popup button
4. Matching tabs will close, history will be cleared, and camouflage will activate
```

## 8. Submit
- [ ] ZIP をアップロード
- [ ] 全フィールド入力
- [ ] プレビューを確認
- [ ] 「Submit for review」をクリック
- [ ] 審査結果を待つ（通常 1-3 営業日）
