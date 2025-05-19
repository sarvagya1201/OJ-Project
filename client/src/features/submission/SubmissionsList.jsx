import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import useDarkMode from "../../hooks/useDarkMode";
import { useLocation } from "react-router-dom";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [viewingCode, setViewingCode] = useState(null);
  const [selectedLang, setSelectedLang] = useState("cpp"); // For syntax highlighting
  const { isDark } = useDarkMode();
  const fetchSubmissions = async () => {
    try {
      const res = await axiosInstance.get("/submissions/my-submissions", {
        withCredentials: true,
      });
      setSubmissions(res.data.submissions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);
  const location = useLocation();
  const highlightedId = location.state?.highlightedId;
  const monacoRef = useRef(null);

  // Capture monaco instance before mount
  const handleBeforeMount = (monaco) => {
    monacoRef.current = monaco;
  };

  // Dynamically set Monaco theme when dark mode changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(isDark ? "vs-dark" : "light");
    }
  }, [isDark]);

  const langMap = {
    cpp: "cpp",
    python: "python",
    java: "java",
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-2">
                #
              </th>
              <th scope="col" className="px-4 py-2">
                Date & Time
              </th>
              <th scope="col" className="px-4 py-2">
                Problem
              </th>
              <th scope="col" className="px-4 py-2">
                Language
              </th>
              <th scope="col" className="px-4 py-2">
                Verdict
              </th>
              <th scope="col" className="px-4 py-2">
                Code
              </th>
              {/* <th scope="col" className="px-4 py-2">
                Run Time
              </th> */}
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, index) => (
              <tr
                key={s._id}
                className={`relative overflow-visible ${
                  s._id === highlightedId
                    ? "bg-yellow-200 dark:bg-yellow-800"
                    : "bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
              >
                <td className="px-4 py-2 relative group cursor-pointer">
                  {index + 1}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                    Submission ID: {s._id}
                  </div>
                </td>
                <td className="px-4 py-2">
                  {new Date(s.submittedAt).toLocaleString()}
                </td>

                <th
                  scope="row"
                  className="px-6 py-4 hover:underline font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <Link to={`/problems/${s.problem?._id}`}>
                    {s.problem?.title}
                  </Link>
                </th>
                <td className="px-4 py-2 capitalize">{s.language}</td>
                <td className="px-4 py-2 font-semibold relative group">
                  <span
                    className={
                      s.status === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {s.status}
                  </span>

                  {s.status !== "Accepted" && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-red-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                      {s.error}
                    </div>
                  )}
                </td>

                <td className="px-4 py-2 ">
                  <button
                    className="bg-gray-200 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-800 px-2 py-1  rounded text-sm"
                    onClick={() => {
                      setViewingCode(s.code);
                      setSelectedLang(langMap[s.language] || "cpp");
                      
                    }}
                  >
                    View Code
                  </button>
                </td>
                {/* <td className="px-4 py-2 capitalize">{s.runtime}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              beforeMount={handleBeforeMount}
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
    </>
  );
};

export default Submissions;
