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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Problems</h2>
      <ul className="space-y-4">
        {problems.map((problem) => (
          <li key={problem._id} className="border p-4 rounded shadow">
            <Link to={`/problems/${problem._id}`}>
              <h3 className="text-lg font-bold hover:underline">
                {problem.title}
              </h3>
            </Link>
            <h3 className="text-lg font-bold">{problem.title}</h3>
            <p className="text-sm">Difficulty: {problem.difficulty}</p>
            <p className="text-sm text-gray-600">
              Tags: {problem.tags.join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProblemList;
