from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Example: postgresql+psycopg://user:password@localhost:5432/portfolio
    database_url: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"
    cors_origins: str = "http://localhost:5173"  # comma-separated list
    github_username: str = ""
    github_token: str = ""  # server-side only; never sent to the client
    contact_rate_limit: str = "5/hour"
    demo_rate_limit: str = "60/minute"
    # Where ml/train_olist.py wrote model.joblib + metrics.json. Empty = <repo>/ml/artifacts.
    ml_artifacts_dir: str = ""
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=(".env", "../.env"), extra="ignore")

    @property
    def artifacts_path(self) -> Path:
        return Path(self.ml_artifacts_dir) if self.ml_artifacts_dir else Path(__file__).resolve().parents[3] / "ml" / "artifacts"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
