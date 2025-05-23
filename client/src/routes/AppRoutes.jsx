import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProblemsPage from "../pages/ProblemsPage";
import ProblemDetailsPage from "../pages/ProblemDetailsPage";
import AddProblemPage from "../pages/AddProblemPage";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SubmitPage from "../pages/SubmitPage";
import ManageProblemsPage from "../pages/ManageProblemsPage";
import EditProblemPage from "../pages/EditProblemPage";
import MySubmissionsPage from "../pages/MySubmissionsPage";
import ProblemAllSubmissionsPage from "../pages/ProblemAllSubmissionPage";
import UserDashboardPage from "../pages/UserDashboardPage";


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
      <Route path="/problems/:id/submissions" element={<ProblemAllSubmissionsPage  />} />
      <Route path="/add-problem" element={user?.role === 'admin' ? <AddProblemPage /> : <Navigate to="/problems" />} />
      <Route path="/manage-problems" element={user?.role === 'admin' ? <ManageProblemsPage /> : <Navigate to="/problems" />} />
      <Route path="/edit-problem/:id" element={user?.role === 'admin' ? <EditProblemPage /> : <Navigate to="/problems" />} />
      <Route path="/submit/:problemId" element={<SubmitPage />} />
      <Route path="/submissions" element={<MySubmissionsPage />} />
      <Route path="/user/dashboard" element={<UserDashboardPage />} />

      </Routes>
    
  );
};

export default AppRoutes;
  