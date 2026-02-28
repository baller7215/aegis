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

## Current State

- UI uses mock analysis data
- Backend integration (POST to `/analyze`) is TODO
- ChatGPT DOM selectors may need updates if OpenAI changes their markup
