import fs from "fs";
import { askGemini } from "../core/gemini.js";

function detectKnownFix(content) {
  const lower = content.toLowerCase();

  if (
    lower.includes("nvcc not found") ||
    lower.includes("nvcc was missing") ||
    lower.includes("cuda failed because nvcc")
  ) {
    return {
      issue: "CUDA nvcc not found in PATH",
      command: "jetson-ai fix cuda --apply",
      safeToAutomate: true
    };
  }

  return null;
}

export async function runAnalyze(filePath, options = {}) {
  if (!filePath) {
    console.error("Please provide a file path.");
    process.exit(1);
  }

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const knownFix = detectKnownFix(content);

  if (options.fix) {
    if (knownFix) {
      console.log("\nKnown fix detected:\n");
      console.log(`Issue: ${knownFix.issue}`);
      console.log(`Recommended command: ${knownFix.command}`);
      console.log(`Safe to automate: ${knownFix.safeToAutomate ? "yes" : "no"}`);
      console.log("\nRun the command above to apply the safe fix.\n");
      return;
    }

    console.log("\nNo deterministic safe fix found.\n");
    console.log("Running AI analysis instead...\n");
  }

  const prompt = options.json
    ? `
Analyze this Jetson-related log/error output.

Return ONLY valid JSON with this exact structure:

{
  "summary": "",
  "rootCause": "",
  "severity": "low | medium | high",
  "recommendedFixes": [
    {
      "title": "",
      "commands": [],
      "safeToAutomate": true,
      "relatedJetsonAiCommand": ""
    }
  ],
  "warnings": []
}

If the issue is CUDA nvcc missing from PATH, set:
"relatedJetsonAiCommand": "jetson-ai fix cuda --apply"

Log:
${content}
`
    : `
Analyze this Jetson-related log/error output.

Return:
1. Summary
2. Likely root cause
3. Exact fix commands
4. Warnings or risks

Log:
${content}
`;

  console.log(options.json ? "" : "\nAnalyzing with Gemini...\n");

  const response = await askGemini(prompt);

  if (options.json) {
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    console.log(cleaned);
    return;
  }

  console.log(response);
}
