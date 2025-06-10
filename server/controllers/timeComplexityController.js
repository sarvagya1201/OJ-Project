import axios from "axios";
import { TC_API_URL } from "../config/config.js";

export const analyzeTimeComplexity = async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code must be a non-empty string" });
  }

  try {
    const response = await axios.post(TC_API_URL, {
      code,
    });

    return res.status(200).json(response.data);
  } catch (err) {
    console.error("Time complexity analysis error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to analyze time complexity",
    });
  }
};
