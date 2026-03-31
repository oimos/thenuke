# Lemon Squeezy セットアップガイド — The Nuke

## 1. アカウント & ストア作成

1. https://app.lemonsqueezy.com/register でアカウント作成
2. ストア名: `The Nuke` / サブドメイン: `thenuke`
3. テストモードで設定完了後、本番有効化

## 2. プロダクト登録

Dashboard → "+" → "New Product"

### 基本情報

| フィールド | 値 |
|---|---|
| **Name** | `The Nuke — Emergency Privacy for Chrome` |
| **Description** | `lemon/description-short.txt` の内容をコピー |

### 価格設定

- **Pricing model**: Single Payment
- **Price**: $4.99（または Pay What You Want: min $1.00, suggested $5.00）
- **Tax category**: SaaS / Digital Goods

### バリアント（任意）

| Variant | Price | License Limit |
|---|---|---|
| Personal License | $4.99 | 3 activations |
| Team License | $19.99 | 10 activations |

### メディア (4:3 / 1200x900)

`lemon/media/` 内の HTML ファイルをブラウザで開いてスクリーンショット：

```bash
# Chrome DevTools でスクリーンショットを撮る手順:
# 1. HTMLファイルをChromeで開く
# 2. F12 → Ctrl+Shift+M (デバイスモード)
# 3. Viewport: 1200 x 900
# 4. Ctrl+Shift+P → "Capture full size screenshot"
```

アップロード順：
1. `hero.html` → ヒーロー画像（サムネイル・OGP に使用される）
2. `feature-speed.html` → パフォーマンス訴求
3. `feature-popup.html` → Popup UI 紹介
4. `feature-fakeui.html` → Fake Dashboard デモ

### ファイル

```bash
cd /Users/shinya.takahashi/Dev/thenuke
npm run build
cd dist && zip -r ../lemon/the-nuke-chrome-extension.zip .
```

生成された `lemon/the-nuke-chrome-extension.zip` をアップロード。

### リンク

| Label | URL |
|---|---|
| GitHub Repository | https://github.com/oimos/thenuke |
| Support & Issues | https://github.com/oimos/thenuke/issues |
| Installation Guide | https://github.com/oimos/thenuke#setup |

### 設定

- [x] **Generate license keys**: ON
- [x] **Display on storefront**: ON

### Confirmation Modal

`lemon/confirmation-modal.json` の内容を入力：

- **Title**: You're all set! ☢️
- **Message**: Thanks for purchasing The Nuke! Download the extension below and follow the installation guide to get started. Your license key is included in the receipt email.
- **Button text**: Download The Nuke
- **Button link**: https://github.com/oimos/thenuke/releases/latest

### Receipt Email

`lemon/receipt-email.json` の内容を入力。

## 3. ストアデザイン

Dashboard → Design で以下をカスタマイズ：

- **Primary color**: `#ef4444` (red)
- **Background**: Dark theme
- **Logo**: `public/icons/icon128.png` をアップロード

## 4. Payout 設定

Settings → Payouts → PayPal または銀行口座を接続

## 5. ストア有効化

Settings → General → Activate Store

審査: 通常 1-2 営業日

## 6. 公開 & 共有

Product → Share → チェックアウトリンクを取得

```
https://thenuke.lemonsqueezy.com/buy/the-nuke
```

README やサイトに埋め込み。
