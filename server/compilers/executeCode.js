import fs from "fs";
import path from "path";
import { exec, spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import os from "os";
import { performance } from "perf_hooks";

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
    java: "java", // later
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
      let timedOut = false;

      const startTime = performance.now();
      runProcess.stdin.on("error", (err) => {
        // Suppress broken pipe errors when the process is killed
        if (err.code !== "EPIPE") {
          console.error("Stdin error:", err);
        }
      });

      runProcess.stdin.write(input);
      runProcess.stdin.end();
      // runProcess.stdin.write(input);
      // runProcess.stdin.end();

      runProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      runProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      // Timeout enforcement (e.g., 2000 ms = 2 seconds)
      const timeout = setTimeout(() => {
        timedOut = true;
        runProcess.kill("SIGKILL");
      }, 2000); // 2 seconds

      runProcess.on("close", (code) => {
        clearTimeout(timeout);

        const endTime = performance.now();
        const executionTime = parseFloat((endTime - startTime).toFixed(2)); // ms

        if (timedOut) {
          return resolve({
            success: false,
            error: "Time Limit Exceeded",
            verdict: "Time Limit Exceeded",
            time: 2000,
          });
        }
        if (code !== 0 || stderr) {
          return resolve({
            success: false,
            error: stderr || "Runtime Error",
            verdict: "Runtime Error",
            time: executionTime,
          });
        }

        const actual = stdout.trim();
        const verdict = actual === expected ? "Accepted" : "Wrong Answer";
        resolve({
          success: true,
          output: actual,
          verdict,
          expected,
          time: executionTime,
        });
      });
    };
    if (compile) {
      compile.on("close", (code) => {
        if (code !== 0) {
          return resolve({
            success: false,
            error: "Compilation Error",
            verdict: "Compilation Error",
            time: 0,
          });
        }
        handleExecution();
      });
    } else {
      handleExecution();
    }
  });
};
