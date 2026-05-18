import os
import subprocess

from jetson_ai.core.diagnostic import DiagnosticResult


def check_jetson_system() -> list[DiagnosticResult]:
    results: list[DiagnosticResult] = []

    # Check Jetson release file
    if os.path.exists("/etc/nv_tegra_release"):
        try:
            with open("/etc/nv_tegra_release", "r") as file:
                release = file.read().strip()

            results.append(
                DiagnosticResult(
                    "JetPack",
                    "ok",
                    f"Jetson release detected: {release}",
                )
            )

        except Exception as error:
            results.append(
                DiagnosticResult(
                    "JetPack",
                    "warning",
                    f"Failed reading Jetson release info: {error}",
                )
            )

    else:
        results.append(
            DiagnosticResult(
                "JetPack",
                "warning",
                "Jetson release file not found.",
                "This may not be a Jetson device.",
            )
        )

    # CUDA check
    cuda = subprocess.run(
        ["nvcc", "--version"],
        capture_output=True,
        text=True,
    )

    if cuda.returncode == 0:
        last_line = cuda.stdout.strip().split("\n")[-1]

        results.append(
            DiagnosticResult(
                "CUDA",
                "ok",
                f"CUDA detected: {last_line}",
            )
        )

    else:
        results.append(
            DiagnosticResult(
                "CUDA",
                "warning",
                "CUDA toolkit not detected.",
                "Install CUDA toolkit or verify JetPack installation.",
            )
        )

    # Swap check
    try:
        with open("/proc/swaps", "r") as file:
            swaps = file.readlines()

        if len(swaps) > 1:
            results.append(
                DiagnosticResult(
                    "Swap",
                    "ok",
                    "Swap memory is configured.",
                )
            )
        else:
            results.append(
                DiagnosticResult(
                    "Swap",
                    "warning",
                    "No swap memory configured.",
                    "Configure swap for large AI models.",
                )
            )

    except Exception as error:
        results.append(
            DiagnosticResult(
                "Swap",
                "warning",
                f"Failed checking swap status: {error}",
            )
        )

    # NVMe check
    nvme_exists = os.path.exists("/dev/nvme0n1")

    if nvme_exists:
        results.append(
            DiagnosticResult(
                "NVMe",
                "ok",
                "NVMe drive detected.",
            )
        )
    else:
        results.append(
            DiagnosticResult(
                "NVMe",
                "warning",
                "No NVMe drive detected.",
                "Using NVMe is recommended for AI workloads.",
            )
        )

    return results
