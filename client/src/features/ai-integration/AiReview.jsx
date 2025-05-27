import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import moment from "moment";

const Review = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState(null);
  const [problem, setProblem] = useState(null);
  const [aiReview, setAiReview] = useState("");
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

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
        setLoadingData(false);
      }
    };

    fetchSubmissionAndProblem();
  }, [submissionId]);

  // Call Gemini API with problem + code + verdict
  useEffect(() => {
    const fetchAiReview = async () => {
      if (!problem || !submission) return;

      if (!problem.description || !submission.code || !submission.status) {
        console.log("ERROR FETCHING DATA");
        return;
      }

      console.log("Calling Gemini API with verdict:", submission.status);
      setLoadingReview(true);
      try {
        const { data } = await axiosInstance.post("/gemini/review", {
          question: problem.description.trim(),
          code: submission.code.trim(),
          verdict: submission.status,
        });

        setAiReview(data.review || "No review received.");
      } catch (error) {
        console.error(
          "❌ Gemini API error:",
          error.response?.data || error.message
        );
        setAiReview("❌ Failed to fetch AI review.");
      }
      setLoadingReview(false);
    };

    fetchAiReview();
  }, [problem, submission]);

  if (loadingData) return <p className="p-6">Loading...</p>;
  if (!submission || !problem)
    return <p className="p-6">❌ Submission or problem not found.</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Submission Meta Info */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700 dark:text-gray-300">
        <div>
          <span className="font-semibold">🕒 Submitted:</span>
          <br />
          {moment(submission.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
        </div>
        <div>
          <span className="font-semibold">📌 Problem:</span>
          <br />
          {problem.title}
        </div>
        <div>
          <span className="font-semibold">💻 Language:</span>
          <br />
          {submission.language}
        </div>
        <div>
          <span className="font-semibold">✅ Verdict:</span>
          <br />
          <span
            className={`font-semibold ${
              submission.status === "Accepted"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {submission.status}
          </span>
        </div>
        <div>
          <span className="font-semibold">⚡ Run Time:</span>
          <br />
          {submission.time ? `${submission.time} ms` : "N/A"}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[75vh]">
        {/* Submitted Code */}
        <div className="border rounded-xl shadow bg-white dark:bg-gray-900 p-4 flex flex-col h-full">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Submitted Code
          </h2>
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              theme="vs-dark"
              language={submission.language || "cpp"}
              value={submission.code}
              options={{ readOnly: true, fontSize: 14 }}
            />
          </div>
        </div>

        {/* AI Review */}
        <div className="border rounded-xl shadow bg-white dark:bg-gray-900 p-4 overflow-auto h-full">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            AI Code Review
          </h2>
          <div className="prose dark:prose-invert whitespace-pre-wrap">
            {loadingReview ? (
              <div className="flex justify-center items-center h-full p-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-blue-500 text-sm font-medium">
                  Getting AI Review...
                </span>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-gray-100 dark:bg-gray-800 p-1 rounded"
                      {...props}
                    />
                  ),
                }}
              >
                {aiReview}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
