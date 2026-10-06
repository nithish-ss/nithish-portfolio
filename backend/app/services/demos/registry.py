"""Maps a project slug (frontend/src/data/projects/<slug>.ts) to its demo model. One line per interactive demo."""
from app.services.demos.base import DemoModel
from app.services.demos.olist_demo import OlistDemo

_DEMOS: dict[str, DemoModel] = {
    OlistDemo.slug: OlistDemo(),
    # "careerpath-ai": CareerPathDemo(),
}


def get_demo(slug: str) -> DemoModel | None:
    return _DEMOS.get(slug)
