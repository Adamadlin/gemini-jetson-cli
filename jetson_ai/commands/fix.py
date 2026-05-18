import typer

from jetson_ai.core.workflow import run_basic_scan
from jetson_ai.ui.console import print_title, print_info, print_warn, print_ok, print_error

fix_app = typer.Typer(help="Suggest or apply fixes after scanning.")


@fix_app.callback(invoke_without_command=True)
def fix(
    apply: bool = typer.Option(False, "--apply", help="Apply safe fixes automatically."),
):
    print_title("Fix Workflow", "scan → detect → propose → apply → rescan")

    results = run_basic_scan()

    issues = [
        result
        for result in results
        if result.severity in ["warning", "error"]
    ]

    if not issues:
        print_ok("No fixable issues detected.")
        print_info("Your current system scan looks clean.")
        return

    print_warn(f"Detected {len(issues)} issue(s).")

    for issue in issues:
        if issue.severity == "error":
            print_error(issue.message)
        else:
            print_warn(issue.message)

        if issue.suggested_fix:
            print_info(f"Suggested fix: {issue.suggested_fix}")
        else:
            print_info("No suggested fix available yet.")

    if not apply:
        print_info("Review the suggestions above.")
        print_info("To apply safe fixes later, run: jetson-ai fix --apply")
        return

    print_info("Apply mode enabled.")

    for issue in issues:
        print_warn(f"Skipping automatic fix for: {issue.name}")
        print_info("Reason: automatic fix execution is not implemented safely yet.")

    print_info("Running scan again after apply attempt...")

    rescan_results = run_basic_scan()
    remaining_issues = [
        result
        for result in rescan_results
        if result.severity in ["warning", "error"]
    ]

    if not remaining_issues:
        print_ok("Rescan clean. No major issues detected.")
    else:
        print_warn(f"Rescan found {len(remaining_issues)} remaining issue(s).")
