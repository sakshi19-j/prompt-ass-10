# Password Strength Checker

A local-only Chrome Manifest V3 extension that checks password strength without permissions, network requests, storage, or external libraries.

## Install in Chrome

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `password-checker-extension` folder.
5. Pin the extension if desired, then open it from the toolbar.

## Features

- Local password scoring from Very Weak to Very Strong.
- Character-set size and entropy in bits.
- Readable offline brute-force estimate at one billion guesses per second.
- Checklist for length, uppercase, lowercase, digits, and symbols.
- Detection for common weak passwords and obvious repeated or sequential patterns.
- One to three improvement tips.
- Cryptographically generated 16-character passwords using `crypto.getRandomValues`.
- Copy button with confirmation.
- Light and dark mode through `prefers-color-scheme`.
- Keyboard-friendly controls, labels, ARIA status text, and visible focus styles.
- No permissions and no network access.

## Test the scoring module

From this folder, run:

```text
node test-strength.js
```

The popup files are plain HTML, CSS, and JavaScript and can also be inspected directly in the browser extension view.
