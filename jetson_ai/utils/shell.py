import subprocess


def command_exists(command: str) -> bool:
    result = subprocess.run(
        ["which", command],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        text=True,
    )
    return result.returncode == 0
