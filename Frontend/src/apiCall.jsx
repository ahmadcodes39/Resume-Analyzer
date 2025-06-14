import axios from "axios";

export const resumeAnalyzes = async (formData) => {
  if (!formData.resumefile || !formData.jobDescription) {
    alert("Please provide both resume file and job description.");
    return;
  }

  try {
    const data = new FormData();
    data.append("resumefile", formData.resumefile);
    data.append("jobDescription", formData.jobDescription);

    const response = await axios.post(
      "http://localhost:3000/api/resume/analyze",
      data
    );

    if (response.data) {
    //  alert("Resume analyzed successfully!");
      return response.data;
    } else {
      throw new Error("No response from server.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    alert("Failed to analyze resume.");
  }
};
