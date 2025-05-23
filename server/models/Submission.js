import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: { type: String, required: true },
    language: { type: String, enum: ["cpp", "java", "python"], required: true },
    status: { type: String, default: "Pending" }, // or "Accepted", "Wrong Answer", etc.
    submittedAt: { type: Date, default: Date.now },
    time: { type: Number }, // execution time (optional)
    memory: { type: Number }, // memory used (optional)
    output: String,
    error: String,
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);
