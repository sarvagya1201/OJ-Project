import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import ThemeToggle from "../components/ThemeToggle";
import { motion } from "framer-motion";



const MotionLink = motion(Link);

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed");
    }
  };

  return (
    <header
      className="
        fixed top-0 left-0 right-0 z-50
        bg-white/30 dark:bg-zinc-900/30 
        backdrop-blur-md
        border-b border-white/20 dark:border-zinc-700/50
        text-black dark:text-white
        px-6 py-4
        flex justify-between items-center
        shadow-md
      "
    >
      <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold select-none">
        <img
          src="/logo.png"
          alt="Algorun Judge Logo"
          className="h-10 w-auto dark:invert"
        />
        
      </Link>

      <div className="flex items-center gap-6">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-5">
            <span className="whitespace-nowrap font-semibold">Hello, {user.name}</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="
                bg-red-600 hover:bg-red-700
                text-white font-medium
                px-4 py-2 rounded-lg
                shadow-md
                transition
                select-none
              "
              aria-label="Logout"
            >
              Logout
            </motion.button>
          </div>
        ) : (
          <div className="flex gap-6 text-lg font-semibold">
            <MotionLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              to="/login"
              className="hover:underline transition select-none"
            >
              Login
            </MotionLink>
            <MotionLink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              to="/register"
              className="hover:underline transition select-none"
            >
              Register
            </MotionLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
