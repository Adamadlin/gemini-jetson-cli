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

function renderMonitor() {
  console.clear();

  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════════════╗
║        JETSON AI MONITOR            ║
╚══════════════════════════════════════╝
`)
  );

  section(
    "Uptime / Load",
    run("uptime")
  );

  section(
    "CPU",
    run("top -bn1 | head -n 5")
  );

  section(
    "RAM",
    run("free -h")
  );

  section(
    "Disk",
    run("df -h / /ssd 2>/dev/null")
  );

  section(
    "Power Mode",
    run("nvpmodel -q 2>/dev/null | head -n 10")
  );

  section(
    "Temperatures",
    run("cat /sys/devices/virtual/thermal/thermal_zone*/temp 2>/dev/null | head -n 10")
  );

  section(
    "Docker Containers",
    run("docker ps --format 'table {{.Names}}\\t{{.Status}}\\t{{.Ports}}' 2>/dev/null")
  );

  console.log(
    chalk.green.bold("\n✔ Monitor snapshot complete.\n")
  );
}

export function runMonitor(options = {}) {
  renderMonitor();

  if (options.watch) {
    setInterval(() => {
      renderMonitor();
    }, 3000);
  }
}
