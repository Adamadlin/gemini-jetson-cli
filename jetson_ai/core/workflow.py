from jetson_ai.core.diagnostic import DiagnosticResult
from jetson_ai.analyzers.docker_analyzer import check_docker
from jetson_ai.analyzers.jetson_analyzer import check_jetson_system
from jetson_ai.utils.shell import command_exists


def run_basic_scan() -> list[DiagnosticResult]:
    results: list[DiagnosticResult] = []

    # Python check
    if command_exists("python3"):
        results.append(
            DiagnosticResult(
                "Python",
                "ok",
                "Python detected.",
            )
        )
    else:
        results.append(
            DiagnosticResult(
                "Python",
                "error",
                "Python3 not found.",
            )
        )

    # Docker analyzer
    results.extend(check_docker())

    # Jetson analyzer
    results.extend(check_jetson_system())

    return results
