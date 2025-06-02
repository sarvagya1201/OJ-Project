import Problem from "../models/Problem.js";
import Submission from "../models/Submission.js";
import { uploadFileToS3, deleteFileFromS3 } from "./s3Controller.js";

export const addProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    sampleInput,
    sampleOutput,
    timeLimit,
    memoryLimit,
  } = req.body;

  const testInputFile = req.files["testInput"]?.[0]?.path;
  const testOutputFile = req.files["testOutput"]?.[0]?.path;

  if (!testInputFile || !testOutputFile) {
    return res.status(400).json({ message: "Testcase files are required" });
  }

  try {
    // Generate S3 keys
    const timestamp = Date.now();
    const safeTitle = title.replace(/\s+/g, "_");

    const inputKey = `testcases/${timestamp}-${safeTitle}-input.txt`;
    const outputKey = `testcases/${timestamp}-${safeTitle}-output.txt`;

    // Upload files to S3 (but only use the keys in DB)
    await uploadFileToS3(testInputFile, inputKey);
    await uploadFileToS3(testOutputFile, outputKey);
    // const inputUrl = await uploadFileToS3(testInputFile, inputKey);
    // const outputUrl = await uploadFileToS3(testOutputFile, outputKey);

    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags: tags ? tags.split(",") : [],
      sampleInput,
      sampleOutput,
      testInputFile: inputKey, // S3 URL
      testOutputFile: outputKey, // S3 URL
      timeLimit,
      memoryLimit,
    });

    res.status(201).json({ message: "Problem created", problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select(
      "-testInputFile -testOutputFile"
    ); // exclude test file paths
    res.status(200).json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single problem by ID
export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    res.status(200).json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProblem = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    difficulty,
    tags,
    sampleInput,
    sampleOutput,
    timeLimit,
    memoryLimit,
  } = req.body;

  const testInputFile = req.files?.["testInput"]?.[0]?.path;
  const testOutputFile = req.files?.["testOutput"]?.[0]?.path;

  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const timestamp = Date.now();
    const safeTitle = (title || problem.title).replace(/\s+/g, "_");

    // Upload and replace input file
    if (testInputFile) {
      if (problem.testInputFile) {
        await deleteFileFromS3(problem.testInputFile); // delete old S3 key
      }
      const inputKey = `testcases/${timestamp}-${safeTitle}-input.txt`;
      await uploadFileToS3(testInputFile, inputKey);
      problem.testInputFile = inputKey; // store only the S3 key
    }

    // Upload and replace output file
    if (testOutputFile) {
      if (problem.testOutputFile) {
        await deleteFileFromS3(problem.testOutputFile); // delete old S3 key
      }
      const outputKey = `testcases/${timestamp}-${safeTitle}-output.txt`;
      await uploadFileToS3(testOutputFile, outputKey);
      problem.testOutputFile = outputKey; // store only the S3 key
    }

    // Update metadata
    problem.title = title || problem.title;
    problem.description = description || problem.description;
    problem.difficulty = difficulty || problem.difficulty;
    problem.tags = tags ? tags.split(",") : problem.tags;
    problem.sampleInput = sampleInput || problem.sampleInput;
    problem.sampleOutput = sampleOutput || problem.sampleOutput;
    problem.timeLimit = timeLimit || problem.timeLimit;
    problem.memoryLimit = memoryLimit || problem.memoryLimit;

    await problem.save();
    res.status(200).json({ message: "Problem updated", problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    await Submission.deleteMany({ problem: id }); //  Delete all submissions for this problem
    if (problem.testInputFile) await deleteFileFromS3(problem.testInputFile);
    if (problem.testOutputFile) await deleteFileFromS3(problem.testOutputFile);
    await problem.deleteOne();
    res.status(200).json({ message: "Problem deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
