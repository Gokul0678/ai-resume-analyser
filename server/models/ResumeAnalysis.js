import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    jobRole: {
      type: String,
      required: true,
    },
    extractedSkills: {
      type: [String],
      required: true,
    },
    missingSkills: {
      type: [String],
      required: true,
    },
    suggestions: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export default mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
