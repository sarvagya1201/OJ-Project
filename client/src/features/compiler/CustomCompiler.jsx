import React, { useState, useEffect } from "react";
import CodeEditor from "../../components/CodeEditor";
import axiosInstance from "../../services/axiosInstance";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function CustomCompilerPage() {
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [tcLoading, setTcLoading] = useState(false);
  const [showTcBlock, setShowTcBlock] = useState(false);
  const [tcResult, setTcResult] = useState("");
  const [message, setMessage] = useState("");
  const boilerplates = {
    cpp: `#include <bits/stdc++.h>
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

  const handleRun = async () => {
    if (code.trim() === boilerplates[language].trim()) {
      setMessage("⚠️ Code cannot be empty or just boilerplate.");
      return;
    }

    setIsRunning(true);
    setOutput(null);
    setMessage("");

    try {
      const res = await axiosInstance.post("/compile", {
        language,
        code,
        input,
      });
      setOutput(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Runtime error");
    } finally {
      setIsRunning(false);
    }
  };
  const handleTCAnalyze = async () => {
    setShowTcBlock(true);
    setTcLoading(true);
    try {
      const res = await axiosInstance.post("/gemini/time_comp", { code });
      setTcResult(res.data?.result || "No response received.");
    } catch (err) {
      setTcResult(err.response?.data?.error || "Failed to analyze complexity.");
    } finally {
      setTcLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center text-zinc-800 dark:text-white mb-8">
        Online Code Compiler
      </h2>

      {/* Language Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-40 p-2 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <div className="max-h-[500px] h-[500px] overflow-y-auto">
          <CodeEditor
            language={language}
            code={code}
            onChange={(value) => setCode(value)}
          />
        </div>

        <div className="h-[500px] flex flex-col space-y-4">
          {/* Input + Output */}
          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                Custom Input (stdin)
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-24 p-2 border rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                placeholder="Enter input for your code"
              />
            </div>

            {output && (
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded border dark:border-zinc-700 text-sm overflow-auto max-h-100">
                <p className="font-semibold mb-1">
                  💡 Status: {output.verdict}
                </p>
                <p className="text-xs text-gray-600 mb-2 dark:text-gray-300">
                  ⏱ Run Time: {output.time} ms
                </p>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200 mb-1">
                  Output (stdout)
                </label>
                <pre className="bg-white dark:bg-zinc-900 p-2 rounded border overflow-x-auto">
                  {output.output || output.error}
                </pre>
              </div>
            )}
            {message && (
              <div className="text-red-600 dark:text-red-400 font-semibold">
                ❌ {message}
              </div>
            )}
          </div>

          {/* Buttons - Fixed Size Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning}
              className={`py-2 px-4 text-white font-semibold rounded bg-green-600 hover:bg-green-700 transition duration-200 ${
                isRunning ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isRunning ? "Running..." : "Run"}
            </button>

            <button
              type="button"
              onClick={handleTCAnalyze}
              disabled={tcLoading}
              className={`relative py-2 px-4 text-white font-semibold rounded bg-indigo-600 hover:bg-indigo-700 transition duration-200 ${
                tcLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded-full shadow">
                New
              </span>
              {tcLoading ? "Analyzing..." : "📊 Analyze TC"}
            </button>
          </div>
        </div>
      </div>

      {/* Time Complexity Block */}
      {showTcBlock && (
        <div className="w-full mt-6 mb-40 p-4 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              📊 Time Complexity Analysis
            </h3>
            <button
              onClick={() => setShowTcBlock(false)}
              className="text-red-600 dark:text-red-400 text-xl font-bold hover:scale-110"
            >
              &times;
            </button>
          </div>
          {tcLoading ? (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Analyzing...
            </p>
          ) : (
            <div>
              <ReactMarkdown>{tcResult}</ReactMarkdown>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
