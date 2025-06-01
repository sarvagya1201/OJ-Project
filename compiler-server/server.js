import express from "express";
import dotenv from "dotenv";
import runRoute from "./routes/runRoute.js";
import "./cron/cleaner.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.get("/", (req, res) => {
  res.json({ online: "compiler" });
});

app.use("/api", runRoute); //  route - /api/run

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
