# party.exe 🎉

A Windows 95–themed birthday invite site for Ansgar & Yasser's tandem birthday bash — built as a single retro "desktop" with draggable windows, a scrolling ticker, and a handful of working desktop icons.

**Live site:** https://bambozya.github.io/ansiyasiparti/

## Features

- Win95 desktop chrome: raised/sunken bevels, title bars, taskbar with a live clock
- Party details window with location, date, gifts, dress code, and music info
- Scrolling marquee ticker and a pausable animated photo viewer
- Available in English, German, and Arabic (with full RTL layout support)
- Desktop icons, each opening its own little app:
  - 📧 **Email** — RSVP via mailto link
  - 💣 **Minesweeper** — a fully playable 9×9 game (flag with right-click on desktop, long-press on touch/mobile)
  - 📻 **Radio** — Radio alHara live stream with now-playing metadata
  - 🥁 **Drummer** — Give the Drummer Some (WFMU) live stream
  - 🤘 **Punk** — Punkrockers Radio live stream

## Files

| File | Purpose |
|---|---|
| `index.html` | English page |
| `index-de.html` | German page |
| `index-ar.html` | Arabic page (RTL) |
| `party95.css` | All styling (Win95 chrome, windows, Minesweeper, radio players) |
| `party95.js` | All behavior (ticker, photo viewer, radio players, Minesweeper) |
| `*.ics` | Calendar invite files per language |

## Running locally

No build step — it's static HTML/CSS/JS. Just serve the folder, e.g.:

```bash
python3 -m http.server 8000
```

then open `http://localhost:8000/index.html`.
