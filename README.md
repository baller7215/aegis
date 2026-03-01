# Aegis

Inline AI safety analysis for ChatGPT. Aegis injects a compact panel below each ChatGPT response with risk assessment, confidence vs evidence calibration, and structured analysis (assumptions, bias, failure modes).

## Quick start

1. **Backend** – see [backend/README.md](backend/README.md)
   ```bash
   cd backend && pip install -r requirements.txt
   # Set OPENAI_API_KEY in .env
   uvicorn app.main:app --reload
   ```

2. **Frontend** – see [frontend/README.md](frontend/README.md)
   ```bash
   cd frontend
   cp .env.example .env   # Set API_BASE_URL
   npm install && npm run build
   ```
   Load `frontend/dist` as an unpacked extension in Chrome.

## Project structure

```
aegis/
├── backend/    # FastAPI API (analyze text, recalibrate)
├── frontend/   # Chrome extension (content script + popup)
└── README.md   # this file
```

- **backend** – Python FastAPI service. Uses heuristics + GPT-4o-mini for analysis; sentence-transformers for semantic confidence.
- **frontend** – Chrome extension that runs on chat.openai.com and chatgpt.com, sends text to the backend, and renders analysis panels.

## License

MIT
