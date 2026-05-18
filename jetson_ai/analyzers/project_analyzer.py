import os

from jetson_ai.core.diagnostic import DiagnosticResult


def analyze_project() -> list[DiagnosticResult]:
    results: list[DiagnosticResult] = []

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
    if "README.md" not in cwd_files:
        results.append(
            DiagnosticResult(
                "README",
                "warning",
                "README.md missing.",
                "Create a proper project README.",
            )
        )

    if not results:
        results.append(
            DiagnosticResult(
                "Project Detection",
                "warning",
                "No known project structure detected.",
            )
        )

    return results
