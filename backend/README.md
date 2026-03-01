# Aegis Backend

FastAPI service that analyzes AI-generated text and returns risk scores, calibration signals, and recalibrated output.

## Prerequisites

- Python 3.11+
- OpenAI API key

## Setup

1. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create `.env` and set your API key:
   ```
   OPENAI_API_KEY=sk-...
   ```

## Run locally

```bash
uvicorn app.main:app --reload
```

API docs at `http://localhost:8000/docs`

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/analyze/text` | Analyze text – returns risk, heuristics, LLM analysis |
| POST | `/recalibrate` | Recalibrate text – returns evidence-aligned rewrite |

### `/analyze/text` request

```json
{
  "text": "string",
  "numberOfSourcesUsed": 0
}
```

### `/recalibrate` request

```json
{
  "text": "string",
  "confidence": 0.8,
  "evidence": 0.4,
  "domain": "general",
  "decision_delegation_detected": false
}
```

## Deploy to Railway

1. Create a Railway project → Deploy from GitHub
2. Set **Root Directory** to `backend`
3. Add `OPENAI_API_KEY` in Variables
4. Generate a domain in Networking
5. Use the Railway URL as `API_BASE_URL` in the frontend `.env`

Uses the included `Dockerfile` (CPU-only PyTorch to avoid build timeouts).
