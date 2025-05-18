import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const CODE_FOLDER = path.join(__dirname, "../code_files");
const EXEC_FOLDER = path.join(__dirname, "../executables");
if (!fs.existsSync(CODE_FOLDER)) fs.mkdirSync(CODE_FOLDER);
if (!fs.existsSync(EXEC_FOLDER)) fs.mkdirSync(EXEC_FOLDER);


export const executeCode = (language, code, input = "") => {
  const jobId = `${uuidv4()}-${Date.now()}`;
  const extensions = {
    cpp: "cpp",
    java: "java",
    python: "py",
  };

  const ext = extensions[language];
  if (!ext) throw new Error("Unsupported language");

  const fileName = `${jobId}.${ext}`;
  const filePath = path.join(CODE_FOLDER, fileName);
  const execPath = path.join(EXEC_FOLDER, `${jobId}`);

  fs.writeFileSync(filePath, code);

  return new Promise((resolve) => {
    let command = "";

    switch (language) {
      case "cpp":
        command = `g++ "${filePath}" -o "${execPath}" && "${execPath}"`;
        break;
      case "java":
        command = `javac "${filePath}" -d "${EXEC_FOLDER}" && java -cp "${EXEC_FOLDER}" ${jobId}`;
        break;
      case "python":
        command = `python "${filePath}"`;
        break;
    }

    exec(command, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) {
        return resolve({ success: false, error: stderr || err.message });
      }
      return resolve({ success: true, output: stdout });
    });
  });
};