import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { Button } from "../components/ui/button";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default function ClientDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login");
      const q = query(collection(db, "jobs"), where("client_id", "==", user.uid));
      const snapshot = await getDocs(q);
      const jobData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobData);
      setLoading(false);
    };

    fetchJobs();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Client Dashboard</h2>
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">Logout</Button>
      </div>

      <Button onClick={() => navigate("/post-job")} className="mb-4 bg-orange-600 hover:bg-orange-700 text-white">
        + Post New Job
      </Button>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg mb-1">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{job.description}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="text-sm text-green-600 font-semibold">UGX {job.budget_min} - {job.budget_max}</p>
              <p className="text-xs text-gray-400 mt-2">{job.skills_required?.join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
