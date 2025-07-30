// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Register from "./Register";
import ClientProfile from "./ClientProfile";
import TalentProfile from "./TalentProfile";
import ClientDashboard from "./ClientDashboard";
import TalentDashboard from "./TalentDashboard";
import PostJobs from "./PostJobs";
import Browse from "./Browse";
import Chat from "./Chat";
import JobDetails from "./JobDetails";
import Notifications from "./Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/client-profile" element={<ClientProfile />} />
        <Route path="/talent-profile" element={<TalentProfile />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/talent-dashboard" element={<TalentDashboard />} />
        <Route path="/post-job" element={<PostJobs />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </Router>
  );
}

export default App;
