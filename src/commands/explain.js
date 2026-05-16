import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { askGemini } from "../core/gemini.js";

function run(command) {
  try {
    return execSync(command, { encoding: "utf8" }).trim();
  } catch {
    return "Not available";
  }
}

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf8").slice(0, 5000);
}

export async function runExplain(targetPath = ".") {
  const absolutePath = path.resolve(targetPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`Path not found: ${targetPath}`);
    process.exit(1);
  }

  console.log("\nScanning project...\n");

  const tree = run(`tree -I "node_modules|.git|dist|build|coverage" ${absolutePath} 2>/dev/null | head -n 120`);
  const packageJson = readIfExists(path.join(absolutePath, "package.json"));
  const dockerfile = readIfExists(path.join(absolutePath, "Dockerfile"));
  const compose = readIfExists(path.join(absolutePath, "docker-compose.yml"));
  const readme = readIfExists(path.join(absolutePath, "README.md"));

  const prompt = `
Analyze this software project.

Return:
1. What this project is
2. Main technologies
3. Architecture summary
4. Important files/folders
5. Strengths
6. Weaknesses / missing pieces
7. Suggested next improvements

Project path:
${absolutePath}

Folder tree:
${tree}

package.json:
${packageJson}

Dockerfile:
${dockerfile}

docker-compose.yml:
${compose}

README.md:
${readme}
`;

  console.log(await askGemini(prompt));
}
