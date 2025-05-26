// src/pages/Review.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";

const Review = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [problem, setProblem] = useState(null);
  const [aiReview, setAiReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubmissionAndProblem = async () => {
      try {
        const { data: sub } = await axiosInstance.get(
          `/submissions/${submissionId}`
        );
        setSubmission(sub);

        const { data: prob } = await axiosInstance.get(
          `/problems/${sub.problem}`
        );
        setProblem(prob);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionAndProblem();
  }, [submissionId]);

  // Call Gemini API with problem + code + verdict
  useEffect(() => {
    const fetchAiReview = async () => {
      if (!problem || !submission || !problem.description || !submission.code)
        return;
      setLoading(true);
      try {
        const { data } = await axiosInstance.post("/gemini/review", {
          question: problem.description.trim(),
          code: submission.code.trim(),
          verdict: submission.verdict || "No verdict",
        });

        setAiReview(data.review || "No review received.");
      } catch (error) {
        console.error(
          "❌ Gemini API error:",
          error.response?.data || error.message
        );
        setAiReview("❌ Failed to fetch AI review.");
      }
      setLoading(false);
    };

    fetchAiReview();
  }, [problem, submission]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!submission || !problem)
    return <p className="p-6">❌ Submission or problem not found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 h-[90vh]">
      {/* Code Editor */}
      <div className="border p-4 rounded-lg shadow h-full overflow-hidden">
        <h2 className="text-xl font-bold mb-2">Submitted Code</h2>
        <MonacoEditor
          height="calc(100% - 40px)"
          theme="vs-dark"
          language={submission.language || "cpp"}
          value={submission.code}
          options={{ readOnly: true, fontSize: 14 }}
        />
      </div>

      {/* AI Review */}
      <div className="border p-4 rounded-lg shadow overflow-auto h-full">
        <h2 className="text-xl font-bold mb-2">AI Code Review</h2>
        <div className="prose whitespace-pre-wrap">
          {loading ? (
            <div className="flex justify-center items-center h-full p-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-blue-500 text-sm font-medium">
                Getting AI Review...
              </span>
            </div>
          ) : (
            <div className="prose whitespace-pre-wrap">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded" {...props} />
                  ),
                }}
              >
                {aiReview}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
