import ResumeAnalyzer from "./components/ResumeAnalyzer";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-400">
          AI Resume Analyzer
        </h1>
        <ResumeAnalyzer />
      </div>
    </div>
  );
}
