import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

export default function executeJava(sourceFile, input) {
  return new Promise((resolve) => {
    const dir = path.dirname(sourceFile);
    const mainJavaPath = path.join(dir, "Main.java");
    const classFile = path.join(dir, "Main.class");

    // Rename the source file to Main.java before compiling
    try {
      if (sourceFile !== mainJavaPath) {
        fs.renameSync(sourceFile, mainJavaPath);
      }
    } catch (err) {
      return resolve({
        success: false,
        error: `Failed to rename source file: ${err.message}`,
        verdict: "Internal Error",
        time: 0,
      });
    }

    // Step 1: Compile the Java file
    let compileStderr = "";
    const compile = spawn("javac", [mainJavaPath]);

    compile.stderr.on("data", (data) => {
      compileStderr += data.toString();
    });

    compile.on("close", (code) => {
      if (code !== 0) {
        cleanup();
        return resolve({
          success: false,
          error: compileStderr || "Compilation Error",
          verdict: "Compilation Error",
          time: 0,
        });
      }

      if (!fs.existsSync(classFile)) {
        cleanup();
        return resolve({
          success: false,
          error: "Class file not found after compilation",
          verdict: "Internal Error",
          time: 0,
        });
      }

      // Step 2: Run the compiled Java class
      const runProcess = spawn("java", ["-cp", dir, "Main"]);
      let stdout = "";
      let stderr = "";
      const startTime = performance.now();

      let timedOut = false;
      let finished = false; // To prevent double resolve

      // Timeout handler
      const timeout = setTimeout(() => {
        timedOut = true;
        // Kill the process tree if possible (SIGKILL to be sure)
        try {
          runProcess.kill("SIGKILL");
        } catch {}

        if (!finished) {
          finished = true;
          cleanup();
          return resolve({
            success: false,
            error: "Time Limit Exceeded",
            verdict: "Time Limit Exceeded",
            time: 2000,
          });
        }
      }, 2000);

      runProcess.stdin.on("error", () => {
        if (finished) return;
        clearTimeout(timeout);
        finished = true;
        cleanup();
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
        } catch {
          if (finished) return;
          clearTimeout(timeout);
          finished = true;
          cleanup();
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
        if (finished) return; // Already resolved due to timeout or error

        clearTimeout(timeout);
        finished = true;
        const endTime = performance.now();
        const executionTime = parseFloat((endTime - startTime).toFixed(2));

        cleanup();

        if (timedOut) {
          return resolve({
            success: false,
            error: "Time Limit Exceeded",
            verdict: "Time Limit Exceeded",
            time: 2000,
          });
        }

        if (code !== 0 || stderr.includes("Exception") || stderr) {
          return resolve({
            success: false,
            error: stderr || `Exited with code ${code}`,
            verdict: "Runtime Error",
            time: executionTime,
          });
        }

        return resolve({
          success: true,
          output: stdout.trim(),
          verdict: "Executed",
          time: executionTime,
        });
      });
    });

    function cleanup() {
      try {
        if (fs.existsSync(mainJavaPath)) fs.unlinkSync(mainJavaPath);
        if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
      } catch (err) {
        console.error("Cleanup error:", err.message);
      }
    }
  });
}
