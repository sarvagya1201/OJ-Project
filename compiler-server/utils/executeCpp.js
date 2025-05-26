import { spawn } from "child_process";
import fs from "fs";
import { performance } from "perf_hooks";

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
      }, 2000); // 2 seconds

      runProcess.stdin.on("error", (err) => {
        clearTimeout(timeout);
        const endTime = performance.now();
        return resolve({
          success: false,
          error: "Wrong Answer", // stdin crash due to unexpected input
          verdict: "Wrong Answer",
          time: parseFloat((endTime - startTime).toFixed(2)),
        });
      });

      setImmediate(() => {
        try {
          runProcess.stdin.write(input);
          runProcess.stdin.end();
        } catch (err) {
          clearTimeout(timeout);
          return resolve({
            success: false,
            error: "Wrong Answer", // stdin write failed
            verdict: "Wrong Answer",
            time: 0,
          });
        }
      });

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

        // Handle segmentation faults or bad input crashes
        if (code !== 0 || stderr.includes("Segmentation fault") || stderr) {
          return resolve({
            success: false,
            error: "Wrong Answer",
            verdict: "Wrong Answer",
            time: executionTime,
          });
        }

        resolve({
          success: true,
          output: stdout.trim(),
          verdict: "Executed",
          time: executionTime,
        });
      });
    });
  });
}
