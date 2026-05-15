import { execSync } from "child_process";
import chalk from "chalk";

function run(command) {
  try {
    return execSync(command, {
      encoding: "utf8"
    }).trim();
  } catch {
    return null;
  }
}

function section(title, value) {
  console.log(chalk.yellow.bold(`\n▶ ${title}`));
  console.log(value || "Not available");
}

function applyCudaFix() {
  run(`grep -qxF 'export PATH=/usr/local/cuda/bin:$PATH' ~/.bashrc || echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc`);

  run(`grep -qxF 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' ~/.bashrc || echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc`);

  console.log(
    chalk.green.bold("\n✔ CUDA PATH fix applied.\n")
  );

  console.log("Run:");
  console.log(chalk.cyan("source ~/.bashrc"));
  console.log(chalk.cyan("nvcc --version"));
}

function applyDockerFix() {
  console.log(
    chalk.cyan.bold("\nApplying Docker fixes...\n")
  );

  run("sudo systemctl start docker");
  run("sudo usermod -aG docker $USER");

  console.log(
    chalk.green.bold("\n✔ Docker fixes applied.\n")
  );

  console.log("You may need to log out and back in for docker group changes.");
}

export function runFix(target, options = {}) {
  console.log(
    chalk.cyan.bold(`
JETSON AI FIXER — ${target.toUpperCase()}
`)
  );

  if (target === "cuda") {
    const nvcc = run("which nvcc");
    const cudaExists = run("ls /usr/local/cuda/bin/nvcc");

    section("CUDA Symlink", run("ls -l /usr/local/cuda"));
    section("Current nvcc", nvcc || "nvcc not found in PATH");
    section("/usr/local/cuda/bin/nvcc exists", cudaExists ? "yes" : "no");
    section("Current PATH", process.env.PATH);
    section("Current LD_LIBRARY_PATH", process.env.LD_LIBRARY_PATH || "empty");

    if (nvcc) {
      console.log(
        chalk.green.bold("\n✔ CUDA nvcc is already available.\n")
      );

      console.log(run("nvcc --version"));
      return;
    }

    if (cudaExists) {
      console.log(
        chalk.green.bold("\n✔ Fix available: CUDA exists, but nvcc is not in PATH.\n")
      );

      if (options.apply) {
        applyCudaFix();
        return;
      }

      console.log("Run these commands:\n");

      console.log(chalk.cyan("echo 'export PATH=/usr/local/cuda/bin:$PATH' >> ~/.bashrc"));
      console.log(chalk.cyan("echo 'export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH' >> ~/.bashrc"));
      console.log(chalk.cyan("source ~/.bashrc"));
      console.log(chalk.cyan("nvcc --version"));

      console.log("\nWhy:");
      console.log("CUDA is installed, but your shell cannot find CUDA compiler binaries.");
      return;
    }

    console.log(
      chalk.red.bold("\n✖ CUDA toolkit does not appear installed.\n")
    );

    return;
  }

  if (target === "docker") {
    const dockerVersion = run("docker --version");
    const dockerRuntime = run("docker info | grep -i runtime");

    section("Docker Version", dockerVersion || "Docker not installed");
    section("Docker Runtime", dockerRuntime || "No runtime info");

    if (!dockerVersion) {
      console.log(
        chalk.red.bold("\n✖ Docker does not appear installed.\n")
      );

      return;
    }

    if (options.apply) {
      applyDockerFix();
      return;
    }

    console.log(
      chalk.green.bold("\n✔ Docker detected.\n")
    );

    console.log("Suggested fixes:\n");

    console.log(chalk.cyan("sudo systemctl start docker"));
    console.log(chalk.cyan("sudo usermod -aG docker $USER"));

    console.log("\nWhy:");
    console.log("Ensures Docker daemon is running and user has Docker permissions.");

    return;
  }

  console.log(
    chalk.red.bold("\nUnknown fix target.\n")
  );
}
