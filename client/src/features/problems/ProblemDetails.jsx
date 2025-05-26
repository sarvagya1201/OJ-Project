import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../../services/problemService";
import { BlockMath } from "react-katex";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

  if (loading) return <p>Loading problem...</p>;
  if (!problem) return <p>Problem not found</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{problem.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        Difficulty: {problem.difficulty}
      </p>
      <div className="mb-4">
        <h2 className="font-semibold">Description</h2>
        <div className="prose max-w-none">
          <ReactMarkdown
            children={problem.description}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Sample Input</h2>
        <pre className="bg-gray-300 text-black dark:bg-zinc-800 dark:text-white p-2 rounded">
          <ReactMarkdown
            children={problem.sampleInput}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Sample Output</h2>
        <pre className="bg-gray-300 text-black dark:bg-zinc-800 dark:text-white p-2 rounded">
          <ReactMarkdown
            children={problem.sampleOutput}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </pre>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        Tags: {problem.tags.join(", ")}
      </p>
      <div className="flex gap-4 mt-4">
        <Link to={`/submit/${problem._id}`}>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Submit Solution
          </button>
        </Link>
        <Link to={`/submit-ai/${problem._id}`}>
          <button className="relative mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ease-in-out">
            <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded-full shadow">
              ✨ NEW ✨
            </span>
            Submit with AI Review 🚀
          </button>
        </Link>
        {user && (
          <Link to={`/problems/${problem._id}/submissions`}>
            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
              All Submissions
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProblemDetails;
