import os

from jetson_ai.core.diagnostic import DiagnosticResult


def analyze_project() -> tuple[list[DiagnosticResult], list[str]]:
    results: list[DiagnosticResult] = []
    next_actions: list[str] = []

    cwd_files = os.listdir(".")

    # Python project
    if "pyproject.toml" in cwd_files:
        results.append(
            DiagnosticResult(
                "Python Project",
                "ok",
                "Detected pyproject.toml",
            )
        )

    # Node.js project
    if "package.json" in cwd_files:
        results.append(
            DiagnosticResult(
                "Node.js Project",
                "ok",
                "Detected package.json",
            )
        )

    # Docker Compose
    if (
        "docker-compose.yml" in cwd_files
        or "docker-compose.yaml" in cwd_files
    ):
        results.append(
            DiagnosticResult(
                "Docker Compose",
                "ok",
                "Detected Docker Compose configuration.",
            )
        )
    else:
        next_actions.append(
            "Consider adding Docker Compose support."
        )

    # Git repo
    if ".git" in cwd_files:
        results.append(
            DiagnosticResult(
                "Git Repository",
                "ok",
                "Git repository detected.",
            )
        )

    # README
    if "README.md" in cwd_files:
        results.append(
            DiagnosticResult(
                "README",
                "ok",
                "README.md detected.",
            )
        )
    else:
        results.append(
            DiagnosticResult(
                "README",
                "warning",
                "README.md missing.",
                "Create a proper project README.",
            )
        )

        next_actions.append(
            "Create a stronger recruiter-focused README."
        )

    # Tests
    if os.path.exists("tests"):
        results.append(
            DiagnosticResult(
                "Tests",
                "ok",
                "tests/ directory detected.",
            )
        )
    else:
        results.append(
            DiagnosticResult(
                "Tests",
                "warning",
                "No tests directory detected.",
                "Add automated tests.",
            )
        )

        next_actions.append(
            "Add unit and integration tests."
        )

    # GitHub Actions
    github_exists = os.path.exists(".github/workflows")

    if github_exists:
        results.append(
            DiagnosticResult(
                "CI/CD",
                "ok",
                "GitHub Actions workflows detected.",
            )
        )
    else:
        results.append(
            DiagnosticResult(
                "CI/CD",
                "warning",
                "No GitHub Actions workflows detected.",
                "Add CI/CD pipeline.",
            )
        )

        next_actions.append(
            "Add GitHub Actions CI pipeline."
        )

    # Default roadmap suggestions
    next_actions.append(
        "Improve analyzer depth for architecture detection."
    )

    next_actions.append(
        "Add intelligent fix recommendation engine."
    )

    return results, next_actions
