#!/usr/bin/env node
import { runAnalyze } from "../src/commands/analyze.js";
import { Command } from "commander";
import { runDoctor } from "../src/commands/doctor.js";
import { runAsk } from "../src/commands/ask.js";
import { runFix } from "../src/commands/fix.js";
import { runMonitor } from "../src/commands/monitor.js";
import { printBanner } from "../src/ui/banner.js";

const program = new Command();

program
  .name("jetson-ai")
  .description("Jetson-native AI CLI assistant powered by Gemini")
  .version("0.2.0");

program

  .command("doctor")

  .description("Check Jetson system health")

  .option("--json", "Output diagnostics as JSON")

  .action((options) => {

    runDoctor(options);

  });

program
  .command("ask")
  .description("Ask a Jetson-focused AI assistant")
  .argument("<question...>", "Question to ask")
  .action((questionParts) => {
    runAsk(questionParts.join(" "));
  });

program
  .command("analyze")
  .description("Analyze logs or error files with Gemini")
  .argument("<file>", "File to analyze")
  .option("--json", "Return structured JSON analysis")
  .action((file, options) => {
    runAnalyze(file, options);
  });

program
  .command("fix")
  .description("Suggest or apply safe fixes for Jetson system issues")
  .argument("<target>", "Fix target, for example: cuda")
  .option("--apply", "Apply the safe fix")
  .action((target, options) => {
    runFix(target, options);
  });

program
  .command("monitor")
  .description("Show Jetson system monitor")
  .option("-w, --watch", "Continuously refresh monitor")
  .action((options) => {
    runMonitor(options);
  });
if (process.argv.length === 2) {
  printBanner();
  process.exit(0);
}
program.parse();
