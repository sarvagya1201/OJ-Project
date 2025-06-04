import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import moment from "moment";
import HeatMap from "@uiw/react-heat-map";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { motion } from "framer-motion";
import "react-tooltip/dist/react-tooltip.css";
import "../../Heatmap.css";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [status, setStatus] = useState({ message: "", type: "" });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/change-password", form);
      setStatus({
        message: res.data.message || "Password changed successfully!",
        type: "success",
      });
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setStatus({
        message: err.response?.data?.message || "Failed to change password.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/user/dashboard");
        setUserData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  const heatmapValues = userData
    ? Object.entries(userData.heatmap).map(([date, count]) => ({
        date,
        count,
      }))
    : [];

  useEffect(() => {
    import("react-tooltip").then(({ Tooltip }) => {
      Tooltip.rebuild?.();
    });
  }, [heatmapValues]);

  const today = new Date();
  const oneYearAgo = moment().subtract(12, "months").toDate();

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 dark:text-gray-200 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* User Info */}
      <motion.div
        className="bg-white dark:bg-zinc-800/80 shadow-lg rounded-lg p-6 mb-6"
        variants={fadeIn}
      >
        <p className="text-xl font-semibold mb-1">👤 {userData.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          📧 {userData.email}
        </p>

        <motion.button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => setChangePasswordVisible(!changePasswordVisible)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {changePasswordVisible ? "Cancel" : "Change Password"}
        </motion.button>

        {changePasswordVisible && (
          <motion.form
            onSubmit={handleChangePassword}
            className="mt-5 space-y-3 max-w-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
            {status.message && (
              <p
                className={`text-sm mt-1 ${
                  status.type === "success"
                    ? "text-green-600"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {status.message}
              </p>
            )}
          </motion.form>
        )}

        <Link
          to="/submissions"
          className="inline-block ml-4 mt-4 text-blue-600 hover:underline dark:text-blue-400"
        >
          View My Submissions
        </Link>
      </motion.div>

      {/* Heatmap */}
      <motion.div
        className="bg-white dark:bg-zinc-800/80 shadow-lg rounded-lg p-6 mb-6 overflow-x-auto"
        variants={fadeIn}
      >
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          🔥 Activity Heatmap (Last 1 Year)
        </h2>
        <div className="min-w-[1000px]">
          <HeatMap
            value={heatmapValues}
            startDate={oneYearAgo}
            endDate={today}
            width={1050}
            style={{
              color: "var(--font-color)",
              fontSize: "0.7rem",
              "--rhm-rect-active": "var(--rhm-rect-active)",
            }}
            rectSize={16}
            space={3}
            panelColors={{
              0: "var(--color-0)",
              1: "var(--color-1)",
              3: "var(--color-3)",
              5: "var(--color-5)",
              10: "var(--color-10)",
            }}
            rectRender={(props, data) => (
              <rect
                {...props}
                data-tooltip-id="heatmap-tooltip"
                data-tooltip-content={
                  data.date
                    ? `${data.date}: ${data.count || 0} submissions`
                    : "No data"
                }
                className="cursor-pointer"
              />
            )}
          />
        </div>
        <Tooltip id="heatmap-tooltip" />
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        variants={fadeIn}
      >
        {[
          { value: userData.problemsSolvedAllTime, label: "All-Time Solved" },
          { value: userData.problemsSolvedLastYear, label: "Solved This Year" },
          { value: userData.problemsSolvedLastMonth, label: "Solved This Month" },
          { value: userData.maxStreakAllTime, label: "Max Streak (All Time)" },
          { value: userData.maxStreakLastYear, label: "Streak This Year" },
          { value: userData.maxStreakLastMonth, label: "Streak This Month" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white dark:bg-zinc-800/80 p-6 rounded-lg shadow-lg hover:shadow-2xl transition select-text"
          >
            <p className="text-3xl font-extrabold text-gray-800 dark:text-white">
              {item.value}
            </p>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400 font-semibold">
              {item.label}
            </p>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
