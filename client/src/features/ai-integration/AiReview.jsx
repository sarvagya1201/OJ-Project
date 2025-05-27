import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import { Tabs, TabItem } from "flowbite-react";
import { HiCode, HiOutlineSparkles } from "react-icons/hi";

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

      {/* Main Tab Layout */}
      {/* Tabs */}
      <Tabs aria-label="Submission Review Tabs">
        {/* Tab 1: AI Review */}
        <TabItem active title="AI Review" icon={HiOutlineSparkles}>
          <div className="mt-4 border p-4 rounded-lg shadow bg-white dark:bg-gray-900 prose dark:prose-invert">
            <h2 className="text-xl font-bold mb-2">AI Code Review</h2>
            {loadingReview ? (
              <div className="flex items-center">
                <div className="w-6 h-6 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-blue-500">Getting AI Review...</span>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
                      {...props}
                    />
                  ),
                }}
              >
                {aiReview}
              </ReactMarkdown>
            )}
          </div>
        </TabItem>
        {/* Tab 2: Code */}
        <TabItem  title="Submitted Code" icon={HiCode}>
          <div className="mt-4 border p-2 rounded-lg shadow bg-white dark:bg-gray-900">
            <MonacoEditor
              height="100vh"
              theme="vs-dark"
              language={submission.language || "cpp"}
              value={submission.code}
              options={{ readOnly: true, fontSize: 14 }}
            />
          </div>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default Review;
