import { useEffect, useState } from "react";
import { getAllProblems, deleteProblemById } from "../../services/problemService";
import { Link } from "react-router-dom";

const ManageProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        await deleteProblemById(id);
        setProblems(problems.filter((problem) => problem._id !== id));
      } catch (err) {
        console.error("Error deleting problem:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          Loading problems...
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white/70 dark:bg-zinc-900/70 rounded-xl shadow-lg backdrop-blur-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Manage Problems
      </h2>

      {problems.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 italic">
          No problems found.
        </p>
      ) : (
        <ul className="space-y-4">
          {problems.map((problem) => (
            <li
              key={problem._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-zinc-800 rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 flex-1">
                <Link
                  to={`/problems/${problem._id}`}
                  className="text-lg font-semibold text-gray-900 dark:text-white hover:underline"
                >
                  {problem.title}
                </Link>
                <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Tags:{" "}
                  {problem.tags.length > 0
                    ? problem.tags.join(", ")
                    : <span className="italic text-gray-400">No tags</span>}
                </span>
                <span className="text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  Difficulty: {problem.difficulty}
                </span>
              </div>

              <div className="flex space-x-6 mt-3 sm:mt-0">
                <Link
                  to={`/edit-problem/${problem._id}`}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(problem._id)}
                  className="text-red-600 dark:text-red-400 font-semibold hover:underline cursor-pointer"
                  aria-label={`Delete problem ${problem.title}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageProblems;
