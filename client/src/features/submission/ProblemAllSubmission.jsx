import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../services/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";

export default function ProblemSubmissions() {
  const { id: problemId } = useParams();
  const { user } = useAuth();
  const [mySubs, setMySubs] = useState([]);
  const [otherSubs, setOtherSubs] = useState([]);
  const [viewingCode, setViewingCode] = useState(null);
  const [selectedLang, setSelectedLang] = useState("cpp");
  const [problemTitle, setProblemTitle] = useState("");

  const langMap = {
    cpp: "cpp",
    python: "python",
    js: "javascript",
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
    const fetchProblem = async () => {
      try {
        const res = await axiosInstance.get(`/problems/${problemId}`);
        setProblemTitle(res.data.title);
      } catch (err) {
        console.error("Error fetching problem:", err);
        setProblemTitle("Problem not found");
      }
    };

    const fetchSubmissions = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/submissions/problem/${problemId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMySubs(data.userSubmissions || []);
        setOtherSubs(data.otherSubmissions || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProblem();
    fetchSubmissions();
  }, [problemId]);

  const SubmissionTable = ({ submissions, showCode }) => (
    <div className="relative overflow-x-auto bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-lg rounded-xl mt-4">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
        <thead className="text-xs uppercase bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Date & Time</th>
            <th className="px-4 py-2">User</th>
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
              <td className="px-4 py-2">
                {s.user?.name || (user && user.name) || "You"}
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
                {showCode && s.code ? (
                  <button
                    className="px-2 py-1 bg-zinc-300 dark:bg-zinc-600 rounded text-xs hover:bg-zinc-400 dark:hover:bg-zinc-500 transition"
                    onClick={() => {
                      setViewingCode(s.code);
                      setSelectedLang(langMap[s.language] || "cpp");
                    }}
                  >
                    View Code
                  </button>
                ) : (
                  <span className="text-gray-400">Hidden</span>
                )}
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
        <Link to={`/problems/${problemId}`}>
          <p className="text-lg text-center text-blue-600 dark:text-blue-400 font-semibold mb-6 hover:underline">
            {problemTitle}
          </p>
        </Link>

        <h2 className="text-2xl font-bold mb-3">Your Submissions</h2>
        {mySubs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No submissions yet.</p>
        ) : (
          <SubmissionTable submissions={mySubs} showCode={true} />
        )}

        <h2 className="text-2xl font-bold mt-8 mb-3">
          Other Users' Submissions
        </h2>
        {otherSubs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No other submissions yet.
          </p>
        ) : (
          <SubmissionTable submissions={otherSubs} showCode={false} />
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
