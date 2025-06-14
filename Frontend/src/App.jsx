import React from "react";
import ReactMarkdown from "react-markdown";
import HomePage from "./Pages/HomePage";
import { Routes, Route } from "react-router";
import AppLayout from "./Layout/AppLayout";
function App() {
  return (
    <div data-theme={"dark"}>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
