import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
  },
  tap: {
    scale: 0.95,
  },
};

const AdminControls = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-6 flex flex-wrap gap-4"
      aria-label="Admin Controls"
    >
      <MotionLink
        to="/add-problem"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="
          px-5 py-2
          bg-green-600 dark:bg-green-500
          hover:bg-green-700 dark:hover:bg-green-600
          text-white rounded-md
          font-semibold
          shadow-md
          transition
          select-none
          whitespace-nowrap
        "
      >
        Create Problem
      </MotionLink>

      <MotionLink
        to="/manage-problems"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="
          px-5 py-2
          bg-blue-600 dark:bg-blue-500
          hover:bg-blue-700 dark:hover:bg-blue-600
          text-white rounded-md
          font-semibold
          shadow-md
          transition
          select-none
          whitespace-nowrap
        "
      >
        Manage Problems
      </MotionLink>
      <MotionLink
        to="/admin/users"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        className="
          px-5 py-2
          bg-pink-600 dark:bg-pink-500
          hover:bg-pink-700 dark:hover:bg-pink-600
          text-white rounded-md
          font-semibold
          shadow-md
          transition
          select-none
          whitespace-nowrap
        "
      >
        User Management
      </MotionLink>
    </motion.div>
  );
};

export default AdminControls;
