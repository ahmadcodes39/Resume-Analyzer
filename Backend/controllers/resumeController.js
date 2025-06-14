import fs from "fs";
import axios from "axios";
import PDFParser from "pdf2json";
import dotenv from "dotenv";

dotenv.config();

export const resumeAnalyzer = async (req, res) => {
  const resumefile = req.file;
  const { jobDescription } = req.body;

  if (!resumefile) {
    return res.status(400).json({ message: "No file selected." });
  }

  try {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF Parsing Error:", errData.parserError);
      res.status(500).json({ error: "Failed to parse PDF file." });
    });

    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      // console.log("PDF Data Structure:", JSON.stringify(pdfData, null, 2).slice(0, 500)); // Debug log

      // Extract text from Pages
      let rawText = pdfData.Pages.map((page) =>
        page.Texts.map((text) => text.R[0]?.T || "").join(" ")
      )
        .join("\n")
        .trim();

      if (!rawText) {
        return res
          .status(400)
          .json({
            error:
              "The resume file appears to be empty or unreadable. Please upload a text-based PDF.",
          });
      }

      // console.log("Extracted Resume Text:", rawText.slice(0, 300)); // Preview for debug

const prompt = `
You are an AI-powered resume analyzer. Compare the **resume** and **job description** provided below, and respond with a structured, professional analysis.

✅ Use **Markdown formatting** and include **appropriate emojis** to enhance readability and structure.

🚫 Do NOT include headings like "Resume Analysis: [Name] vs. [Job Title]".

---

Respond with the following structured sections:

### 1. 🧠 Candidate Qualifications Summary  
- Summarize the candidate’s **overall background**, **education**, and **key strengths** relevant to the job.  
- Include any **notable experience**, **research**, **projects**, or **certifications**.  
- Mention applicable **soft skills** like communication 🗣️, leadership 🤝, or problem-solving 💡.

---

### 2. 🎯 Extracted Relevant Competencies  
Group the candidate’s **skills and qualifications** into appropriate categories, based on the job domain. For example:

- **Technical or Subject Knowledge** 📘  
- **Tools / Equipment / Platforms** 🧰  
- **Research / Analysis / Reporting Skills** 🧪  
- **Communication / Collaboration** 💬  
- **Other Core Competencies** 🌟

*(Only include categories that are applicable.)*

---

### 3. ⚠️ Gaps or Underrepresented Areas  
- Clearly point out **missing or underdeveloped skills** or experience based on the job description.  
- Focus on **knowledge**, **tools**, **techniques**, or **experience** the candidate lacks.  
- Be specific, concise, and avoid assumptions.

---

### 4. 📈 Suggestions for Improvement  
- Provide **3 to 5 actionable suggestions** to improve the resume or align it better with the role.  
- Include areas like content, formatting, visibility of achievements, or skill clarity.  
- Keep them **constructive**, **relevant**, and **tailored to the job domain**.

---

### 5. 📊 Resume Match Rating  
- Assign a **match percentage** (e.g., \`82% match\`) based on how well the resume fits the job.  
- Briefly explain the score using **evidence from qualifications, experience, and gaps**.

---

Be objective, professional, and avoid filler phrases like “Let me know if you need refinements.” Focus only on the analysis.

---

Resume: ${rawText}

Job Description: ${jobDescription}
`;


      try {
        const aiResponse = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: process.env.MODEL_NAME,
            messages: [{ role: "user", content: prompt }],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const aiText = aiResponse.data.choices[0].message.content;
        res.json({ result: aiText });
      } catch (err) {
        console.error("AI API Error:", err.response?.data || err.message);
        res
          .status(500)
          .json({ error: "Something went wrong with the AI response." });
      }
    });

    pdfParser.loadPDF(resumefile.path);
  } catch (err) {
    console.error("File Processing Error:", err.message);
    res.status(500).json({ error: "Resume file processing failed." });
  }
};
