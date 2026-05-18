from jetson_ai.core.diagnostic import DiagnosticResult
from jetson_ai.utils.shell import command_exists


def run_basic_scan() -> list[DiagnosticResult]:
    results: list[DiagnosticResult] = []

    if command_exists("python3"):
        results.append(DiagnosticResult("Python", "ok", "Python detected."))
    else:
        results.append(DiagnosticResult("Python", "error", "Python3 not found."))

    if command_exists("docker"):
        results.append(DiagnosticResult("Docker", "ok", "Docker detected."))
    else:
        results.append(
            DiagnosticResult(
                "Docker",
                "warning",
                "Docker not detected.",
                "Install Docker before running Jetson AI container workflows.",
            )
        )

    results.append(
        DiagnosticResult(
            "NVIDIA Runtime",
            "info",
            "NVIDIA Docker runtime check is not implemented yet.",
            "Implement Docker runtime analyzer.",
        )
    )

    return results
