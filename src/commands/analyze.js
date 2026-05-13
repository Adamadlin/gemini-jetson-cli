import fs from "fs";
import { askGemini } from "../core/gemini.js";

export async function runAnalyze(filePath) {
  if (!filePath) {
    console.error("Please provide a file path.");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf8");

  const prompt = `
Analyze this Jetson-related log/error output.

Return:
1. Summary
2. Likely root cause
3. Exact fix commands
4. Warnings or risks

Log:
${content}
`;

  console.log("\nAnalyzing with Gemini...\n");
  console.log(await askGemini(prompt));
}
