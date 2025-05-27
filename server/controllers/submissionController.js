import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";
import { compileViaApi } from "./compileviaAPIController.js";

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

    const input = fs.readFileSync(
      path.join(process.cwd(), problem.testInputFile),
      "utf-8"
    );
    const expectedOutput = fs
      .readFileSync(path.join(process.cwd(), problem.testOutputFile), "utf-8")
      .trim();

    const result = await compileViaApi(language, code, input);

    let verdict = result.verdict || "error";
    if (result.success) {
      const actualOutput = result.output.trim();
      const userOutN = normalizeOutput(actualOutput);
      const expectedOutN = normalizeOutput(expectedOutput);
      // if (actualOutput === expectedOutput) {
      //   verdict = "Accepted";
      // } else {
      //   verdict = "Wrong Answer";
      // }

      if (userOutN === expectedOutN) {
        verdict = "Accepted";
      } else {
        verdict = "Wrong Answer";
      }
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
