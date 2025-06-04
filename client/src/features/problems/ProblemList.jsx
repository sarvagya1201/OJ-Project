import { useEffect, useState } from "react";
import { getAllProblems } from "../../services/problemService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        setProblems(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading problems...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div
        className="backdrop-blur-xl bg-white/30 dark:bg-zinc-900/40
                   rounded-2xl shadow-2xl border border-white/30 dark:border-zinc-700/50
                   overflow-x-auto"
      >
        <table className="w-full text-sm text-left text-gray-900 dark:text-gray-200">
          <thead className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md sticky top-0">
            <tr>
              <th className="px-6 py-3 font-semibold">Problem Name</th>
              <th className="px-6 py-3 font-semibold">Tags</th>
              <th className="px-6 py-3 font-semibold">Rating</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <motion.tr
                key={problem._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{
                  scale: 1.03,
                  backgroundColor: "rgba(255,255,255,0.4)",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/problems/${problem._id}`)}
                className="border-b border-white/20 dark:border-zinc-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400"
                >
                  {problem.title}
                </th>
                <td className="px-6 py-4">{problem.tags.join(", ")}</td>
                <td className="px-6 py-4">{problem.difficulty}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
