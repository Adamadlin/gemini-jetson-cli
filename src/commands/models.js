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

function detectQuantization(filename) {
  const match = filename.match(/Q\d+_[A-Z]_[A-Z]|Q\d+_[A-Z]|Q\d+/i);
  return match ? match[0].toUpperCase() : "unknown";
}

function estimateCompatibility(sizeBytes, quantization) {
  const sizeGb = sizeBytes / 1024 / 1024 / 1024;

  if (filenameLooksLikeMmproj(quantization)) {
    return {
      score: "N/A",
      verdict: "Multimodal projector file, not the main LLM",
      context: "N/A",
      gpuOffload: "N/A"
    };
  }

  if (sizeGb <= 3.5 && quantization.includes("Q4")) {
    return {
      score: "High",
      verdict: "Good fit for Jetson Orin Nano 8GB",
      context: "2048–4096",
      gpuOffload: "Low to moderate. Start with -ngl 1 and increase carefully."
    };
  }

  if (sizeGb <= 5.5) {
    return {
      score: "Medium",
      verdict: "Possible, but memory pressure is likely",
      context: "1024–2048",
      gpuOffload: "Minimal. Start with CPU or -ngl 1."
    };
  }

  return {
    score: "Low",
    verdict: "Risky on 8GB Jetson without aggressive tuning",
    context: "512–1024",
    gpuOffload: "Very low or CPU-only recommended."
  };
}

function filenameLooksLikeMmproj(value) {
  return value.toLowerCase().includes("mmproj");
}
function dedupeModels(files) {
  const seen = new Map();

  for (const file of files) {
    const filename = path.basename(file).toLowerCase();

    if (!seen.has(filename)) {
      seen.set(filename, file);
    }
  }

  return Array.from(seen.values());
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

  const ggufFiles = dedupeModels([
    ...scanFiles(jetsonLlmPath, [".gguf"]),
    ...scanFiles(projectModelsPath, [".gguf"])
  ]);

  printSection("GGUF Models");

  if (ggufFiles.length === 0) {
    console.log("No GGUF models found in known paths.");
  } else {
    for (const file of ggufFiles) {
      const stat = fs.statSync(file);
      const filename = path.basename(file);
      const quantization = filenameLooksLikeMmproj(filename)
        ? "mmproj"
        : detectQuantization(filename);

      const compatibility = estimateCompatibility(stat.size, quantization);

      console.log(chalk.green(`\n- ${filename}`));
      printItem("Path:", file);
      printItem("Size:", formatBytes(stat.size));
      printItem("Quantization:", quantization);
      printItem("Jetson 8GB Score:", compatibility.score);
      printItem("Verdict:", compatibility.verdict);
      printItem("Recommended Context:", compatibility.context);
      printItem("GPU Offload:", compatibility.gpuOffload);
    }
  }

  printSection("Compatibility Hints");
  console.log("- 8GB Jetson devices usually prefer 2B–4B models in Q4 quantization.");
  console.log("- Larger models may require low context size, swap, or minimal GPU offload.");
  console.log("- GGUF models are usually best tested with llama.cpp.");
  console.log("- TensorRT-LLM may require conversion and more setup.");
}
