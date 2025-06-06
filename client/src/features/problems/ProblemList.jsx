import { useEffect, useState } from "react";
import { getAllProblems } from "../../services/problemService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);

  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getAllProblems();
        setProblems(data);
        setFilteredProblems(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    let filtered = problems.filter((problem) => {
      const matchesName = problem.title
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const matchesTag = searchTag
        ? problem.tags.some((tag) =>
            tag.toLowerCase().includes(searchTag.toLowerCase())
          )
        : true;

      return matchesName && matchesTag;
    });

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.difficulty - a.difficulty);
    }

    setFilteredProblems(filtered);
  }, [searchName, searchTag, sortOrder, problems]);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 dark:text-gray-300">
        Loading problems...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 rounded-md border dark:bg-zinc-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Search by tag"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="p-2 rounded-md border dark:bg-zinc-800 dark:text-white"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 rounded-md border dark:bg-zinc-800 dark:text-white"
        >
          <option value="none">Sort by Difficulty</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl bg-white/30 dark:bg-zinc-900/40 rounded-2xl shadow-2xl border border-white/30 dark:border-zinc-700/50 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-900 dark:text-gray-200">
          <thead className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-md sticky top-0">
            <tr>
              <th className="px-6 py-3 font-semibold">Problem Name</th>
              <th className="px-6 py-3 font-semibold">Tags</th>
              <th className="px-6 py-3 font-semibold">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {filteredProblems.map((problem, index) => (
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
                <th className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">
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
