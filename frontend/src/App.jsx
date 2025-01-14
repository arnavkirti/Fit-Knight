import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import Group from "./components/Group";
import Notification from "./components/Notification";
import GroupChat from "./components/GroupChat";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/api/:role" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path={`/group-info/:groupId`} element={<Group />}></Route>
        <Route path={`/group-chat/:groupId`} element={<GroupChat />}></Route>
        <Route path="/notifications" element={<Notification />}></Route>
      </Routes>
    </Router>
  );
}

export default App;

// change route logic 
// 