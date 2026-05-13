import { askGemini } from "../core/gemini.js";

export async function runAsk(question) {
  if (!question) {
    console.error("Please provide a question.");
    process.exit(1);
  }

  console.log("\nThinking...\n");

  const answer = await askGemini(question);
  console.log(answer);
}
