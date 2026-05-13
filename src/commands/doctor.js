import { execSync } from "child_process";

function run(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "Not available";
  }
}

export function getSystemContext() {
  return {
    hostname: run("hostname"),
    architecture: run("uname -m"),
    kernel: run("uname -r"),
    l4t: run("cat /etc/nv_tegra_release"),
    cudaPath: run("ls -l /usr/local/cuda 2>/dev/null"),
    cudaPackages: run("dpkg -l | grep -E 'cuda|nvidia-l4t-cuda' | head -n 20"),
    docker: run("docker --version"),
    dockerRuntime: run("docker info 2>/dev/null | grep -i runtime"),
    ram: run("free -h"),
    disk: run("df -h / /ssd 2>/dev/null"),
    powerMode: run("nvpmodel -q 2>/dev/null | head -n 10"),
    temperature: run("cat /sys/devices/virtual/thermal/thermal_zone*/temp 2>/dev/null | head")
  };
}

export function runDoctor() {
  const ctx = getSystemContext();

  console.log("\nJetson AI Doctor\n");

  for (const [key, value] of Object.entries(ctx)) {
    console.log(`\n=== ${key} ===`);
    console.log(value);
  }

  console.log("\nDoctor complete.\n");
}  
