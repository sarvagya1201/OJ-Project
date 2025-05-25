import express from 'express';
import { compileAndRun } from "../utils/compileController.js";

const router = express.Router();


router.post("/run", async (req, res) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const result = await compileAndRun(language, code, input || "");

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in /run:", err);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

export default router;