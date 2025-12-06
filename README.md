# Typing Game

A kid-friendly typing game that shows a character and celebrates when you type the correct key. Built with Alpine.js and supports multiple languages (English, Dutch, French, German).

**🎮 Play it live:** [christophevandijck.be/typing-game](https://christophevandijck.be/typing-game)

## Features

- ✨ **Celebration animations** — Confetti balloons, celebratory emoji, and sound effects when correct
- 🌍 **Multilingual support** — Switch between English, Dutch, French, and German
- ⚙️ **Customizable character sets** — Choose letters, numbers, and/or special characters
- 💾 **Persistent preferences** — Settings saved to localStorage
- 📱 **Responsive design** — Works on desktop, tablet, and mobile
- ⌨️ **Keyboard-focused** — Just press keys, no typing in input fields
- 🚀 **Lightweight** — Alpine.js framework, no build process needed

## Files

- `index.html` — Main page with Alpine.js setup and embedded translations
- `script.js` — Game logic and event handling
- `styles.css` — Styling and animations
- `translations.json` — Translation data (reference only, embedded in HTML)
- `CNAME` — GitHub Pages custom domain config

## How to Play

1. Open the game in your browser
2. A character will appear on screen
3. Press that exact key on your keyboard (case-insensitive)
4. ✅ Correct? See balloons and celebration!
5. ❌ Wrong? Try again!

Use the **Settings** menu (☰) to:
- Change language
- Toggle character types (letters, numbers, special chars)
- Settings are saved automatically

## Technology

- **Alpine.js 3.x** — Reactive data binding without build process
- **Vanilla CSS** — Animations for balloons, pulse effects
- **Web Audio API** — Simple celebration beep sound
- **localStorage** — Persisting user preferences

## Running Locally

Simply open `index.html` in your browser. No build process or server required.

## Notes

- Sound may be blocked by browser until first interaction
- Game defaults to letters only; customize in Settings
- All translations are embedded in the HTML to avoid CORS issues