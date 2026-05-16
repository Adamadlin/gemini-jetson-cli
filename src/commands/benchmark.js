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

function section(title, value) {
  console.log(
    chalk.yellow.bold(`\n▶ ${title}`)
  );

  console.log(value || "Not available");
}

export async function runBenchmark() {
  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════════════╗
║       JETSON AI BENCHMARK           ║
╚══════════════════════════════════════╝
`)
  );

  section(
    "Timestamp",
    new Date().toISOString()
  );

  section(
    "JetPack",
    run("cat /etc/nv_tegra_release")
  );

  section(
    "Power Mode",
    run("nvpmodel -q")
  );

  section(
    "CPU Info",
    run("lscpu | head -n 20")
  );

  section(
    "Memory",
    run("free -h")
  );

  section(
    "Disk",
    run("df -h / /ssd 2>/dev/null")
  );

  section(
    "CUDA",
    run("nvcc --version")
  );

  section(
    "Docker",
    run("docker --version")
  );

  section(
    "Docker NVIDIA Runtime",
    run("docker info | grep -i runtime")
  );

  section(
    "Thermals",
    run("cat /sys/devices/virtual/thermal/thermal_zone*/temp 2>/dev/null | head")
  );

  section(
    "tegrastats",
    run("tegrastats --interval 1000 --count 1")
  );

  console.log(
    chalk.green.bold("\n✔ Benchmark snapshot complete.\n")
  );
}
