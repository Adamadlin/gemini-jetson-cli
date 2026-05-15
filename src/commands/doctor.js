import { execSync } from "child_process";
import chalk from "chalk";

function run(command) {
  try {
    return execSync(command, {
      encoding: "utf8"
    }).trim();
  } catch {
    return "Not available";
  }
}

export function getSystemContext() {
  return {
    Hostname: run("hostname"),

    Architecture: run("uname -m"),

    Kernel: run("uname -r"),

    "JetPack / L4T": run(
      "cat /etc/nv_tegra_release"
    ),

    "CUDA Symlink": run(
      "ls -l /usr/local/cuda 2>/dev/null"
    ),

    "CUDA Version File": run(
      "cat /usr/local/cuda/version.json 2>/dev/null || cat /usr/local/cuda/version.txt 2>/dev/null"
    ),

    NVCC: run(
      "which nvcc && nvcc --version || echo 'nvcc not found - CUDA compiler not installed or not in PATH'"
    ),

    "CUDA Packages": run(
      "dpkg -l | grep -E 'cuda|nvidia-l4t-cuda' | head -n 20"
    ),

    "NVIDIA Libraries": run(
      "ldconfig -p 2>/dev/null | grep -E 'libcuda|libnvinfer' | head -n 20"
    ),

    Docker: run(
      "docker --version"
    ),

    "Docker Runtime": run(
      "docker info 2>/dev/null | grep -i runtime"
    ),

    RAM: run(
      "free -h"
    ),

    Disk: run(
      "df -h / /ssd 2>/dev/null"
    ),

    PowerMode: run(
      "nvpmodel -q 2>/dev/null | head -n 10"
    )
  };
}

function printSection(title, content) {
  console.log(
    chalk.yellow.bold(`\n▶ ${title}`)
  );

  console.log(
    chalk.white(content)
  );
}

export function runDoctor(options = {}) {
  const ctx = getSystemContext();

if (options.json) {
  console.log(JSON.stringify(ctx, null, 2));
  return;
}

  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════════════╗
║         JETSON AI DOCTOR            ║
╚══════════════════════════════════════╝
`)
  );

  for (const [key, value] of Object.entries(ctx)) {
    printSection(key, value);
  }

  console.log(
    chalk.green.bold(
      "\n✔ Doctor scan complete.\n"
    )
  );
}
