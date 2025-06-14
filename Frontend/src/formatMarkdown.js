export const formatResumeMarkdown = (rawText) => {
  if (!rawText) return "";

  // Replace double new lines or extra spacing with clear markdown sections
  return rawText
    // Normalize double line breaks to section breaks
    .replace(/🧠 Candidate Qualifications Summary\s*/i, "## 🧠 Candidate Qualifications Summary\n\n")
    .replace(/🧠 Extracted Relevant Skills\s*/i, "## 🛠️ Extracted Relevant Skills\n\n")
    .replace(/🚫 Missing or Weak Areas\s*/i, "## 🚫 Missing or Weak Areas\n\n")
    .replace(/📈 Suggestions for Improvement\s*/i, "## 📈 Suggestions for Improvement\n\n")
    .replace(/📊 Resume Match Rating\s*/i, "## 📊 Resume Match Rating\n\n")

    // Add list bullets before technologies if they're comma-separated
    .replace(/(Programming Languages\s*\n)([^\n]+)/i, (_, title, skills) =>
      `### 💻 ${title.trim()}\n` + skills.split(",").map(skill => `- ${skill.trim()}`).join("\n")
    )
    .replace(/(Frameworks \/ Libraries\s*\n)([^\n]+)/i, (_, title, skills) =>
      `### 📦 ${title.trim()}\n` + skills.split(",").map(skill => `- ${skill.trim()}`).join("\n")
    )
    .replace(/(Tools \/ Platforms\s*\n)([^\n]+)/i, (_, title, skills) =>
      `### 🧰 ${title.trim()}\n` + skills.split(",").map(skill => `- ${skill.trim()}`).join("\n")
    )
    .replace(/(Concepts \/ Methodologies\s*\n)([^\n]+)/i, (_, title, skills) =>
      `### 📚 ${title.trim()}\n` + skills.split(",").map(skill => `- ${skill.trim()}`).join("\n")
    )

    // Make suggestions readable
    .replace(/💡 Here are five.*?:/, "💡 Suggested improvements:\n")
    .replace(/\n\d+\.\s+/g, "\n1. ")

    // Remove unnecessary repetition or multiple line breaks
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};
