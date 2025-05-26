import { getCodeReview } from "../gemini/reviewCode.js";

export const reviewCode = async (req, res) => {
  const { question, verdict, code } = req.body;

  if (!question || !code) {
    return res.status(400).json({ message: "Question and code are required" });
  }

  try {
    const review = await getCodeReview(question,verdict, code);
    res.status(200).json({ review });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ message: "AI review failed" });
  }
};
