import Submission from "../models/Submission.js";
import mongoose from "mongoose";
import { executeCode } from "../compilers/executeCode.js";
import Problem from "../models/Problem.js";
import path from "path";



export const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID format" });
    }

    const result = await executeCode(language, code);

    const submission = new Submission({
      user: req.user.id,
       problem: new mongoose.Types.ObjectId(problemId),
      code,
      language,
      status: result.success ? "success" : "error",
      output: result.output || null,
      error: result.error || null,
    });
    await submission.save();

    res.status(201).json({ message: "Submission created and executed", submission });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
