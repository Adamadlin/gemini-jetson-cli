import fs from "fs";
import path from "path";
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

function collectBenchmarkData() {
  return {
    timestamp: new Date().toISOString(),

    jetpack: run("cat /etc/nv_tegra_release"),

    powerMode: run("nvpmodel -q"),

    cpuInfo: run("lscpu | head -n 20"),

    memory: run("free -h"),

    disk: run("df -h / /ssd 2>/dev/null"),

    cuda: run("nvcc --version"),

    docker: run("docker --version"),

    dockerRuntime: run(
      "docker info | grep -i runtime"
    ),

    thermals: run(
      "cat /sys/devices/virtual/thermal/thermal_zone*/temp 2>/dev/null | head"
    ),

    tegrastats: run(

  "timeout 2 tegrastats --interval 1000"

)
  };
}

function saveBenchmark(data) {
  const benchmarksDir = path.join(
    process.cwd(),
    "benchmarks"
  );

  if (!fs.existsSync(benchmarksDir)) {
    fs.mkdirSync(benchmarksDir);
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, "-");

  const filename =
    `benchmark-${timestamp}.json`;

  const filepath = path.join(
    benchmarksDir,
    filename
  );

  fs.writeFileSync(
    filepath,
    JSON.stringify(data, null, 2)
  );

  return filepath;
}

export async function runBenchmark(options = {}) {
  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════════════╗
║       JETSON AI BENCHMARK           ║
╚══════════════════════════════════════╝
`)
  );

  const data = collectBenchmarkData();

  section("Timestamp", data.timestamp);

  section("JetPack", data.jetpack);

  section("Power Mode", data.powerMode);

  section("CPU Info", data.cpuInfo);

  section("Memory", data.memory);

  section("Disk", data.disk);

  section("CUDA", data.cuda);

  section("Docker", data.docker);

  section(
    "Docker NVIDIA Runtime",
    data.dockerRuntime
  );

  section("Thermals", data.thermals);

  section("tegrastats", data.tegrastats);

  if (options.save) {
    const filepath = saveBenchmark(data);

    console.log(
      chalk.green.bold(
        `\n✔ Benchmark saved:\n${filepath}`
      )
    );
  }

  console.log(
    chalk.green.bold(
      "\n✔ Benchmark snapshot complete.\n"
    )
  );
}
