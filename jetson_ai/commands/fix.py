import typer

from jetson_ai.ui.console import print_title, print_info, print_warn, print_ok

fix_app = typer.Typer(help="Suggest or apply fixes after scanning.")


@fix_app.callback(invoke_without_command=True)
def fix(
    apply: bool = typer.Option(False, "--apply", help="Apply safe fixes automatically."),
):
    print_title("Fix Workflow", "scan → detect → propose → apply → rescan")

    print_warn("Detected issue: NVIDIA Docker runtime check is incomplete.")
    print_info("Suggested fix: implement Docker runtime analyzer.")

    if apply:
        print_info("Apply mode enabled.")
        print_warn("No real fix is implemented yet. This is the safe skeleton.")
        print_ok("Rescan step would run here after applying a fix.")
    else:
        print_info("To apply safe fixes later, run: jetson-ai fix --apply")
