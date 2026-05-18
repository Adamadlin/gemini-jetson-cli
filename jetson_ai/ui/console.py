from rich.console import Console
from rich.panel import Panel

console = Console()


def print_title(title: str, subtitle: str = "") -> None:
    content = title if not subtitle else f"{title}\n{subtitle}"
    console.print(Panel(content, title="Jetson AI", border_style="cyan"))


def print_ok(message: str) -> None:
    console.print(f"[green][OK][/green] {message}")


def print_warn(message: str) -> None:
    console.print(f"[yellow][WARN][/yellow] {message}")


def print_info(message: str) -> None:
    console.print(f"[blue][INFO][/blue] {message}")


def print_error(message: str) -> None:
    console.print(f"[red][ERROR][/red] {message}")
