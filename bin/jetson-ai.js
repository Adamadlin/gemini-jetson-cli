#!/usr/bin/env node

import { Command } from "commander";
import { runDoctor } from "../src/commands/doctor.js";
import { runAsk } from "../src/commands/ask.js";

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

program.parse();
