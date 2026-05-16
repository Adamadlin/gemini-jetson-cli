import chalk from "chalk";
import { getSystemContext } from "./doctor.js";

function section(title, lines = []) {
  console.log(chalk.cyan.bold(`\n${title}`));
  for (const line of lines) {
    console.log(`- ${line}`);
  }
}

export function runOptimize() {
  const ctx = getSystemContext();

  console.log(
    chalk.cyan.bold(`
╔══════════════════════════════════════╗
║        JETSON AI OPTIMIZER          ║
╚══════════════════════════════════════╝
`)
  );

  section("Detected System", [
    `Architecture: ${ctx.Architecture}`,
    `Kernel: ${ctx.Kernel}`,
    `Power Mode: ${ctx.PowerMode?.replaceAll("\n", " ") || "unknown"}`,
    `Docker Runtime: ${ctx["Docker Runtime"]?.replaceAll("\n", " ") || "unknown"}`
  ]);

  section("LLM Runtime Recommendations", [
    "Start with llama.cpp GGUF models before heavier TensorRT-LLM flows.",
    "For Jetson Orin Nano 8GB, prefer 2B–4B models in Q4 quantization.",
    "Use context size 2048 first, then try 4096 if memory remains stable.",
    "Start GPU offload conservatively with -ngl 1, then increase gradually.",
    "Monitor RAM, swap, and thermals during each run."
  ]);

  section("Known Good Starting Point", [
    "llama-server -m model.gguf -c 2048 -ngl 1 --host 0.0.0.0 --port 8080",
    "If stable, try: -c 4096",
    "If memory pressure appears, reduce context before increasing GPU offload."
  ]);

  section("Docker Recommendations", [
    "Use --runtime nvidia when running GPU-aware containers.",
    "Keep model files on NVMe SSD, not SD card.",
    "Mount persistent model/cache volumes to avoid repeated downloads.",
    "Avoid making NVIDIA runtime default unless you understand the impact."
  ]);

  section("CUDA / TensorRT Notes", [
    "CUDA is useful for runtime acceleration, but nvcc is only needed for compilation.",
    "TensorRT can improve inference performance but usually requires model conversion.",
    "Do not start TensorRT optimization until a baseline GGUF benchmark exists."
  ]);

  section("Next Suggested Commands", [
    "jetson-ai doctor",
    "jetson-ai models",
    "jetson-ai benchmark --save",
    "jetson-ai monitor --watch"
  ]);

  console.log(chalk.green.bold("\n✔ Optimization guidance complete.\n"));
}
