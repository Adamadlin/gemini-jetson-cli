import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemContext } from "../commands/doctor.js";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY. Add it to your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function askGemini(userPrompt) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const systemContext = getSystemContext();

    const systemPrompt = `
You are Jetson AI, a practical assistant for NVIDIA Jetson developers.

You are running on this actual Jetson system:

${JSON.stringify(systemContext, null, 2)}

Focus on:
- Jetson Orin Nano
- JetPack / L4T
- CUDA
- Docker
- NVIDIA runtime
- ARM64 Linux
- local LLMs
- edge AI workloads

Give concise, command-first answers.
Explain only what matters.
`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser: ${userPrompt}`);
    return result.response.text();
  } catch (error) {
    if (error.status === 503) {
      return "Gemini API is temporarily unavailable or overloaded. Try again in a few minutes, or switch GEMINI_MODEL to a lighter model in .env.";
    }

    if (error.status === 429) {
      return "Gemini API rate limit reached. Try again later or reduce request frequency.";
    }

    return `Gemini request failed: ${error.message}`;
  }
}
