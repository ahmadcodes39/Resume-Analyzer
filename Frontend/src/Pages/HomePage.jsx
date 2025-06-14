import React from "react";
import TopBar from "../Components/TopBar";
import ResumeUploadSection from "../Components/ResumeUploadSection";

const HomePage = () => {
  return (
    <div className="overflow-y-hidden">
      <main className="mx-auto mt-10">
        <ResumeUploadSection />
      </main>
    </div>
  );
};

export default HomePage;