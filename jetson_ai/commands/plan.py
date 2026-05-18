import typer

from rich.table import Table

from jetson_ai.analyzers.project_analyzer import analyze_project
from jetson_ai.ui.console import console, print_title, print_info, print_warn, print_ok

plan_app = typer.Typer(help="Plan a project or next development step.")


@plan_app.callback(invoke_without_command=True)
def plan():
    print_title(
        "Project Planner",
        "scan project → detect stack → suggest next steps"
    )

    results = analyze_project()

    table = Table(title="Project Analysis")
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
        print_warn("Project planner detected improvement opportunities.")
    else:
        print_ok("Project structure looks healthy.")

    print_info("Future versions will generate architecture-aware suggestions.")
