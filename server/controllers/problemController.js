import Problem from '../models/Problem.js';

export const addProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    sampleInput,
    sampleOutput,
    timeLimit,
    memoryLimit
  } = req.body;

  const testInputFile = req.files['testInput']?.[0]?.path;
  const testOutputFile = req.files['testOutput']?.[0]?.path;

  if (!testInputFile || !testOutputFile) {
    return res.status(400).json({ message: 'Testcase files are required' });
  }

  try {
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      tags: tags ? tags.split(',') : [],
      sampleInput,
      sampleOutput,
      testInputFile,
      testOutputFile,
      timeLimit,
      memoryLimit
    });

    res.status(201).json({ message: 'Problem created', problem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all problems
export const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select('-testInputFile -testOutputFile'); // exclude test file paths
    res.status(200).json(problems);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single problem by ID
export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    res.status(200).json(problem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};