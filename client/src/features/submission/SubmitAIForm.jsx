import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { submitCode } from "../../services/submissionService";
import axiosInstance from "../../services/axiosInstance";
import { Link } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor";
import { useNavigate } from "react-router-dom";

const SubmitAIForm = () => {
  const { problemId } = useParams();
  const { user } = useAuth();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosInstance.get(`/problems/${problemId}`);
        setProblemTitle(res.data.title);
        setProblemDescription(res.data.description);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setProblemTitle("Problem not found");
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please login to submit.");
      return;
    }
    if (!code.trim()) {
      setMessage("❌ Code cannot be empty.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const response = await submitCode({ problemId, code, language });
      const { status, output, error, _id } = response.submission;
      console.log("Verdict:", status, "| Output:", output, "| ID:", _id);

    //   const question = `Problem: ${problemTitle}\n\nDescription:\n${problemDescription}`;
    //   const aiResponse = await axiosInstance.post("/gemini/review", {
    //     question,
    //     verdict: status,
    //     code,
    //   });
    //   const aiReview = aiResponse.data.review || "No review received.";
    //   console.log("AI Review Response:", aiResponse.data);

      navigate(`/review/${_id}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-zinc-800 dark:text-white">
        Submit Your Solution
      </h2>
      <Link to={`/problems/${problemId}`}>
        <p className="text-lg text-center text-blue-600 dark:text-blue-400 font-medium mb-6">
          {problemTitle}{" "}
        </p>
      </Link>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <CodeEditor
          language={language === "cpp" ? "cpp" : language}
          code={code}
          onChange={(value) => setCode(value)}
          className={`mb-4 ${!code.trim() ? "border-red-500" : ""}`}
        />

        <>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-semibold rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 shadow-lg hover:scale-105 hover:shadow-xl transform transition duration-300 ease-in-out ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? "🤖 Reviewing with AI..."
              : "⚡ New Feature - ✨ Submit & Get AI Review 🚀"}
          </button>

          <p className="text-sm text-pink-500 text-center mt-2">
            Powered by Gemini AI 🤖
          </p>
        </>

        {message && (
          <div className="mt-4 px-4 py-3 sm:rounded-xl bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 shadow">
            <strong className="font-bold">!</strong> {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default SubmitAIForm;
