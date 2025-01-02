import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import AuthPage from "./components/AuthPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/api/:role" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
