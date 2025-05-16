// src/pages/ProblemsPage.jsx
import ProblemList from "../features/problems/ProblemList";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import AdminControls from "../features/auth/AdminControls";

const ProblemsPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl text-center font-bold p-4">Algorun Problemset</h1>
      {user?.role === "admin" && (
        <div className="mb-6">
          <AdminControls />
        </div>
      )}
      <ProblemList />
    </div>
  );
};

export default ProblemsPage;
