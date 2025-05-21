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
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // const submission = new Submission({
    //   user: req.user.id,
    //   problem: new mongoose.Types.ObjectId(problemId),
    //   code,
    //   language,
    //   status: result.success ? "success" : "error",
    //   output: result.output || null,
    //   error: result.error || null,
    // });
    // await submission.save();

    const result = await executeCode(
      language,
      code,
      path.join(process.cwd(), problem.testInputFile),
      path.join(process.cwd(), problem.testOutputFile)
    );
    // const result = await executeCode(language, code);

    const submission = new Submission({
      user: req.user.id,
      problem: problem._id,
      code,
      language,
      status: result.verdict || "error",
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


export const getSubmissionById = 
async (req, res) => {
  const { id } = req.params;

  try {
    const sub = await Submission.findById(id);
    if (!sub) return res.status(404).json({ message: 'Submission not found' });

    res.status(200).json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getSubmissionsByProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user._id;

    // submissions by logged-in user
    const userSubmissions = await Submission.find({
      problem: problemId,
      user: userId,
    }).sort({ createdAt: -1 });

    // all other users' submissions (excluding code)
    const otherSubmissions = await Submission.find({
      problem: problemId,
      user: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .populate("user", "name") // populate user name only
      .select("-code"); // exclude code

    res.status(200).json({
      userSubmissions,
      otherSubmissions,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server Error" });
  }
};