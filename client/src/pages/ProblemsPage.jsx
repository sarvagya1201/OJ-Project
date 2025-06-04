// src/pages/ProblemsPage.jsx
import ProblemList from "../features/problems/ProblemList";
import { useAuth } from "../context/AuthContext";
import AdminControls from "../features/auth/AdminControls";
import { motion } from "framer-motion";

const ProblemsPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 dark:text-white">
        Algorun Problemset
      </h1>

      {user?.role === "admin" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap justify-center gap-4"
          aria-label="Admin Controls"
        >
          <AdminControls />
        </motion.div>
      )}

      <ProblemList />
    </div>
  );
};

export default ProblemsPage;
