from sqlalchemy.orm import Session

from ..db import models
from ..schemas.pomodoro import PomodoroSessionCreate, PomodoroSessionRead


def create_session(db: Session, payload: PomodoroSessionCreate) -> PomodoroSessionRead:
    record = models.PomodoroSession(**payload.model_dump())
    db.add(record)
    db.commit()
    db.refresh(record)
    return PomodoroSessionRead.model_validate(record)


def list_sessions(db: Session) -> list[PomodoroSessionRead]:
    records = db.query(models.PomodoroSession).all()
    return [PomodoroSessionRead.model_validate(record) for record in records]
