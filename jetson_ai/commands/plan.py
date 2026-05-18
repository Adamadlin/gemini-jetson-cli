import typer
from jetson_ai.ui.console import print_title, print_info

plan_app = typer.Typer(help="Plan a project or next development step.")


@plan_app.callback(invoke_without_command=True)
def plan():
    print_title("Project Planner", "plan → debug → execute")
    print_info("Project-aware planning will be added here.")
