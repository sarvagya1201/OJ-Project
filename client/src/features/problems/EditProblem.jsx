import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProblemById,
  updateProblemById,
} from "../../services/problemService";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    tags: "",
    sampleInput: "",
    sampleOutput: "",
    timeLimit: "",
    memoryLimit: "",
  });

  const [testInputFile, setTestInputFile] = useState(null);
  const [testOutputFile, setTestOutputFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const problem = await getProblemById(id);
        setFormData({
          title: problem.title,
          description: problem.description,
          difficulty: problem.difficulty,
          tags: problem.tags.join(", "),
          sampleInput: problem.sampleInput,
          sampleOutput: problem.sampleOutput,
          timeLimit: problem.timeLimit,
          memoryLimit: problem.memoryLimit,
        });
      } catch (error) {
        console.error("Error fetching problem:", error);
        setMessage("Failed to fetch problem details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === "testInput") {
      setTestInputFile(e.target.files[0]);
    } else if (e.target.name === "testOutput") {
      setTestOutputFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForm = new FormData();
    for (const key in formData) {
      updatedForm.append(key, formData[key]);
    }

    if (testInputFile) updatedForm.append("testInput", testInputFile);
    if (testOutputFile) updatedForm.append("testOutput", testOutputFile);

    try {
      await updateProblemById(id, updatedForm);
      setMessage("✅ Problem updated successfully.");
      setTimeout(() => navigate("/manage-problems"), 1500);
    } catch (err) {
      console.error("Error updating problem:", err);
      setMessage("❌ Failed to update problem.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Problem</h2>
      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          rows="4"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Tags (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          placeholder="Rating"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="sampleInput"
          value={formData.sampleInput}
          onChange={handleChange}
          placeholder="Sample Input"
          rows="2"
          className="w-full p-2 border rounded"
        />
        <textarea
          name="sampleOutput"
          value={formData.sampleOutput}
          onChange={handleChange}
          placeholder="Sample Output"
          rows="2"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="timeLimit"
          value={formData.timeLimit}
          onChange={handleChange}
          placeholder="Time Limit (s)"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="memoryLimit"
          value={formData.memoryLimit}
          onChange={handleChange}
          placeholder="Memory Limit (MB)"
          className="w-full p-2 border rounded"
        />

        <div className="flex items-end gap-4 mb-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Test Input
            </label>
            <label className="inline-flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md cursor-pointer hover:bg-blue-600 transition-colors w-36 justify-center">
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
            <label className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-sm rounded-md cursor-pointer hover:bg-green-600 transition-colors w-36 justify-center">
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
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update Problem
        </button>
      </form>
    </div>
  );
};

export default EditProblem;
