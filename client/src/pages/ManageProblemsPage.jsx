import ManageProblem from "../features/problems/ManageProblem";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ManageProblemsPage = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin")
    return <p>You are not authorized to add problems.</p>;

  return (
    <div>
      <ManageProblem/>
    </div>
  );
};

export default ManageProblemsPage;
