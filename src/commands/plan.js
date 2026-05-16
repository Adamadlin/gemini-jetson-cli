import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { askGemini } from "../core/gemini.js";

function run(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "Not available";
  }
}

function readIfExists(filePath, limit = 7000) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8").slice(0, limit);
}

export async function runPlan(targetPath = ".") {
  const absolutePath = path.resolve(targetPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`Path not found: ${targetPath}`);
    process.exit(1);
  }

  console.log("\nCreating project improvement plan...\n");

  const tree = run(
    `tree -I "node_modules|.git|dist|build|coverage|benchmarks" ${absolutePath} 2>/dev/null | head -n 160`
  );

  const packageJson = readIfExists(path.join(absolutePath, "package.json"));
  const readme = readIfExists(path.join(absolutePath, "README.md"));
  const roadmap = readIfExists(path.join(absolutePath, "ROADMAP.md"));
  const gitignore = readIfExists(path.join(absolutePath, ".gitignore"));

  const prompt = `
You are acting as a senior software engineering lead.

Analyze this project and produce a practical next-step development plan.

Important:
- Do not be vague.
- Prioritize what should be built next.
- Avoid huge rewrites unless truly needed.
- Prefer branch-sized tasks.
- Include suggested branch names.
- Include exact implementation goals.
- Include testing/verification commands.
- Include what NOT to do yet.

Return format:

1. Current project maturity
2. Top 5 next tasks, prioritized
3. Recommended next branch
4. Exact acceptance criteria
5. Commands to verify after implementation
6. Risks / warnings
7. What to postpone

Project path:
${absolutePath}

Folder tree:
${tree}

package.json:
${packageJson}

README.md:
${readme}

ROADMAP.md:
${roadmap}

.gitignore:
${gitignore}
`;

  const response = await askGemini(prompt);
  console.log(response);
}
