import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
    default: [],
  },
  sampleInput: {
    type: String,
    required: true,
  },
  sampleOutput: {
    type: String,
    required: true,
  },
  testInputFile: {
    type: String, //file path or URL
    required: true,
  },
  testOutputFile: {
    type: String, //file path or URL
    required: true,
  },
  timeLimit: {
    type: Number, // in seconds
    default: 2, // default if not provided
    required: true,
  },

  memoryLimit: {
    type: Number, // in megabytes
    default: 256, // default if not provided
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
// The Problem model represents a coding problem in the database.
