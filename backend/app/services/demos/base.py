from typing import Protocol

from app.schemas.demo import DemoSchema, FieldValue, PredictResponse


class DemoUnavailable(Exception):
    """The model or its artifacts are not available. Surfaced to users as a friendly 503."""


class DemoInputError(Exception):
    """The caller sent invalid inputs. The message is safe to show to users."""


class DemoModel(Protocol):
    """One implementation per project. Register it in registry.py under the project slug."""

    def schema(self) -> DemoSchema: ...

    def predict(self, inputs: dict[str, FieldValue]) -> PredictResponse: ...
