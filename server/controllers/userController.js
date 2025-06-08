import Submission from "../models/Submission.js";
import User from "../models/User.js";
import moment from "moment";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
export const makeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: `${user.name} has been promoted to admin.` });
  } catch (error) {
    res.status(500).json({ message: "Server error while promoting user" });
  }
};
export const demoteAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-demotion (optional but recommended)
    if (req.user._id.toString() === userId) {
      return res.status(403).json({ message: "You can't demote yourself." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin.' });
    }

    // Count number of admins
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Prevent demotion if this is the last admin
    if (adminCount <= 1) {
      return res.status(403).json({ message: 'Cannot demote the last remaining admin.' });
    }

    user.role = 'user';
    await user.save();

    res.json({ message: `${user.name} has been demoted to user.` });
  } catch (error) {
    res.status(500).json({ message: 'Server error while demoting user' });
  }
};


export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all submissions by user
    const submissions = await Submission.find({ user: userId }).sort({
      createdAt: 1,
    });

    const heatmap = {};
    const solvedProblems = new Set();
    const solvedProblemsMonth = new Set();
    const solvedProblemsYear = new Set();
    const acceptedDates = new Set();

    const now = moment();

    submissions.forEach((sub) => {
      const dateStr = moment(sub.createdAt).format("YYYY-MM-DD");

      if (sub.status === "Accepted") {
        heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
        solvedProblems.add(sub.problem.toString());

        if (moment(sub.createdAt).isAfter(now.clone().subtract(1, "month")))
          solvedProblemsMonth.add(sub.problem.toString());

        if (moment(sub.createdAt).isAfter(now.clone().subtract(1, "year")))
          solvedProblemsYear.add(sub.problem.toString());

        acceptedDates.add(dateStr);
      }
    });

    // Streak calculation
    const sortedDates = Array.from(acceptedDates).sort();
    let maxStreak = 0;
    let currentStreak = 0;
    let maxStreakYear = 0;
    let currentStreakYear = 0;
    let maxStreakMonth = 0;
    let currentStreakMonth = 0;

    let lastDate = null;
    const nowDate = moment();

    sortedDates.forEach((dateStr) => {
      const currDate = moment(dateStr, "YYYY-MM-DD");
      const diff = lastDate ? currDate.diff(lastDate, "days") : 0;

      if (diff === 1 || !lastDate) {
        currentStreak++;
        if (currDate.isAfter(nowDate.clone().subtract(1, "year")))
          currentStreakYear++;
        if (currDate.isAfter(nowDate.clone().subtract(1, "month")))
          currentStreakMonth++;
      } else {
        currentStreak = 1;
        currentStreakYear = currDate.isAfter(
          nowDate.clone().subtract(1, "year")
        )
          ? 1
          : 0;
        currentStreakMonth = currDate.isAfter(
          nowDate.clone().subtract(1, "month")
        )
          ? 1
          : 0;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
      maxStreakYear = Math.max(maxStreakYear, currentStreakYear);
      maxStreakMonth = Math.max(maxStreakMonth, currentStreakMonth);

      lastDate = currDate;
    });

    const user = await User.findById(userId).select("name email");

    res.json({
      name: user.name,
      email: user.email,
      heatmap,
      problemsSolvedAllTime: solvedProblems.size,
      problemsSolvedLastYear: solvedProblemsYear.size,
      problemsSolvedLastMonth: solvedProblemsMonth.size,
      maxStreakAllTime: maxStreak,
      maxStreakLastYear: maxStreakYear,
      maxStreakLastMonth: maxStreakMonth,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error", details: error.message });
  }
};
