// src/features/problems/AddProblem.jsx

import { useState } from "react";
import { addProblem } from "../../services/problemService";
import { motion } from "framer-motion";

const AddProblem = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    tags: "",
    sampleInput: "",
    sampleOutput: "",
    timeLimit: "",
    memoryLimit: "",
  });

  const [testInputFile, setTestInputFile] = useState(null);
  const [testOutputFile, setTestOutputFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "testInput") setTestInputFile(files[0]);
    if (name === "testOutput") setTestOutputFile(files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (testInputFile) data.append("testInput", testInputFile);
    if (testOutputFile) data.append("testOutput", testOutputFile);

    try {
      await addProblem(data);
      setMessage("Problem added successfully!");
      // Optionally reset form here
    } catch (err) {
      console.error(err);
      setMessage("Error adding problem");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto p-6 bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow-lg backdrop-blur-md"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Add New Problem
      </h2>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Two Sum"
            required
            className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed problem description with constraints and examples."
            rows={6}
            required
            className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-3 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Difficulty and Tags on the same row */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1">
            <label htmlFor="difficulty" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Rating
            </label>
            <input
              type="number"
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              placeholder="Example: 1500"
              min={1}
              required
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <label htmlFor="tags" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Example: array, math, sorting"
              required
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Sample Input and Output textareas */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1">
            <label htmlFor="sampleInput" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Sample Input
            </label>
            <textarea
              id="sampleInput"
              name="sampleInput"
              value={formData.sampleInput}
              onChange={handleChange}
              placeholder="Example:\n5\n1 2 3 4 5"
              rows={4}
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <label htmlFor="sampleOutput" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Sample Output
            </label>
            <textarea
              id="sampleOutput"
              name="sampleOutput"
              value={formData.sampleOutput}
              onChange={handleChange}
              placeholder="Example:\n15"
              rows={4}
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Time Limit and Memory Limit side by side */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex-1">
            <label htmlFor="timeLimit" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Time Limit (seconds)
            </label>
            <input
              type="number"
              id="timeLimit"
              name="timeLimit"
              value={formData.timeLimit}
              onChange={handleChange}
              placeholder="Example: 2"
              min={1}
              required
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <label htmlFor="memoryLimit" className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
              Memory Limit (MB)
            </label>
            <input
              type="number"
              id="memoryLimit"
              name="memoryLimit"
              value={formData.memoryLimit}
              onChange={handleChange}
              placeholder="Example: 256"
              min={1}
              required
              className="w-full rounded-md border border-gray-300 dark:border-zinc-700 px-4 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-zinc-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* File uploads */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="flex items-center space-x-3 mt-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mr-2">
              Test Input File
            </label>
            <label
              htmlFor="testInput"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md cursor-pointer select-none transition"
            >
              Upload Input
              <input
                type="file"
                id="testInput"
                name="testInput"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
                required={!testInputFile}
              />
            </label>
            {testInputFile && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {testInputFile.name}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mr-2">
              Test Output File
            </label>
            <label
              htmlFor="testOutput"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-md cursor-pointer select-none transition"
            >
              Upload Output
              <input
                type="file"
                id="testOutput"
                name="testOutput"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
                required={!testOutputFile}
              />
            </label>
            {testOutputFile && (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {testOutputFile.name}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold py-3 rounded-md shadow-lg transition"
        >
          Add Problem
        </button>

        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.includes("Error")
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </motion.div>
  );
};

export default AddProblem;
