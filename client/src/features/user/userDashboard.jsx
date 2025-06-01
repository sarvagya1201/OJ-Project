import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import moment from "moment";
import HeatMap from "@uiw/react-heat-map";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "../../Heatmap.css";

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
    : []; // Provide a default empty array or handle the null case appropriately
  useEffect(() => {
    import("react-tooltip").then(({ Tooltip }) => {
      Tooltip.rebuild?.();
    });
  }, [heatmapValues]);
  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  // const sixMonthsAgo = moment().subtract(6, "months").format("YYYY-MM-DD");
  // const today = moment().format("YYYY-MM-DD");
  const today = new Date(); // JS Date object for today
  const sixMonthsAgo = moment().subtract(12, "months").toDate(); // convert moment to JS Date
  // console.log(sixMonthsAgo);
  return (
    <div className="max-w-6xl mx-auto p-4 dark:bg-gray-900 dark:text-gray-200 min-h-screen">
      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
        <p className="text-lg font-medium">👤 {userData.name}</p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          📧 {userData.email}
        </p>

        <button
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setChangePasswordVisible(!changePasswordVisible)}
        >
          {changePasswordVisible ? "Cancel" : "Change Password"}
        </button>
        {changePasswordVisible && (
          <form
            onSubmit={handleChangePassword}
            className="mt-4 space-y-3 max-w-sm"
          >
            <input
              type="password"
              placeholder="Current Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={form.currentPassword}
              onChange={(e) =>
                setForm({ ...form, currentPassword: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
            {status.message && (
              <p
                className={`text-sm mt-2 ${
                  status.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.message}
              </p>
            )}
          </form>
        )}
        <Link
          to="/submissions"
          className="ml-4 text-blue-500 hover:underline dark:text-blue-400"
        >
          View My Submissions
        </Link>
      </div>

      {/* Heatmap */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6 w-full overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
          🔥 Activity Heatmap (Last 6 Months)
        </h2>
        <div className="min-w-[1000px] justify-items-center">
          {/* Ensures wide layout */}
          <HeatMap
            value={heatmapValues}
            startDate={sixMonthsAgo}
            width={1100}
            style={{
              color: "var(--font-color)", // Use CSS var for font color
              fontSize: "0.7rem",
              "--rhm-rect-active": "var(--rhm-rect-active)", // Active rect color from var
            }}
            endDate={today}
            rectSize={16}
            space={3}
            panelColors={{
              0: "var(--color-0)", // Use CSS vars for panel colors
              1: "var(--color-1)",
              3: "var(--color-3)",
              5: "var(--color-5)",
              10: "var(--color-10)",
            }}
            rectRender={(props, data) => {
              return (
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
              );
            }}
          />
        </div>
        <Tooltip id="heatmap-tooltip" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold">{userData.problemsSolvedAllTime}</p>
          <p className="text-sm">All-Time Solved</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold">
            {userData.problemsSolvedLastYear}
          </p>
          <p className="text-sm">Solved This Year</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold">
            {userData.problemsSolvedLastMonth}
          </p>
          <p className="text-sm">Solved This Month</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold">{userData.maxStreakAllTime}</p>
          <p className="text-sm">Max Streak (All Time)</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold">{userData.maxStreakLastYear}</p>
          <p className="text-sm">Streak This Year</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold">{userData.maxStreakLastMonth}</p>
          <p className="text-sm">Streak This Month</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
