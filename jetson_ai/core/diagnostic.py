from dataclasses import dataclass
from typing import Literal

Severity = Literal["ok", "info", "warning", "error"]


@dataclass
class DiagnosticResult:
    name: str
    severity: Severity
    message: str
    suggested_fix: str | None = None
