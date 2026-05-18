import typer
from jetson_ai.ui.console import print_title, print_info

doctor_app = typer.Typer(help="Run deeper Jetson health checks.")


@doctor_app.callback(invoke_without_command=True)
def doctor():
    print_title("Doctor", "Deep Jetson diagnostics will be added here.")
    print_info("Planned checks: CUDA, JetPack, TensorRT, Docker runtime, memory, thermals.")
