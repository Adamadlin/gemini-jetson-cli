import fs from "fs";
import os from "os";
import path from "path";
import chalk from "chalk";

function exists(p) {
  return fs.existsSync(p);
}

function getDirSize(dirPath) {
  if (!exists(dirPath)) return 0;

  let total = 0;

  function walk(currentPath) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        walk(fullPath);
      } else {
        total += fs.statSync(fullPath).size;
      }
    }
  }

  try {
    walk(dirPath);
  } catch {
    return 0;
  }

  return total;
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
}

function scanFiles(dirPath, extensions = []) {
  if (!exists(dirPath)) return [];

  const results = [];

  function walk(currentPath) {
    const items = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(currentPath, item.name);

      if (item.isDirectory()) {
        walk(fullPath);
      } else if (
        extensions.length === 0 ||
        extensions.some((ext) => item.name.toLowerCase().endsWith(ext))
      ) {
        results.push(fullPath);
      }
    }
  }

  try {
    walk(dirPath);
  } catch {
    return [];
  }

  return results;
}

function printSection(title) {
  console.log(chalk.cyan.bold(`\n${title}`));
}

function printItem(label, value) {
  console.log(`${chalk.yellow(label)} ${value}`);
}

export function runModels() {
  const home = os.homedir();

  const ollamaPath = path.join(home, ".ollama", "models");
  const hfPath = path.join(home, ".cache", "huggingface");
  const jetsonLlmPath = path.join(home, "jetson-llm", "models");
  const projectModelsPath = path.join(process.cwd(), "models");

  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════════════╗
║        JETSON AI MODELS             ║
╚══════════════════════════════════════╝
`)
  );

  printSection("Ollama");
  printItem("Path:", ollamaPath);
  printItem("Exists:", exists(ollamaPath) ? "yes" : "no");
  printItem("Size:", formatBytes(getDirSize(ollamaPath)));

  printSection("Hugging Face Cache");
  printItem("Path:", hfPath);
  printItem("Exists:", exists(hfPath) ? "yes" : "no");
  printItem("Size:", formatBytes(getDirSize(hfPath)));

  printSection("Jetson LLM Models");
  printItem("Path:", jetsonLlmPath);
  printItem("Exists:", exists(jetsonLlmPath) ? "yes" : "no");
  printItem("Size:", formatBytes(getDirSize(jetsonLlmPath)));

  const ggufFiles = [
    ...scanFiles(jetsonLlmPath, [".gguf"]),
    ...scanFiles(projectModelsPath, [".gguf"])
  ];

  printSection("GGUF Models");

  if (ggufFiles.length === 0) {
    console.log("No GGUF models found in known paths.");
  } else {
    for (const file of ggufFiles) {
      const size = fs.statSync(file).size;
      console.log(`- ${file} (${formatBytes(size)})`);
    }
  }

  printSection("Compatibility Hints");
  console.log("- 8GB Jetson devices usually prefer 2B–4B models in Q4 quantization.");
  console.log("- Larger models may require low context size, swap, or minimal GPU offload.");
  console.log("- GGUF models are usually best tested with llama.cpp.");
  console.log("- TensorRT-LLM may require conversion and more setup.");
}
