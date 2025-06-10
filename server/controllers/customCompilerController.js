import { compileViaApi } from "./compileViaApiController.js";

export const compileHandler = async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "Language and code are required" });
  }

  try {
    const result = await compileViaApi(language, code, input || "");
    return res.status(200).json(result);
  } catch (err) {
    console.error("Compile error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Compilation failed",
      verdict: "Internal Error",
      time: 0,
    });
  }
};