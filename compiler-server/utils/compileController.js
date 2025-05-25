import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import os from "os";
import { performance } from "perf_hooks";

import executeCpp from "./executeCpp.js";
import executePython from "./executePython.js";
import executeJava from "./executeJava.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CODE_FOLDER = path.join(__dirname, "../code_files");
const EXEC_FOLDER = path.join(__dirname, "../executables");

if (!fs.existsSync(CODE_FOLDER)) fs.mkdirSync(CODE_FOLDER);
if (!fs.existsSync(EXEC_FOLDER)) fs.mkdirSync(EXEC_FOLDER);

export const compileAndRun = async (language, code, input) => {
  const jobId = `${uuidv4()}-${Date.now()}`;
  const extensions = {
    cpp: "cpp",
    python: "py",
    java: "java",
  };

  const ext = extensions[language];
  if (!ext) throw new Error("Unsupported language");

  const sourceFile = path.join(CODE_FOLDER, `${jobId}.${ext}`);
  const execFile = path.join(
    EXEC_FOLDER,
    `${jobId}${os.platform() === "win32" ? ".exe" : ".out"}`
  );

  fs.writeFileSync(sourceFile, code);

  switch (language) {
    case "cpp":
      return await executeCpp(sourceFile, execFile, input);
    case "python":
      return await executePython(sourceFile, input);
    case "java":
      return await executeJava(sourceFile, input);
    default:
      return {
        success: false,
        error: "Language not supported",
        time: 0,
      };
  }
};
