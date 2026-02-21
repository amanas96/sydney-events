// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPage from "./pages/publicPage";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Assignment 1: Part A & B (The Public Site) */}
        <Route path="/" element={<PublicPage />} />

        {/* Assignment 1: Part C (The Admin Dashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
