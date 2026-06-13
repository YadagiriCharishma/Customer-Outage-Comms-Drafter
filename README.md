# Customer Outage Comms Drafter

POC that transforms engineer-written technical outage timelines into three customer-facing status updates (initial, in-progress, resolved) with adjustable tone and automatic severity detection.

## Architecture

```
Engineer → Web UI (React) → FastAPI → LangChain/OpenAI Agent → Customer Drafts
                                      ↓
                                   SQLite
```

**Agent pipeline:**
1. Analyze outage details from the technical timeline
2. Detect severity (low / medium / high / critical)
3. Apply selected tone (calm / empathetic / concise)
4. Generate three phase-specific customer messages

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, HTML/CSS |
| Backend | Python, FastAPI |
| AI | OpenAI GPT, LangChain, prompt engineering |
| Storage | SQLite |

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt
copy .env.example .env
# Edit .env and set OPENAI_API_KEY (optional — runs in demo mode without it)

uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**

### Demo mode

If `OPENAI_API_KEY` is not set, the app uses heuristic severity detection and template-based drafts so you can demo the UI without API costs.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check and AI mode |
| `POST` | `/api/generate` | Generate drafts from timeline + tone |
| `GET` | `/api/history` | List saved generation history |
| `GET` | `/api/history/{id}` | Get a specific saved record |

### Example request

```json
POST /api/generate
{
  "timeline": "14:02 — API errors spiked\n14:25 — Root cause identified\n14:55 — Resolved",
  "tone": "empathetic"
}
```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry
│   │   ├── routes/drafts.py  # API routes
│   │   ├── services/agent.py # LangChain prompts & generation
│   │   ├── models.py         # SQLite ORM
│   │   └── schemas.py        # Pydantic models
│   └── requirements.txt
└── frontend/
    └── src/
        ├── App.jsx
        └── components/       # Timeline, tone, drafts UI
```
