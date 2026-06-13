from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.drafts import router as drafts_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Customer Outage Comms Drafter",
    description="AI agent that transforms technical outage timelines into customer-facing status updates.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(drafts_router)


@app.get("/api/health")
def health():
    from app.config import settings

    return {
        "status": "ok",
        "ai_mode": "openai" if settings.openai_api_key else "mock",
    }
