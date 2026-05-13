import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY. Add it to your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function askGemini(userPrompt) {
  const model = genAI.getGenerativeModel({ model: modelName });

  const systemPrompt = `
You are Jetson AI, a practical assistant for NVIDIA Jetson developers.
Focus on Jetson Orin Nano, CUDA, Docker, JetPack, ARM64 Linux, local LLMs, and edge AI.
Give concise, command-first answers.
`;

  const result = await model.generateContent(`${systemPrompt}\n\nUser: ${userPrompt}`);
  return result.response.text();
}
