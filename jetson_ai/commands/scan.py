import typer

from jetson_ai.core.workflow import run_basic_scan
from jetson_ai.ui.console import (
    print_title,
    print_ok,
    print_warn,
    print_info,
    print_error,
)

scan_app = typer.Typer(help="Scan the current Jetson/system environment.")


@scan_app.callback(invoke_without_command=True)
def scan():
    print_title(
        "System Scan",
        "scan → detect → suggest next action"
    )

    results = run_basic_scan()

    issues_found = False

    for result in results:
        if result.severity == "ok":
            print_ok(result.message)

        elif result.severity == "warning":
            issues_found = True
            print_warn(result.message)

            if result.suggested_fix:
                print_info(f"Suggested fix: {result.suggested_fix}")

        elif result.severity == "error":
            issues_found = True
            print_error(result.message)

            if result.suggested_fix:
                print_info(f"Suggested fix: {result.suggested_fix}")

        else:
            print_info(result.message)

    if issues_found:
        print_warn("Issues detected.")
        print_info("Next suggested command: jetson-ai fix")
    else:
        print_ok("No major issues detected.")
