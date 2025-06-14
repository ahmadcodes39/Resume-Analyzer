import React, { useState } from "react";
import { resumeAnalyzes } from "../apiCall";
import Loader from "./Loader";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import "jspdf-autotable";
// import { formatResumeMarkdown } from "../formatMarkdown";

const ResumeUploadSection = () => {
  const [formData, setFormData] = useState({
    resumefile: null,
    jobDescription: "",
  });

  const downloadTextAsPdf = (text, filename = "Analyzed Resume.pdf") => {
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save(filename);
  };

  const [resumeData, setResumeData] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resumefile") {
      setFormData((prev) => ({
        ...prev,
        resumefile: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitData = async () => {
    setIsLoading(true);
    setResumeData("");
    const response = await resumeAnalyzes(formData);
    setIsLoading(false);
    if (response) {
      // const formatedData = formatResumeMarkdown(response.result)
      setResumeData(response.result);
      console.log(response.result)
    }
  };

  const handleBack = () => {
    setResumeData("");
  };

  // const handleDownload = () => {
  //   const blob = new Blob([resumeData], { type: "text/markdown" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = "resume-analysis.pdf";
  //   link.click();
  // };

  return (
    <>
      {resumeData.length <= 0 ? (
        <div className="card bg-base-200 shadow-xl px-6 py-[39.3px] max-w-3xl mx-auto mt-10">
          <h2 className="card-title text-2xl text-primary mb-6 text-center flex justify-center items-center">
            Upload Your Resume
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Resume File (only PDF)
              </label>
              <input
                type="file"
                name="resumefile"
                className="file-input file-input-bordered file-input-primary w-full"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-base-content mb-2">
                Job Description
              </label>
              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                className="textarea textarea-primary w-full h-32"
                placeholder="Enter the job description you are applying for..."
              ></textarea>
            </div>
            {isloading ? (
              <Loader />
            ) : (
              <button
                className="btn btn-primary w-full"
                onClick={handleSubmitData}
              >
                Analyze Resume
              </button>
            )}
          </div>
        </div>
      ) : (
        <section className="bg-base-100 p-8 max-w-4xl mx-auto mt-12 rounded-2xl shadow-lg border border-base-300">
          <h2 className="text-3xl font-semibold text-center text-primary mb-6">
            AI Resume Analysis Result
          </h2>

          <div className="prose max-w-none prose-p:text-base-content prose-li:text-base-content prose-headings:text-neutral-content prose-a:text-primary">
            <ReactMarkdown>{resumeData}</ReactMarkdown>
          </div>

          <div className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 mt-10">
            <button
              className="btn btn-outline btn-primary w-full sm:w-auto"
              onClick={handleBack}
            >
              Back to Home
            </button>
            <button
              className="btn btn-secondary w-full sm:w-auto"
              onClick={downloadTextAsPdf(resumeData)}
            >
              Download Report
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default ResumeUploadSection;
