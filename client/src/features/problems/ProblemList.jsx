// src/features/problems/ProblemList.jsx
import { useEffect, useState } from "react";
import { getAllProblems } from "../../services/problemService";
import { Link } from "react-router-dom";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Loading problems...</p>;

  return (
    <>
      {/* <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Browse all Problems</h2>

      <div className="space-y-4">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="flex justify-between items-start border p-4 rounded shadow hover:shadow-md transition-shadow"
          >
            <div>
              <Link to={`/problems/${problem._id}`}>
                <h3 className="text-lg font-semibold text-white-600 hover:underline">
                  {problem.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-500">Tags: {problem.tags.join(", ")}</p>
            </div>
            <p className="text-sm font-medium text-gray-500">{problem.difficulty}</p>
          </div>
        ))}
      </div>
    </div> */}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Problem Name
              </th>

              <th scope="col" className="px-6 py-3">
                Tags
              </th>
              <th scope="col" className="px-6 py-3">
                Rating
              </th>
              {/* <th scope="col" className="px-6 py-3">
              <span className="sr-only">Edit</span>
            </th> */}
            </tr>
          </thead>
          {problems.map((problem) => (
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th
                  scope="row"
                  className="px-6 py-4 transition-shadow font-medium text-gray-900 whitespace-nowrap dark:text-white "
                >
                  <Link to={`/problems/${problem._id}`}>
                    <div className="hover:underline">{problem.title}</div>
                  </Link>
                </th>
                <td className="px-6 py-4">{problem.tags.join(", ")}</td>
                <td className="px-6 py-4">{problem.difficulty}</td>

                {/* <td className="px-6 py-4 text-right">
              <a
                href="#"
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
              >
                Edit
              </a>
            </td> */}
              </tr>
            </tbody>
          ))}
        </table>
      </div>
    </>
  );
};

export default ProblemList;
