from dataclasses import dataclass


@dataclass
class FixPlan:
    issue: str
    explanation: str
    command: str | None = None
    safe_to_apply: bool = False
