import { useEffect, useState } from "react";
import {
  getAllProblems,
  deleteProblemById,
} from "../../services/problemService";
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

  if (loading) return <p className="p-4">Loading problems...</p>;

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Manage Problems</h2>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-400 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Problem Name</th>
              <th className="px-6 py-3">Tags</th>
              <th className="px-6 py-3">Rating</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr
                key={problem._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  <Link to={`/problems/${problem._id}`} className="hover:underline">
                    {problem.title}
                  </Link>
                </td>
                <td className="px-6 py-4">{problem.tags.join(", ")}</td>
                <td className="px-6 py-4">{problem.difficulty}</td>
                <td className="px-6 py-4 space-x-4">
                  <Link
                    to={`/edit-problem/${problem._id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(problem._id)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageProblems;
