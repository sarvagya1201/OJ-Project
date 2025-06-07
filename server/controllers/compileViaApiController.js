import axios from "axios";

const MAX_CODE_LENGTH = 10000;

// 🚫 Dangerous keywords per language
const keywordBlocklist = {
  cpp: ["system", "fork", "exec", "popen", "fopen", "rm", "reboot"],
  python: ["os.system", "subprocess", "eval", "exec", "__import__", "open", "input"],
  java: ["Runtime", "ProcessBuilder", "exec", "System.exit"],
  js: ["eval", "Function", "require('child_process')", "child_process", "process.exit"],
};

// 🔐 Code sanitizer
const sanitizeCode = (code, language) => {
  if (typeof code !== "string") throw new Error("Code must be a string");

  // Strip BOM and control characters (except newline, tab)
  const clean = code
    .replace(/^\uFEFF/, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, "");

  if (clean.length > MAX_CODE_LENGTH) {
    throw new Error("Code is too long");
  }

  const lower = clean.toLowerCase();
  const blocklist = keywordBlocklist[language?.toLowerCase()] || [];

  for (const keyword of blocklist) {
    const pattern = new RegExp(`\\b${keyword}\\b`, "i");
    if (pattern.test(lower)) {
      throw new Error(`Disallowed keyword detected in ${language}: "${keyword}"`);
    }
  }

  return clean;
};

// 🚀 Compile via remote API
export const compileViaApi = async (language, code, input) => {
  try {
    const sanitizedCode = sanitizeCode(code, language);

    const response = await axios.post(process.env.COMPILER_API_URL, {
      language,
      code: sanitizedCode,
      input,
    });

    return response.data;
  } catch (err) {
    return {
      success: false,
      error: err.message || err.response?.data?.error || "Compiler API error",
      verdict: "Internal Error",
      time: 0,
    };
  }
};
