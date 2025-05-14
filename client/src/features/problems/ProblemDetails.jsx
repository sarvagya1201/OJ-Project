import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../../services/problemService";
import { BlockMath } from "react-katex";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const ProblemDetails = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <pre className="bg-gray-100 p-2 rounded">
          <ReactMarkdown
            children={problem.sampleInput}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold">Sample Output</h2>
        <pre className="bg-gray-100 p-2 rounded"><ReactMarkdown
            children={problem.sampleOutput}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          /></pre>
      </div>

      <p className="text-sm text-gray-600 mb-1">
        Tags: {problem.tags.join(", ")}
      </p>
      <p className="text-sm">
        Time Limit: {problem.timeLimit} sec | Memory Limit:{" "}
        {problem.memoryLimit} MB
      </p>
    </div>
  );
};

export default ProblemDetails;
