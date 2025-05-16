import { Link } from "react-router-dom";

const AdminControls = () => {
  return (
    <div className="my-6 p-4 border rounded bg-gray-50 dark:bg-gray-800 shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Admin Controls</h2>
      <div className="flex flex-wrap gap-4">
        <Link
          to="/add-problem"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Create Problem
        </Link>
        <Link
          to="/manage-problems"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Manage Problems
        </Link>
      </div>
    </div>
  );
};

export default AdminControls;