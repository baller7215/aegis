# Aegis Chrome Extension

Inline AI safety analysis for ChatGPT. After each assistant response, Aegis injects a compact panel below it with risk assessment and structured analysis.

## Prerequisites

- Node.js and npm
- Backend running (local or deployed) – see [../backend/README.md](../backend/README.md)

## Setup

1. Copy `.env.example` to `.env` and set the API URL:
   ```
   API_BASE_URL=https://your-app.up.railway.app
   ```
   For local dev: `API_BASE_URL=http://localhost:8000`

2. Install and build:
   ```bash
   npm install
   npm run build
   ```

3. Load the extension in Chrome:
   - Open `chrome://extensions`
   - Enable **Developer mode**
   - Click **Load unpacked**
   - Select the `frontend/dist` folder (not `frontend`)

## Development

- `npm run build` – Build Tailwind CSS and inject `API_BASE_URL` into `background.js`
- `npm run watch` – Rebuild CSS on file changes (re-run `npm run build` to update the API URL)

## Usage

1. Go to [chatgpt.com](https://chatgpt.com)
2. Start a conversation; after each assistant response, an Aegis panel appears below it
3. **Collapsed (default)**: Shield icon, label, and risk pill (Low / Medium / High)
4. **Expanded (click)**: Confidence vs evidence meter, missing context, bias summary, and actions
5. **Recalibrate response**: Shows a safer, evidence-calibrated version of the answer
6. **What could make this wrong?**: Lists potential failure modes

## Structure

- `content.js` – Injects panels into ChatGPT, extracts response text, sends to background
- `background.js` – Fetches analysis from backend API
- `popup.html/css/js` – Extension popup (Open ChatGPT)
- `content.css` – Panel styles (Tailwind output)
- `icons/` – Extension icons (16, 48, 128 px)
