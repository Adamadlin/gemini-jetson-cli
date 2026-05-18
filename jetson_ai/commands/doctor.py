import typer

from rich.table import Table

from jetson_ai.core.workflow import run_basic_scan
from jetson_ai.ui.console import console, print_title, print_info, print_ok, print_warn

doctor_app = typer.Typer(help="Run deeper Jetson health checks.")


@doctor_app.callback(invoke_without_command=True)
def doctor():
    print_title("Doctor", "organized health report → recommendations")

    results = run_basic_scan()

    table = Table(title="Jetson Health Report")
    table.add_column("Component", style="cyan")
    table.add_column("Status")
    table.add_column("Message")
    table.add_column("Suggested Fix")

    issues_found = False

    for result in results:
        if result.severity in ["warning", "error"]:
            issues_found = True

        status = {
            "ok": "[green]OK[/green]",
            "info": "[blue]INFO[/blue]",
            "warning": "[yellow]WARN[/yellow]",
            "error": "[red]ERROR[/red]",
        }.get(result.severity, "[blue]INFO[/blue]")

        table.add_row(
            result.name,
            status,
            result.message,
            result.suggested_fix or "-",
        )

    console.print(table)

    if issues_found:
        print_warn("Doctor found issues that may need attention.")
        print_info("Recommended next command: jetson-ai fix")
    else:
        print_ok("Doctor report is clean.")
        print_info("Recommended next step: begin benchmarking or project analysis.")
