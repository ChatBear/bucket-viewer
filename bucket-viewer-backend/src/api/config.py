from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    allowed_origins: List[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(case_sensitive=False)
