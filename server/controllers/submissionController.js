import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import { compileViaApi } from "./compileViaApiController.js";
import { downloadFileFromS3 } from "./s3Controller.js";

const normalizeOutput = (str) => {
  return str
    .replace(/\r\n/g, "\n") // convert Windows line endings to Unix
    .replace(/\r/g, "\n") // convert Mac line endings to Unix
    .trim() // remove leading/trailing newlines and spaces
    .split("\n") // split into lines
    .map((line) => line.trim()) // trim each line
    .join("\n"); // rejoin
};

export const createSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    if (!mongoose.Types.ObjectId.isValid(problemId)) {
      return res.status(400).json({ message: "Invalid problem ID format" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

     // 🧾 Read test cases from S3
    const input = await downloadFileFromS3(problem.testInputFile);
    const expectedOutput = (await downloadFileFromS3(problem.testOutputFile)).trim();
    
    const result = await compileViaApi(language, code, input);

    let verdict;
    if (!result.success) {
      verdict = result.verdict || "error";
    } else {
      const userOutN = normalizeOutput(result.output.trim());
      const expectedOutN = normalizeOutput(expectedOutput);
      verdict = userOutN === expectedOutN ? "Accepted" : "Wrong Answer";
    }
    
    const submission = new Submission({
      user: req.user.id,
      problem: problem._id,
      code,
      language,
      status: verdict,
      output: result.output || null,
      error: result.error || null,
      time: result.time || null,
    });

    await submission.save();
    res
      .status(201)
      .json({ message: "Submission created and executed", submission });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const mySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate("problem", "title") // Get problem title
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getSubmissionById = async (req, res) => {
  const { id } = req.params;

  try {
    const sub = await Submission.findById(id);
    if (!sub) return res.status(404).json({ message: "Submission not found" });

    res.status(200).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSubmissionsByProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user._id;

    const userSubmissions = await Submission.find({
      problem: problemId,
      user: userId,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name");

    const otherSubmissions = await Submission.find({
      problem: problemId,
      user: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .populate("user", "name")
      .select("-code");

    res.status(200).json({
      userSubmissions,
      otherSubmissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
