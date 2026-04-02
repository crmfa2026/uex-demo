## Field Agent CRM Prototype

This repository is a front-end prototype of a CRM-style "Field Agent" console. It is a static HTML/CSS/JS project with no backend or build step required.

### Prerequisites

- **Browser**: Any modern browser (Chrome, Edge, Firefox, Safari).
- **Optional (recommended)**: Ability to run a simple local HTTP server (via Python, Node, or a tool like Live Server).


### Recommended: run via a local web server

Running through a local HTTP server more closely matches how the app would run in production and avoids any browser restrictions around `file://` URLs.

#### Option 1: Python 3 (built-in on macOS)

```bash
cd /Users/ashishseth/development/prototype/crm-claude-26-march
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

#### Option 2: Node.js `serve` (if you have Node)

```bash
npm install -g serve
cd /Users/ashishseth/development/prototype/crm-claude-26-march
serve .
```

Then open the URL printed in the terminal (typically `http://localhost:3000` or similar).

### Project structure (high level)

- `index.html` – main entry point and layout shell.
- `css/app.css` – all styling for the CRM UI.
- `js/app.js` and `js/*.js` – front-end behavior, navigation, and components.
- `pages/` – HTML stubs and detail views for various CRM entities.
- `images/` – logos and other image assets.

