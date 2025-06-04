import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

export default function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [viewingCode, setViewingCode] = useState(null);
  const [selectedLang, setSelectedLang] = useState("cpp");

  const langMap = {
    cpp: "cpp",
    python: "python",
    java: "java",
  };

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axiosInstance.get("/submissions/my-submissions", {
          withCredentials: true,
        });
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubmissions();
  }, []);

  const SubmissionTable = ({ submissions }) => (
    <div className="relative overflow-x-auto bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-lg rounded-xl mt-4">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Date & Time</th>
            <th className="px-4 py-2">Problem</th>
            <th className="px-4 py-2">Language</th>
            <th className="px-4 py-2">Verdict</th>
            <th className="px-4 py-2">Code</th>
            <th className="px-4 py-2">Run Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s, index) => (
            <tr
              key={s._id}
              className="border-b hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                {formatDateTime(s.submittedAt || s.createdAt)}
              </td>
              <td className="px-4 py-2 font-medium text-blue-600 dark:text-blue-400 hover:underline">
                <Link to={`/problems/${s.problem?._id}`}>
                  {s.problem?.title || "Unknown"}
                </Link>
              </td>
              <td className="px-4 py-2 capitalize">{s.language}</td>
              <td className="px-4 py-2 font-semibold">
                <span
                  className={
                    s.status === "Accepted"
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {s.status}
                </span>
              </td>
              <td className="px-4 py-2">
                <button
                  className="px-2 py-1 bg-zinc-300 dark:bg-zinc-600 rounded text-xs hover:bg-zinc-400 dark:hover:bg-zinc-500 transition"
                  onClick={() => {
                    setViewingCode(s.code);
                    setSelectedLang(langMap[s.language] || "cpp");
                  }}
                >
                  View Code
                </button>
              </td>
              <td className="px-4 py-2">{s.time || s.runtime || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6"
      >
        <h2 className="text-2xl font-bold mb-3 text-center">My Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            You have not made any submissions yet.
          </p>
        ) : (
          <SubmissionTable submissions={submissions} />
        )}
      </motion.div>

      <AnimatePresence>
        {viewingCode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-zinc-800 rounded-lg overflow-hidden shadow-2xl w-11/12 h-5/6 relative"
            >
              <button
                className="absolute top-3 right-4 text-red-600 hover:text-red-700 text-2xl font-bold z-50"
                onClick={() => setViewingCode(null)}
              >
                &times;
              </button>
              <Editor
                height="100%"
                defaultLanguage={selectedLang}
                value={viewingCode}
                theme={isDark ? "vs-dark" : "light"}
                options={{
                  readOnly: true,
                  fontSize: 14,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  wordWrap: "on",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
