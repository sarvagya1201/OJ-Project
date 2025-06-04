import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import MonacoEditor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import { Tabs, TabItem } from "flowbite-react";
import { HiCode, HiOutlineSparkles } from "react-icons/hi";
import { motion } from "framer-motion";

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

  useEffect(() => {
    const fetchAiReview = async () => {
      if (!problem || !submission) return;
      if (!problem.description || !submission.code || !submission.status)
        return;

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

  if (loadingData)
    return (
      <motion.p
        className="p-6 text-center text-zinc-700 dark:text-zinc-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading...
      </motion.p>
    );

  if (!submission || !problem)
    return (
      <motion.p
        className="p-6 text-center text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ❌ Submission or problem not found.
      </motion.p>
    );

  return (
    <motion.div
      className="p-6 space-y-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Submission Meta Info */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm text-zinc-800 dark:text-zinc-300">
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
    className={`font-semibold text-lg md:text-xl ${
      submission.status === "Accepted" ? "text-green-600" : "text-red-500"
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

      {/* Tabs */}
      <Tabs aria-label="Submission Review Tabs" className="bg-transparent">
        {/* AI Review Tab */}
        <TabItem active title="AI Review" icon={HiOutlineSparkles}>
          <motion.div
            className="mt-4 border p-6 rounded-xl shadow-lg bg-white dark:bg-zinc-900 prose dark:prose-invert min-h-[200px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">AI Code Review</h2>

            {loadingReview ? (
              <div className="flex items-center justify-center space-x-3 text-blue-600 dark:text-blue-400">
                <div className="w-7 h-7 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium text-lg">
                  Getting AI Review...
                </span>
              </div>
            ) : (
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-2xl font-semibold" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded font-mono"
                      {...props}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      className="bg-gray-100 dark:bg-zinc-800 rounded p-3 overflow-auto"
                      {...props}
                    />
                  ),
                }}
              >
                {aiReview}
              </ReactMarkdown>
            )}
          </motion.div>
        </TabItem>

        {/* Submitted Code Tab */}
        <TabItem title="Submitted Code" icon={HiCode}>
          <motion.div
            className="mt-4 border rounded-xl shadow-lg bg-white dark:bg-zinc-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ height: "70vh" }}
          >
            <MonacoEditor
              height="100%"
              theme="vs-dark"
              language={submission.language || "cpp"}
              value={submission.code}
              options={{
                readOnly: true,
                fontSize: 14,
                minimap: { enabled: false },
              }}
            />
          </motion.div>
        </TabItem>
      </Tabs>
    </motion.div>
  );
};

export default Review;
