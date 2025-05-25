import fs from "fs";
import path from "path";

export function deleteOldFiles(directoryPath, maxAgeMinutes = 10) {
  const now = Date.now();

  fs.readdir(directoryPath, (err, files) => {
    if (err) return console.error(`Failed to read ${directoryPath}:`, err);

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`Failed to stat ${filePath}:`, err);

        const ageInMinutes = (now - stats.mtimeMs) / (1000 * 60);
        if (ageInMinutes > maxAgeMinutes) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete ${filePath}:`, err);
            else console.log(`🧹 Deleted: ${filePath}`);
          });
        }
      });
    });
  });
}
