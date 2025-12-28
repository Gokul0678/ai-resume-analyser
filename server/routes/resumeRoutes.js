import express from "express";
import { analyzeResumeWithAI } from "../services/aiService.js";
import ResumeAnalysis from "../models/ResumeAnalysis.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !jobRole) {
      return res.status(400).json({ error: "Missing data" });
    }

    // 🔥 AI analysis
    const analysis = await analyzeResumeWithAI(resumeText, jobRole);

    // 💾 Save to MongoDB
    const savedAnalysis = await ResumeAnalysis.create({
      jobRole,
      extractedSkills: analysis.extracted_skills,
      missingSkills: analysis.missing_skills,
      suggestions: analysis.suggestions,
    });

    res.json(savedAnalysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

export default router;
