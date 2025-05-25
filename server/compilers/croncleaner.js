import cron from "node-cron";
import path from "path";
import { deleteOldFiles } from "./cleanup.js";

// Schedule to run every 15 minutes
cron.schedule("*/15 * * * *", () => {
  console.log("🕒 Running cleanup cron job...");

  const codeFilesPath = path.join(process.cwd(), "code_files");
  const executablesPath = path.join(process.cwd(), "executables");

  deleteOldFiles(codeFilesPath, 5);      // delete files older than 15 min
  deleteOldFiles(executablesPath, 5);    // delete files older than 15 min
});
