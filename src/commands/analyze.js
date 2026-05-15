import fs from "fs";
import { askGemini } from "../core/gemini.js";

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
