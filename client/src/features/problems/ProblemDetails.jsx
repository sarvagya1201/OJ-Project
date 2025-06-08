// src/features/problems/ProblemDetails.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProblemById } from "../../services/problemService";
import { useAuth } from "../../context/AuthContext";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { motion } from "framer-motion";
import "katex/dist/katex.min.css";

const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(id);
        setProblem(data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-lg text-gray-700 dark:text-gray-300 p-6"
      >
        Loading problem...
      </motion.div>
    );
  }

  if (!problem) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-500 font-semibold p-6"
      >
        Problem not found.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto p-6 bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow-lg backdrop-blur-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        {problem.title}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Difficulty: {problem.difficulty} &nbsp;|&nbsp; Time Limit:{" "}
        {problem.timeLimit}s &nbsp;|&nbsp; Memory Limit: {problem.memoryLimit}MB
      </p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Description
        </h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-sm">
          <ReactMarkdown
            children={problem.description || "_No description provided._"}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Sample Input
        </h2>
        <pre className="bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white p-3 rounded-md overflow-x-auto text-sm">
          <ReactMarkdown
            children={problem.sampleInput || "_None_"}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </pre>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Sample Output
        </h2>
        <pre className="bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-white p-3 rounded-md overflow-x-auto text-sm">
          <ReactMarkdown
            children={problem.sampleOutput || "_None_"}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </pre>
      </div>

      {problem.tags && (
        <div className="mb-6">
          <strong className="text-gray-700 dark:text-gray-400">Tags:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {problem.tags.map((tag, i) => (
              <span
                key={i}
                className="bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:text-white px-3 py-1 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mt-6">
        <Link to={`/submit/${problem._id}`}>
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition">
            Submit Solution
          </button>
        </Link>

        <Link to={`/submit-ai/${problem._id}`}>
          <button className="relative px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded-full shadow">
              ✨ NEW ✨
            </span>
            Submit with AI Review 🚀
          </button>
        </Link>

        {user && (
          <Link to={`/problems/${problem._id}/submissions`}>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
              All Submissions
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

export default ProblemDetails;
