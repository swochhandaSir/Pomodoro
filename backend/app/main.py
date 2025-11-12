from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes.pomodoro import router as pomodoro_router
from .core.config import get_settings
from .db.models import Base
from .db.session import engine

settings = get_settings()

app = FastAPI(title="Pomodoro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pomodoro_router, prefix=settings.api_v1_prefix, tags=["pomodoro"])


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}
