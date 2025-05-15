import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../services/axiosInstance";
import { logoutUser } from "../services/authService";
import ThemeToggle from "../components/ThemeToggle";

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
    <header className="bg-gray-200 dark:bg-zinc-800 text-black dark:text-white px-4 py-3 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold flex items-center gap-2">
         <img src="../../logo.png" alt="Logo" className="h-10 w-auto dark:invert" />
      </Link>

      <div className="flex items-center gap-6">
        <div>
          <ThemeToggle />
        </div>
         
        {user ? (
          <div className="flex items-center gap-4">
            <span>Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
