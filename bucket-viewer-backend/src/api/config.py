from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    allowed_origins: List[str] = []

    model_config = SettingsConfigDict(case_sensitive=False)
    # model_config = SettingsConfigDict(env_file=".env.prod")
