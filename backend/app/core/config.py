from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    api_v1_prefix: str = "/api"
    database_url: str = "sqlite:///./pomodoro.db"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
