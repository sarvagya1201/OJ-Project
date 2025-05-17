import EditProblem from "../features/problems/EditProblem";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EditProblemPage = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin")
    return <p>You are not authorized to add problems.</p>;

  return (
    <div>
      <EditProblem />
    </div>
  );
};

export default EditProblemPage;
