import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemDetailsPage from "../pages/ProblemDetailsPage";
import AddProblemPage from "../pages/AddProblemPage";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";


const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Homepage */}
      <Route path="/login" element={<LoginPage />} /> {/* Login page */}
      <Route path="/register" element={<RegisterPage />} />{" "}
      {/* Register page */}
      <Route path="/problems" element={<ProblemsPage />} />{" "}
      {/* Problems page */}
      <Route path="/problems/:id" element={<ProblemDetailsPage />} />
      <Route path="/add-problem" element={user?.role === 'admin' ? <AddProblemPage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
  