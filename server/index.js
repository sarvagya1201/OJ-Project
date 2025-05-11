const express = require("express");
const dotenv = require("dotenv");
const { DBconnection } = require("./database/db");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
DBconnection();

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
