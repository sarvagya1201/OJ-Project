import { useEffect, useState } from "react";
import { getAllProblems } from "../../services/problemService";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchTags, setSearchTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
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

      const matchesTags =
        searchTags.length === 0 ||
        searchTags.every((searchTag) =>
          problem.tags.some((tag) =>
            tag.toLowerCase().includes(searchTag.toLowerCase())
          )
        );

      return matchesName && matchesTags;
    });

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.difficulty - b.difficulty);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.difficulty - a.difficulty);
    }

    setFilteredProblems(filtered);
  }, [searchName, searchTags, sortOrder, problems]);

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
        {/* Search by name */}
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="p-2 rounded-md border bg-zinc-200 dark:bg-zinc-800 dark:text-white"
        />

        {/* Search by tags with pills */}
        <div className="flex items-center flex-wrap gap-2 p-2 rounded-md border bg-zinc-200 dark:bg-zinc-800 dark:text-white min-h-[40px]">
          {searchTags.map((tag, i) => (
            <span
              key={i}
              className="bg-zinc-300 text-zinc-800 dark:bg-zinc-600 dark:text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            >
              #{tag}
              <button
                onClick={() =>
                  setSearchTags(searchTags.filter((_, index) => index !== i))
                }
                className="ml-1 text-sm"
              >
                &times;
              </button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Search by tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter" || e.key === "Tab") && tagInput.trim()) {
                setSearchTags([...searchTags, tagInput.trim()]);
                setTagInput("");
                e.preventDefault();
              } else if (
                e.key === "Backspace" &&
                tagInput === "" &&
                searchTags.length
              ) {
                setSearchTags(searchTags.slice(0, -1));
              }
            }}
            className="bg-transparent outline-none flex-1"
          />
        </div>

        {/* Sort order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 rounded-md border bg-zinc-200 dark:bg-zinc-800 dark:text-white"
        >
          <option value="none">Sort by Difficulty</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* Table */}
      <div className="backdrop-blur-xl  bg-white/30 dark:bg-zinc-900/40 rounded-2xl shadow-2xl border border-white/30 dark:border-zinc-700/50 overflow-x-auto">
        <table className="w-full text-sm  text-left text-gray-900 dark:text-gray-200">
          <thead className=" bg-zinc-200 dark:bg-zinc-800/70 backdrop-blur-md sticky top-0">
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
                className="border-b  border-zinc-200 dark:border-zinc-700"
              >
                <th className="px-6 py-4 font-medium text-indigo-600 dark:text-indigo-400">
                  {problem.title}
                </th>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </td>
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
