// src/pages/AddProblemPage.jsx
import AddProblem from "../features/problems/AddProblem";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AddProblemPage = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin")
    return <p>You are not authorized to add problems.</p>;

  return (
    <div>
      <AddProblem />
    </div>
  );
};

export default AddProblemPage;
