import Submission from "../models/Submission.js";
import mongoose from "mongoose";
export const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID format" });
    }
    const submission = new Submission({
      user: req.user.id,
       problem: new mongoose.Types.ObjectId(problemId),
      code,
      language,
    });
    await submission.save();

    res.status(201).json({ message: "Submission received", submission });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
