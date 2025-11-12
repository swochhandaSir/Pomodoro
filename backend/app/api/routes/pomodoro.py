from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.pomodoro import PomodoroSessionCreate, PomodoroSessionRead
from ...services import pomodoro as pomodoro_service

router = APIRouter()


@router.get("/sessions", response_model=list[PomodoroSessionRead])
def list_sessions(db: Session = Depends(get_db)) -> list[PomodoroSessionRead]:
    """Return previously recorded sessions."""
    return pomodoro_service.list_sessions(db)


@router.post("/sessions", response_model=PomodoroSessionRead, status_code=201)
def create_session(
    payload: PomodoroSessionCreate,
    db: Session = Depends(get_db),
) -> PomodoroSessionRead:
    """Persist a new pomodoro session."""
    return pomodoro_service.create_session(db, payload)
