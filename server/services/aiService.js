import OpenAI from "openai";

export const analyzeResumeWithAI = async (resumeText, jobRole) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const openai = new OpenAI({ apiKey });

  const prompt = `
You are an AI career assistant.

Analyze the resume for the role of "${jobRole}".

Return ONLY valid JSON in this exact format (no extra text):

{
  "extracted_skills": [],
  "missing_skills": [],
  "suggestions": []
}

Resume:
${resumeText}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2
  });

  const raw = response.choices[0].message.content;

  console.log("RAW OPENAI RESPONSE:\n", raw);

  // 🔥 SAFE JSON EXTRACTION
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Invalid JSON from OpenAI");
  }

  return JSON.parse(jsonMatch[0]);
};
