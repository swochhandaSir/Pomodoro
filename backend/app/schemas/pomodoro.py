from pydantic import BaseModel


class PomodoroSessionBase(BaseModel):
    task_name: str
    duration_seconds: int
    notes: str | None = None


class PomodoroSessionCreate(PomodoroSessionBase):
    pass


class PomodoroSessionRead(PomodoroSessionBase):
    id: int

    class Config:
        from_attributes = True
