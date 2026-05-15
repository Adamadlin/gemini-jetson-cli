#!/usr/bin/env node
import { runAnalyze } from "../src/commands/analyze.js";
import { Command } from "commander";
import { runDoctor } from "../src/commands/doctor.js";
import { runAsk } from "../src/commands/ask.js";
import { runFix } from "../src/commands/fix.js";
import { runMonitor } from "../src/commands/monitor.js";

const program = new Command();

program
  .name("jetson-ai")
  .description("Jetson-native AI CLI assistant powered by Gemini")
  .version("0.2.0");

program
  .command("doctor")
  .description("Check Jetson system health")
  .action(runDoctor);

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
  .action((file) => {
    runAnalyze(file);
  });

program
  .command("fix")
  .description("Suggest fixes for Jetson system issues")
  .argument("<target>", "Fix target, for example: cuda")
  .action((target) => {
    runFix(target);
  });

program
  .command("monitor")
  .description("Show a live Jetson system snapshot")
  .action(runMonitor);

program.parse();
