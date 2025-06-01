import { spawn } from "child_process";
import fs from "fs";
import { performance } from "perf_hooks";

function classifyRuntimeError(code, stderr) {
  // Windows-specific codes
  const errorCodeMap = {
    3221225477: "Segmentation Fault",
    3221225620: "Division by Zero",
    3221225781: "Stack Overflow",
  };

  if (code in errorCodeMap) return errorCodeMap[code];

  if (stderr.toLowerCase().includes("segmentation fault"))
    return "Segmentation Fault";
  if (stderr.toLowerCase().includes("floating point"))
    return "Floating Point Exception";
  if (stderr.toLowerCase().includes("aborted")) return "Aborted";
  if (stderr) return stderr.trim();

  return `Runtime Error (exit code ${code})`;
}

export default function executeCpp(sourceFile, execFile, input) {
  return new Promise((resolve) => {
    const compile = spawn("g++", [sourceFile, "-o", execFile]);

    compile.on("close", (code) => {
      if (code !== 0) {
        return resolve({
          success: false,
          error: "Compilation Error",
          verdict: "Compilation Error",
          time: 0,
        });
      }

      if (!fs.existsSync(execFile)) {
        return resolve({
          success: false,
          error: "Executable not found after compilation",
          verdict: "Internal Error",
          time: 0,
        });
      }

      const runProcess = spawn(execFile);
      let stdout = "";
      let stderr = "";
      let timedOut = false;

      const startTime = performance.now();

      const timeout = setTimeout(() => {
        timedOut = true;
        runProcess.kill("SIGKILL");
      }, 2000); // 2s timeout

      runProcess.stdin.on("error", () => {
        clearTimeout(timeout);
        const endTime = performance.now();
        return resolve({
          success: false,
          error: "Input Error",
          verdict: "Runtime Error",
          time: parseFloat((endTime - startTime).toFixed(2)),
        });
      });

      try {
        runProcess.stdin.write(input);
        runProcess.stdin.end();
      } catch (err) {
        clearTimeout(timeout);
        return resolve({
          success: false,
          error: "Failed to send input",
          verdict: "Runtime Error",
          time: 0,
        });
      }

      runProcess.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      runProcess.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      runProcess.on("close", (code) => {
        clearTimeout(timeout);
        const endTime = performance.now();
        const executionTime = parseFloat((endTime - startTime).toFixed(2));

        if (timedOut) {
          return resolve({
            success: false,
            error: "Time Limit Exceeded",
            verdict: "Time Limit Exceeded",
            time: 2000,
          });
        }

        // Runtime error detection based on code or stderr
        if (code !== 0 || stderr) {
          const runtimeError = classifyRuntimeError(code, stderr);
          return resolve({
            success: false,
            error: runtimeError,
            verdict: "Runtime Error",
            time: executionTime,
          });
        }

        // Successful execution
        return resolve({
          success: true,
          output: stdout.trim(),
          verdict: "Executed",
          time: executionTime,
        });
      });
    });
  });
}
