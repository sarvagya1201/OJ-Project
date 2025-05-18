import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CODE_FOLDER = path.join(__dirname, "../code_files");
const EXEC_FOLDER = path.join(__dirname, "../executables");
if (!fs.existsSync(CODE_FOLDER)) fs.mkdirSync(CODE_FOLDER);
if (!fs.existsSync(EXEC_FOLDER)) fs.mkdirSync(EXEC_FOLDER);

export const executeCode = (
  language,
  code,
  inputFilePath,
  expectedOutputFilePath
) => {
  const jobId = `${uuidv4()}-${Date.now()}`;
  const extensions = {
    cpp: "cpp",
    java: "java",
    python: "py",
  };

  const ext = extensions[language];
  if (!ext) throw new Error("Unsupported language");

  const sourceFile = path.join(CODE_FOLDER, `${jobId}.${ext}`);
  const execFile = path.join(
    EXEC_FOLDER,
    `${jobId}${os.platform() === "win32" ? ".exe" : ""}`
  );

  fs.writeFileSync(sourceFile, code);

  return new Promise((resolve) => {
    let compile;
    let run;

    // Compile
    switch (language) {
      case "cpp":
        compile = spawn("g++", [sourceFile, "-o", execFile]);
        break;
      case "python":
        compile = null;
        break;
    }
    const handleExecution = () => {
      const input = fs.readFileSync(inputFilePath, "utf-8");
      const expected = fs.readFileSync(expectedOutputFilePath, "utf-8").trim();

      let runProcess;
      switch (language) {
        case "cpp":
          runProcess = spawn(execFile);
          break;
        case "python":
          runProcess = spawn("python", [sourceFile]);
          break;
      }

      let stdout = "";
      let stderr = "";

      runProcess.stdin.write(input);
      runProcess.stdin.end();

      runProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      runProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      runProcess.on("close", (code) => {
        if (code !== 0 || stderr) {
          return resolve({ success: false, error: stderr || "Runtime Error" });
        }

        const actual = stdout.trim();
        const verdict = actual === expected ? "Accepted" : "Wrong Answer";
        resolve({ success: true, output: actual, verdict, expected });
      });
    };
    if (compile) {
      compile.on("close", (code) => {
        if (code !== 0) {
          return resolve({ success: false, error: "Compilation Error" });
        }
        handleExecution();
      });
    } else {
      handleExecution();
    }

    // exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
    //   if (err) {
    //     return resolve({ success: false, error: stderr || err.message });
    //   }
    //   return resolve({ success: true, output: stdout });
    // });
  });
};
