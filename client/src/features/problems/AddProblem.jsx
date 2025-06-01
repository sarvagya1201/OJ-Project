// src/features/problems/AddProblem.jsx

import { useState } from "react";
import { addProblem } from "../../services/problemService";

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

    data.append("testInput", testInputFile);
    data.append("testOutput", testOutputFile);

    try {
      await addProblem(data);
      setMessage("Problem added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Error adding problem");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Problem</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-3"
      >
        {[
          "title",
          "description",
          "difficulty",
          "tags",
          "sampleInput",
          "sampleOutput",
          "timeLimit",
          "memoryLimit",
        ].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={
                ["difficulty", "timeLimit", "memoryLimit"].includes(field)
                  ? "number"
                  : "text"
              }
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <div className="flex items-center space-x-4 mb-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Test Input
            </label>
            <label className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
              Upload Input
              <input
                type="file"
                name="testInput"
                accept=".txt"
                onChange={handleFileChange}
                required
                className="hidden"
              />
            </label>
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Test Output
            </label>
            <label className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-md cursor-pointer hover:bg-green-600 transition-colors">
              Upload Output
              <input
                type="file"
                name="testOutput"
                accept=".txt"
                onChange={handleFileChange}
                required
                className="hidden"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Problem
        </button>

        {message && <p className="mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default AddProblem;
