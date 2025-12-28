import { useState } from "react";
import axios from "axios";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (file) => {
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }

    setResumeText(text);
  };

  const analyzeResume = async () => {
    if (!resumeText || !jobRole) {
      alert("Upload resume and enter job role");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/resume/analyze",
        { resumeText, jobRole }
      );
      setResult(res.data);
    } catch (err) {
      alert("AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      <div>
        <label className="block mb-1 text-sm text-gray-300">
          Upload Resume (PDF)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => extractTextFromPDF(e.target.files[0])}
          className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-500 file:text-white
            hover:file:bg-indigo-600"
        />
      </div>

      {/* Job role */}
      <div>
        <label className="block mb-1 text-sm text-gray-300">
          Target Job Role
        </label>
        <input
          type="text"
          placeholder="e.g. Full Stack Developer"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white
            focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Button */}
      <button
        onClick={analyzeResume}
        disabled={loading}
        className="w-full py-2 rounded-md bg-indigo-500
          hover:bg-indigo-600 transition font-semibold disabled:opacity-50"
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume"}
      </button>

      {/* Results */}
      {result && (
  <div className="mt-6 space-y-5">
    <BadgeSection
      title="Extracted Skills"
      items={result.extractedSkills}
      color="green"
    />

    <BadgeSection
      title="Missing Skills"
      items={result.missingSkills}
      color="red"
    />

    <BadgeSection
      title="Suggestions"
      items={result.suggestions}
      color="indigo"
    />
  </div>
)}

    </div>
  );
}

/* ✅ THIS IS OUTSIDE ResumeAnalyzer */
function BadgeSection({ title, items, color }) {
  const colorMap = {
    green: "bg-green-600/20 text-green-400",
    red: "bg-red-600/20 text-red-400",
    indigo: "bg-indigo-600/20 text-indigo-400",
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items?.map((item, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full text-sm ${colorMap[color]}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
