import html

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ContactIn(BaseModel):
    """Mirrors the Zod schema in frontend/src/sections/Contact.tsx."""

    name: str = Field(min_length=1, max_length=100,pattern=r"^[A-Za-z]+(?: [A-Za-z]+)*$",)
    email: EmailStr
    message: str = Field(min_length=10, max_length=2000)
    website: str | None = Field(default=None, max_length=200)  # honeypot

    @field_validator("name", "message")
    @classmethod
    def clean(cls, v: str) -> str:
        # Strip control characters and escape HTML so stored text is safe to render anywhere.
        v = "".join(ch for ch in v if ch == "\n" or ch.isprintable()).strip()
        return html.escape(v, quote=False)


class ContactOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    ok: bool = True
