import { execSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import chalk from "chalk";

function run(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

function print(title, value) {
  console.log(chalk.yellow.bold(`\n▶ ${title}`));
  console.log(value || "Not available");
}

function appendIfMissing(filePath, line) {
  const existing = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : "";

  if (!existing.includes(line)) {
    fs.appendFileSync(filePath, `\n${line}\n`);
    return true;
  }

  return false;
}

export function runFix(target, options = {}) {
  if (target !== "cuda") {
    console.error("Supported fix targets: cuda");
    process.exit(1);
  }

  console.log(chalk.cyan.bold("\nJETSON AI FIXER — CUDA\n"));

  const cudaPath = run("ls -l /usr/local/cuda 2>/dev/null");
  const nvccPath = run("which nvcc");
  const cudaBinExists = run("test -x /usr/local/cuda/bin/nvcc && echo yes || echo no");
  const currentPath = run("echo $PATH");
  const currentLdPath = run("echo $LD_LIBRARY_PATH");

  print("CUDA Symlink", cudaPath);
  print("Current nvcc", nvccPath || "nvcc not found in PATH");
  print("/usr/local/cuda/bin/nvcc exists", cudaBinExists);
  print("Current PATH", currentPath);
  print("Current LD_LIBRARY_PATH", currentLdPath || "empty");

  if (nvccPath) {
    console.log(chalk.green.bold("\n✔ CUDA nvcc is already available.\n"));
    console.log(run("nvcc --version"));
    return;
  }

  if (cudaBinExists === "yes" && !nvccPath) {
    console.log(chalk.green.bold("\n✔ Fix available: CUDA exists, but nvcc is not in PATH.\n"));

    const bashrcPath = path.join(os.homedir(), ".bashrc");
    const backupPath = path.join(os.homedir(), ".bashrc.jetson-ai-backup");

    const pathLine = "export PATH=/usr/local/cuda/bin:$PATH";
    const ldPathLine = "export LD_LIBRARY_PATH=/usr/local/cuda/lib64:$LD_LIBRARY_PATH";

    if (!options.apply) {
      console.log("Preview mode. No changes were made.\n");
      console.log("To apply the fix, run:\n");
      console.log(chalk.white("jetson-ai fix cuda --apply\n"));

      console.log("This will:");
      console.log(`- Back up ${bashrcPath}`);
      console.log("- Add CUDA bin to PATH");
      console.log("- Add CUDA lib64 to LD_LIBRARY_PATH");
      console.log("- Ask you to reload your shell");
      return;
    }

    fs.copyFileSync(bashrcPath, backupPath);

    const changedPath = appendIfMissing(bashrcPath, pathLine);
    const changedLdPath = appendIfMissing(bashrcPath, ldPathLine);

    console.log(chalk.green.bold("\n✔ Applied CUDA PATH fix.\n"));
    console.log(`Backup created: ${backupPath}`);

    console.log("\nChanges:");
    console.log(`PATH line added: ${changedPath ? "yes" : "already existed"}`);
    console.log(`LD_LIBRARY_PATH line added: ${changedLdPath ? "yes" : "already existed"}`);

    console.log(chalk.yellow.bold("\nReload your shell now:"));
    console.log(chalk.white("source ~/.bashrc"));

    console.log(chalk.yellow.bold("\nThen verify:"));
    console.log(chalk.white("nvcc --version"));

    return;
  }

  console.log(chalk.red.bold("\n✖ No automatic CUDA PATH fix detected.\n"));
  console.log("Next checks:");
  console.log("- Verify CUDA packages: dpkg -l | grep cuda");
  console.log("- Verify CUDA folder: ls -l /usr/local/cuda");
  console.log("- Reinstall JetPack CUDA packages if needed.");
}
