// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import TalentProfile from "./pages/TalentProfile";
import ClientProfile from "./pages/ClientProfile";
import TalentDashboard from "./pages/TalentDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import PostJobs from "./pages/PostJobs";
import JobDetails from "./pages/JobDetails";
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import Browse from "./pages/Browse";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/talent-profile" element={<TalentProfile />} />
        <Route path="/client-profile" element={<ClientProfile />} />
        <Route path="/talent-dashboard" element={<TalentDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/post-job" element={<PostJobs />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/browse" element={<Browse />} />
      </Routes>
    </Router>
  );
}

export default App;
