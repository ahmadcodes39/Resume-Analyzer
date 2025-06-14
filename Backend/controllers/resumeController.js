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

              ✅ Use **Markdown formatting** and include **appropriate emojis** to enhance readability and engagement.

              🚫 Do NOT include any headings like "Resume Analysis: [Name] vs. [Job Title]".

              Respond with the following structured sections:

              ---

              1. **🧠 Candidate Qualifications Summary**  
                - Highlight technical strengths, academic background, and notable projects.  
                - If applicable, mention soft skills such as teamwork 🤝, communication 🗣️, or independent initiative 💡 inferred from project work or experience.

              2. **🛠️ Extracted Relevant Skills**  
                - List the candidate’s skills grouped into the following categories:  
                  - **Programming Languages** 💻  
                  - **Frameworks / Libraries** 📦  
                  - **Tools / Platforms** 🧰  
                  - **Concepts / Methodologies** 📚

              3. **🚫 Missing or Weak Areas**  
                - Point out specific skills, tools, or experience gaps based on the job description.  
                - Clearly mention what is missing or underdeveloped.

              4. **📈 Suggestions for Improvement**  
                - Provide **3 to 5 specific, actionable** suggestions to improve the resume or better align with the job role.  
                - Keep suggestions relevant and realistic for the candidate's profile.

              5. **📊 Resume Match Rating**  
                - Provide a match percentage (e.g., \`78% match\`) indicating how well the resume aligns with the job description.  
                - Briefly justify the rating by highlighting key strengths and critical weaknesses.

                ⚠ dont use such filler words or phrases "Let me know if you need further refinements! 🎯"
              ---
              Be concise, helpful, and maintain a positive tone throughout the analysis.

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
