import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { submitCode } from "../../services/submissionService";
import axiosInstance from "../../services/axiosInstance";
import CodeEditor from "../../components/CodeEditor";
import { motion } from "framer-motion";

export default function SubmitForm() {
  const { problemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [problemTitle, setProblemTitle] = useState("");
  const boilerplates = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    // your code goes here
    return 0;
}`,
    python: `def main():
    # your code goes here
    pass

if __name__ == "__main__":
    main()`,
    java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
          // your code goes here
    }
}`,
  };

  useEffect(() => {
 
    setCode(boilerplates[language]);
  
}, [language]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axiosInstance.get(`/problems/${problemId}`);
        setProblemTitle(res.data.title);
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
      setMessage("⚠️ Please login to submit.");
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
      const { _id } = response.submission;
      navigate("/submissions", { state: { highlightedId: _id } });
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-4">
        Submit Your Solution
      </h2>
      <Link to={`/problems/${problemId}`}>
        <p className="text-lg text-center text-blue-600 dark:text-blue-400 font-medium mb-6 hover:underline">
          {problemTitle}
        </p>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white/70 dark:bg-zinc-900/60 p-6 rounded-xl shadow-lg backdrop-blur-md"
      >
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
          language={language}
          code={code}
          onChange={(value) => setCode(value)}
          className={`mb-4 border ${
            !code.trim() ? "border-red-500" : "border-zinc-300"
          }`}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded bg-blue-600 hover:bg-blue-700 transition duration-200 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Solution"}
        </button>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 dark:text-red-400 bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded p-3"
          >
            {message}
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
