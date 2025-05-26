import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "../config/config.js";

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in .env");
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default genAI;
