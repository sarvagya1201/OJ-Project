import Submission from "../models/Submission.js";
import User from "../models/User.js";
import moment from "moment";


export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all submissions by user
    const submissions = await Submission.find({ user: userId }).sort({ createdAt: 1 });

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
        if (currDate.isAfter(nowDate.clone().subtract(1, "year"))) currentStreakYear++;
        if (currDate.isAfter(nowDate.clone().subtract(1, "month"))) currentStreakMonth++;
      } else {
        currentStreak = 1;
        currentStreakYear = currDate.isAfter(nowDate.clone().subtract(1, "year")) ? 1 : 0;
        currentStreakMonth = currDate.isAfter(nowDate.clone().subtract(1, "month")) ? 1 : 0;
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