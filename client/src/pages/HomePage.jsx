import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  CloudLightning ,
  BrainCircuit,
  LayoutDashboard,
} from "lucide-react";

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      title: "Real-Time Code Judging",
      description: "Submit your code and get instant feedback with detailed output comparison.",
      color: "from-blue-400 to-indigo-500",
      icon: <CloudLightning  className="w-8 h-8 mb-3 text-white" />,
    },
    {
      title: "AI Code Review",
      description: "Let AI review your solution and suggest improvements for cleaner, better code.",
      color: "from-purple-500 to-pink-500",
      icon: <BrainCircuit className="w-8 h-8 mb-3 text-white" />,
    },
    {
      title: "Personal Dashboard",
      description: "Track your submissions, monitor streaks, and see your problem-solving growth.",
      color: "from-green-400 to-emerald-500",
      icon: <LayoutDashboard className="w-8 h-8 mb-3 text-white" />,
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-xl bg-white/30 dark:bg-white/10 rounded-2xl p-10 max-w-2xl w-full shadow-2xl border border-white/30 dark:border-white/20"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-indigo-600 dark:text-indigo-400">Algorun Judge</span>
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8 text-lg">
          Practice coding problems and get instant feedback — powered by AI.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          {!user ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="w-full block text-center bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
                >
                  Login
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="w-full block text-center bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
                >
                  Register
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/problems"
                  className="w-full block text-center bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-600 transition"
                >
                  Browse Problems
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/problems"
                  className="w-full block text-center bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-600 transition"
                >
                  Browse Problems
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/submissions"
                  className="w-full block text-center bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-800 transition"
                >
                  My Submissions
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/user/dashboard"
                  className="w-full block text-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
                >
                  Dashboard
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl w-full px-4">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-2xl p-6 text-white shadow-xl transition-all backdrop-blur-xl bg-gradient-to-br ${feature.color} border border-white/30 dark:border-white/20`}
          >
            <div className="flex flex-col items-center text-center">
              {feature.icon}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
