import React from "react";
// import { Globe } from 'lucide-react';

const TopBar = () => {
  return (
    <header className="navbar">
      <div className="navbar-start">
        <h1 className="text-2xl font-semibold font-mono text-primary">SkillMatch AI</h1>
      </div>
      {/* <div className="navbar-end">
        <p className="text-lg text-secondary">
          <Globe size={24} />
        </p>
      </div> */}
    </header>
  );
};

export default TopBar;