import logging

from fastapi import APIRouter, HTTPException, Request

from app.core.config import get_settings
from app.core.rate_limit import limiter
from app.schemas.demo import DemoSchema, PredictRequest, PredictResponse
from app.services.demos.base import DemoInputError, DemoUnavailable
from app.services.demos.registry import get_demo

log = logging.getLogger(__name__)
router = APIRouter(prefix="/api/projects", tags=["interactive demos"])

UNAVAILABLE = "Interactive demo is temporarily unavailable."


def _demo_or_404(slug: str):
    demo = get_demo(slug)
    if demo is None:
        raise HTTPException(status_code=404, detail="This project has no interactive demo.")
    return demo


@router.get("/{slug}/demo", response_model=DemoSchema)
def demo_schema(slug: str) -> DemoSchema:
    """Form definition (fields, ranges) and model information for a project's demo."""
    try:
        return _demo_or_404(slug).schema()
    except DemoUnavailable:
        log.exception("Demo %s unavailable", slug)
        raise HTTPException(status_code=503, detail=UNAVAILABLE)


@router.post("/{slug}/predict", response_model=PredictResponse)
@limiter.limit(get_settings().demo_rate_limit)
def predict(slug: str, request: Request, body: PredictRequest) -> PredictResponse:
    try:
        return _demo_or_404(slug).predict(body.inputs)
    except DemoInputError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except DemoUnavailable:
        log.exception("Demo %s unavailable", slug)
        raise HTTPException(status_code=503, detail=UNAVAILABLE)
