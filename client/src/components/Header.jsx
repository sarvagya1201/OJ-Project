import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import ThemeToggle from "./ThemeToggle";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const linkClasses = (path) =>
    `transition hover:text-blue-600 dark:hover:text-indigo-400 ${
      location.pathname === path ? "font-bold underline" : ""
    }`;

  const shouldShowNav = user && location.pathname !== "/";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50
      bg-white/30 dark:bg-zinc-900/30 
      backdrop-blur-md border-b 
      border-white/20 dark:border-zinc-700/50
      text-black dark:text-white
      px-6 py-4 flex justify-between items-center shadow-md"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 text-2xl font-extrabold select-none">
        <img
          src="/logo.png"
          alt="Algorun Judge Logo"
          className="h-10 w-auto dark:invert"
        />
        
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-6 text-sm sm:text-base">
        <ThemeToggle />

        {user ? (
          <>
            {shouldShowNav && (
              <nav className="flex gap-4 font-semibold">
                <MotionLink to="/problems" className={linkClasses("/problems")}>
                  Problems
                </MotionLink>
                <MotionLink to="/submissions" className={linkClasses("/submissions")}>
                  Submissions
                </MotionLink>
                <MotionLink to="/user/dashboard" className={linkClasses("/user/dashboard")}>
                  Dashboard
                </MotionLink>
              </nav>
            )}

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline font-semibold">Hi, {user.name}</span>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-md"
              >
                Logout
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex gap-4 text-lg font-semibold">
            <MotionLink to="/login" className="hover:underline">Login</MotionLink>
            <MotionLink to="/register" className="hover:underline">Register</MotionLink>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
