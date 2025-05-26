import genAI from "./geminiClient.js";

const promptHeader = `You are a helpful AI code reviewer for an online coding judge.

Your job is to review the users submitted code (with or without the problem statement) and provide:
1. Summary
2. Potential Bugs or Errors
3. Readability Improvements
4. Efficiency Improvements
5. Overall Score (out of 10)

❗ IMPORTANT:
- Do NOT reveal or hint at the correct problem solution.
- Do NOT tell the user which algorithm they should have used.
- Focus ONLY on their submitted code as-is.
- Provide general best practices, style tips, optimizations, and edge case advice.

Stay constructive, encouraging, and focused on helping the user improve their coding skills — without spoiling the problem.


Now review the following:\n\n`;

export const getCodeReview = async (question, code) => {
  const fullPrompt = `${promptHeader}Question:\n${question}\n\nCode:\n${code}`;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `${fullPrompt}`,
    });
   return response.text;

   
  } catch (err) {
    console.error("Gemini review error:", err);
    throw new Error("Failed to fetch code review");
  }
};
