""import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { MapPin, Briefcase, Send } from "lucide-react";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default function TalentDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, "jobs"), where("status", "==", "open"));
      const querySnapshot = await getDocs(q);
      const jobsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsList);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
    setLoading(false);
  };

  const applyForJob = async (jobId) => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to apply.");

    try {
      const appRef = doc(collection(db, "applications"));
      await updateDoc(appRef, {
        job_id: jobId,
        talent_id: user.uid,
        proposal: "Excited to work on this project.",
        status: "pending",
        created_at: new Date().toISOString(),
      });
      alert("Applied successfully!");
    } catch (err) {
      console.error("Application error:", err);
      alert("Failed to apply.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Talent Dashboard</h1>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="border shadow-sm">
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg text-gray-800 mb-2">{job.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <Briefcase className="w-4 h-4" /> {job.category}
                  <MapPin className="w-4 h-4 ml-4" /> {job.location}
                </div>
                <p className="text-sm text-green-600 font-medium mb-3">
                  UGX {job.budget_min} - {job.budget_max} ({job.budget_type})
                </p>
                <Button onClick={() => applyForJob(job.id)} className="bg-blue-600 text-white hover:bg-blue-700">
                  <Send className="w-4 h-4 mr-2" /> Apply Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
