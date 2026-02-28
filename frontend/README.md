# Aegis Chrome Extension

Inline AI safety analysis for ChatGPT. After ChatGPT generates a response, Aegis injects a compact panel below it with risk assessment and structured analysis.

## Build (Tailwind CSS)

Styles use Tailwind. Build before loading the extension:

```bash
cd frontend
npm install
npm run build
```

Or run `npm run watch` to rebuild on file changes.

## Load in Chrome

1. Open `chrome://extensions` in Chrome
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the `frontend` directory

## Usage

1. Go to [chat.openai.com](https://chat.openai.com)
2. Start a conversation; after each assistant response, an Aegis panel appears below it
3. **Collapsed (default)**: Shield icon, label, and risk pill (Low / Medium / High)
4. **Expanded (click)**: Confidence vs Evidence meter, missing context list, bias summary, and actions
5. **Recalibrate response**: Shows a safer version of the answer below the original
6. **What could make this wrong?**: Lists potential failure modes

## Backend Integration

1. Start the backend: `cd backend && uvicorn app.main:app --reload`
2. The extension waits for ChatGPT to finish streaming before extracting the response
3. The content script sends a message to the background service worker, which performs the fetch to `POST http://localhost:8000/analyze/text` (avoids Chrome blocking localhost from page context)
4. Falls back to mock data if the API is unavailable
