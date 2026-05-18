import subprocess

from jetson_ai.core.diagnostic import DiagnosticResult
from jetson_ai.utils.shell import command_exists


def check_docker() -> list[DiagnosticResult]:
    results: list[DiagnosticResult] = []

    # Check docker command exists
    if not command_exists("docker"):
        results.append(
            DiagnosticResult(
                "Docker",
                "error",
                "Docker is not installed.",
                "Install Docker with: sudo apt install docker.io",
            )
        )
        return results

    results.append(
        DiagnosticResult(
            "Docker",
            "ok",
            "Docker command detected.",
        )
    )

    # Check docker daemon
    daemon = subprocess.run(
        ["systemctl", "is-active", "--quiet", "docker"]
    )

    if daemon.returncode == 0:
        results.append(
            DiagnosticResult(
                "Docker Daemon",
                "ok",
                "Docker daemon is running.",
            )
        )
    else:
        results.append(
            DiagnosticResult(
                "Docker Daemon",
                "error",
                "Docker daemon is not running.",
                "Start Docker using: sudo systemctl start docker",
            )
        )

    # Check NVIDIA runtime
    runtime_check = subprocess.run(
        ["docker", "info"],
        capture_output=True,
        text=True,
    )

    output = runtime_check.stdout.lower()

    if "nvidia" in output:
        results.append(
            DiagnosticResult(
                "NVIDIA Runtime",
                "ok",
                "NVIDIA container runtime detected.",
            )
        )
    else:
        results.append(
            DiagnosticResult(
                "NVIDIA Runtime",
                "warning",
                "NVIDIA runtime not detected in Docker.",
                "Install and configure NVIDIA Container Toolkit.",
            )
        )

    return results
