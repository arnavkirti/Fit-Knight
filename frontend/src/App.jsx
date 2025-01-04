import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/api/:role" element={<AuthPage />} />
        <Route path="/api/user/dashboard" element={<Dashboard />}></Route>
        <Route path="/api/admin/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
