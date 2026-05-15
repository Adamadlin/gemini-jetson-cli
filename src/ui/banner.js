import chalk from "chalk";

export function printBanner() {
  console.log(
    chalk.cyan.bold(`
╔════════════════════════════════════════════╗
║          GEMINI JETSON CLI                ║
║     AI Operations Tool for Jetson         ║
╚════════════════════════════════════════════╝
`)
  );

  console.log(chalk.white("Jetson-native diagnostics, monitoring, fixing, and AI assistance.\n"));

  console.log(chalk.yellow.bold("Available commands:"));
  console.log("  jetson-ai doctor              Check Jetson system health");
  console.log("  jetson-ai doctor --json       Output diagnostics as JSON");
  console.log("  jetson-ai ask \"...\"           Ask Gemini with Jetson context");
  console.log("  jetson-ai analyze file.log    Analyze logs/errors with Gemini");
  console.log("  jetson-ai fix cuda            Suggest CUDA fixes");
  console.log("  jetson-ai fix cuda --apply    Apply safe CUDA PATH fix");
  console.log("  jetson-ai monitor             Show system snapshot");
  console.log("  jetson-ai monitor --watch     Live refresh monitor");

  console.log(chalk.green.bold("\nExamples:"));
  console.log("  jetson-ai ask \"Why is my Docker CUDA container failing?\"");
  console.log("  jetson-ai analyze docker.log");
  console.log("  jetson-ai fix cuda --apply\n");
}
