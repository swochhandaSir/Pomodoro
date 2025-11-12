from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class PomodoroSession(Base):
    __tablename__ = "pomodoro_sessions"

    id = Column(Integer, primary_key=True, index=True)
    task_name = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    notes = Column(String, nullable=True)
