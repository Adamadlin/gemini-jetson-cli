import typer

from jetson_ai.commands.scan import scan_app
from jetson_ai.commands.fix import fix_app
from jetson_ai.commands.doctor import doctor_app
from jetson_ai.commands.plan import plan_app

app = typer.Typer(
    name="jetson-ai",
    help="AI-powered Jetson diagnostics, planning, and repair assistant."
)

app.add_typer(scan_app, name="scan")
app.add_typer(fix_app, name="fix")
app.add_typer(doctor_app, name="doctor")
app.add_typer(plan_app, name="plan")


@app.callback()
def main():
    pass
