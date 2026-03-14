import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const models = await genAI.listModels();
    for (const model of models.models) {
      console.log(`Model: ${model.name}, DisplayName: ${model.displayName}, Methods: ${model.supportedGenerationMethods}`);
    }
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
