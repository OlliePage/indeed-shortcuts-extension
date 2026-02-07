# Indeed Candidate Shortcuts

A Chrome extension that adds keyboard shortcuts for rapid candidate review on Indeed Employer.

## Features

Navigate and review job candidates quickly using home-row keyboard shortcuts:

- **A** - Accept / Shortlist (✓)
- **S** - Skip / Undecided (?)
- **D** - Decline / Reject (✕)
- **F** - Forward / Next candidate →
- **G** - Go back / Previous candidate ←

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/indeed-shortcuts-extension.git
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the extension directory

5. Navigate to [Indeed Employer](https://employers.indeed.com/) and start reviewing candidates

## Usage

The extension automatically activates on `employers.indeed.com` pages. Simply use the keyboard shortcuts while reviewing candidate profiles:

- Shortcuts are **disabled** when typing in text fields (inputs, textareas, or contenteditable elements)
- Shortcuts work without modifier keys (no Ctrl/Cmd/Alt needed)
- Visual toast notifications confirm each action

### Home-row Layout

The shortcuts are designed for left-hand operation on QWERTY keyboards, keeping your right hand free for mouse navigation or note-taking:

```
A (Accept)    S (Skip)    D (Decline)    F (Forward)    G (Go back)
```

## Development

### File Structure

```
indeed-shortcuts-extension/
├── manifest.json       # Extension configuration
├── content.js          # Main keyboard handling logic
├── popup.html          # Extension popup (shortcut reference)
├── toast.css           # Toast notification styles
└── icons/              # Extension icons
    ├── icon48.png
    └── icon128.png
```

### Updating Selectors

If Indeed changes their DOM structure, update the selectors in `content.js`:

- `SELECTORS` object contains the primary data-testid selectors
- `FALLBACK` object provides aria-label fallbacks

## Compatibility

- **Browser**: Chrome, Edge, and other Chromium-based browsers (Manifest V3)
- **Site**: employers.indeed.com
- **Version**: 1.2.0

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
