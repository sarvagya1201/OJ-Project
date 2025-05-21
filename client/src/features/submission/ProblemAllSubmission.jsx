import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../services/axiosInstance";

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
    const fetchSubmissions = async () => {
      try {
        if (!problemId) {
          console.error("Problem ID is missing");
          return;
        }

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

    fetchSubmissions();
  }, [problemId]);

  const SubmissionTable = ({ submissions, showCode }) => (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                {new Date(s.submittedAt || s.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2">
                {s.user?.name || (user && user.name) || "You"}
              </td>
              <td className="px-4 py-2 capitalize">{s.language}</td>
              <td className="px-4 py-2 font-semibold">
                <span
                  className={
                    s.status === "Accepted" ? "text-green-600" : "text-red-600"
                  }
                >
                  {s.status}
                </span>
              </td>
              <td className="px-4 py-2">
                {showCode && s.code ? (
                  <button
                    className="bg-gray-200 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800 px-2 py-1 rounded text-sm"
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
      <Link to={`/problems/${problemId}`}>
        <p className="text-lg text-center text-blue-600 dark:text-blue-400 font-medium mb-6">
          {problemTitle}{" "}
        </p>
      </Link>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Your Submissions</h2>
        {mySubs.length === 0 ? (
          <p className="text-gray-600">No submissions yet.</p>
        ) : (
          <SubmissionTable submissions={mySubs} showCode={true} />
        )}

        <h2 className="text-2xl font-bold mt-8 mb-4">
          Other Users' Submissions
        </h2>
        {otherSubs.length === 0 ? (
          <p className="text-gray-600">No other submissions yet.</p>
        ) : (
          <SubmissionTable submissions={otherSubs} showCode={false} />
        )}

        {viewingCode && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-gray-300 dark:bg-gray-700 p-2 rounded-xl w-11/12 h-5/6 shadow-xl relative">
              <button
                className="absolute top-2 right-2 text-red-700 text-lg font-bold z-50"
                onClick={() => setViewingCode(null)}
              >
                ×
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
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
