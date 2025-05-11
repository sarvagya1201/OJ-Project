const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DBconnection = async () => {
  const MONGO_URL = process.env.MONGODB_URL;
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

module.exports = { DBconnection };
