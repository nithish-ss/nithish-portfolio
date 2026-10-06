"""Schemas for interactive ML demos. Mirrored by frontend/src/demo/types.ts."""
from typing import Literal

from pydantic import BaseModel, Field

FieldValue = float | str | list[str]


class DemoOption(BaseModel):
    value: str
    label: str


class DemoField(BaseModel):
    key: str
    label: str
    kind: Literal["number", "select", "multiselect"]
    help: str | None = None
    unit: str | None = None
    min: float | None = None
    max: float | None = None
    step: float | None = None
    default: FieldValue | None = None
    options: list[DemoOption] | None = None


class ModelInfo(BaseModel):
    name: str
    dataset: str
    validation: str | None = None
    metrics: dict[str, float] = Field(default_factory=dict)  # only values measured by the training script
    notes: list[str] = Field(default_factory=list)


class DemoSchema(BaseModel):
    slug: str
    title: str
    intro: str
    submit_label: str = "Run prediction"
    fields: list[DemoField]
    model: ModelInfo


class PredictRequest(BaseModel):
    inputs: dict[str, FieldValue]


class DemoDetail(BaseModel):
    label: str
    value: str


class PredictResponse(BaseModel):
    prediction: str
    confidence: float | None = Field(default=None, ge=0, le=1)
    explanation: str
    details: list[DemoDetail] = Field(default_factory=list)
