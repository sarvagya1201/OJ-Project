import { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa"; // npm install react-icons

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, action) => {
    try {
      const url =
        action === "promote"
          ? `/user/${id}/make-admin`
          : `/user/${id}/demote`;
      await axiosInstance.put(url);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  if (user?.role !== "admin") {
    return (
      <div className="text-center p-6 text-red-500 font-semibold">
        Access Denied: Admins only.
      </div>
    );
  }

  // Show admins first, then users
  const sortedUsers = [...users].sort((a, b) => {
    if (a.role === b.role) return 0;
    if (a.role === "admin") return -1;
    return 1;
  });

  const filteredUsers = sortedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-6"
    >
      <h1 className="text-3xl font-extrabold mb-6 text-zinc-900 dark:text-white flex items-center gap-3">
        User Management
        <FaCrown className="text-yellow-400" title="Admin Panel" />
      </h1>

      <input
        type="text"
        placeholder="Search by name or email"
        className="w-full p-3 mb-6 rounded-lg border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="text-center text-lg font-medium text-zinc-700 dark:text-zinc-300">
          Loading users...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full border-collapse bg-white dark:bg-zinc-900 rounded-lg">
            <thead className="bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <tr>
                <th className="p-4 text-left text-zinc-700 dark:text-zinc-300 rounded-tl-lg">
                  Name
                </th>
                <th className="p-4 text-left text-zinc-700 dark:text-zinc-300">
                  Email
                </th>
                <th className="p-4 text-left text-zinc-700 dark:text-zinc-300">
                  Role
                </th>
                <th className="p-4 text-left text-zinc-700 dark:text-zinc-300 rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-zinc-500">
                    No users found.
                  </td>
                </tr>
              )}

              {filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <td className="p-4 flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
                    {u.name}
                    {u.role === "admin" && (
                      <FaCrown
                        className="text-yellow-400"
                        title="Admin"
                        size={16}
                      />
                    )}
                  </td>
                  <td className="p-4 text-zinc-700 dark:text-zinc-300">{u.email}</td>
                  <td className="p-4 font-semibold text-blue-600 dark:text-blue-400 capitalize">
                    {u.role}
                  </td>
                  <td className="p-4 space-x-3">
                    {u.role === "user" ? (
                      <button
                        onClick={() => updateRole(u._id, "promote")}
                        className="px-4 py-2 bg-green-600 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition"
                        aria-label={`Promote ${u.name} to admin`}
                      >
                        Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => updateRole(u._id, "demote")}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition"
                        aria-label={`Demote ${u.name} to user`}
                      >
                        Demote
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default UserManagement;
