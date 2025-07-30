
// JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const docRef = doc(db, "jobs", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error loading job:", err);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const user = auth.currentUser;
    if (!user || !proposal) return;
    setApplying(true);
    try {
      await addDoc(collection(db, "applications"), {
        job_id: id,
        talent_id: user.uid,
        client_id: job.client_id,
        proposal,
        proposed_rate: parseFloat(proposedRate),
        estimated_duration: estimatedDuration,
        status: "pending",
        attachments: [],
      });
      navigate("/talent-dashboard");
    } catch (err) {
      console.error("Error applying:", err);
    }
    setApplying(false);
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8">Job not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-600 mb-4">{job.description}</p>
      <div className="mb-4">
        <Badge>{job.category}</Badge>
        <span className="ml-4 text-sm text-gray-600">{job.location}</span>
      </div>
      <div className="mb-4 text-green-600 font-semibold">
        UGX {job.budget_min?.toLocaleString()} - {job.budget_max?.toLocaleString()} ({job.budget_type})
      </div>
      <div className="mb-4">
        <h3 className="font-semibold mb-1">Skills Required:</h3>
        <div className="flex gap-2 flex-wrap">
          {job.skills_required?.map((skill, i) => (
            <Badge key={i} className="bg-blue-100 text-blue-700 text-sm">{skill}</Badge>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">Apply for this Job</h3>
        <textarea
          className="w-full p-2 border rounded mb-3"
          rows={4}
          placeholder="Write your proposal..."
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Proposed Rate (UGX)"
          className="w-full p-2 border rounded mb-3"
          value={proposedRate}
          onChange={(e) => setProposedRate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Estimated Duration (e.g. 2 weeks)"
          className="w-full p-2 border rounded mb-3"
          value={estimatedDuration}
          onChange={(e) => setEstimatedDuration(e.target.value)}
        />

        <Button
          onClick={handleApply}
          disabled={applying || !proposal}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
        >
          {applying ? "Applying..." : "Submit Application"}
        </Button>
      </div>
    </div>
  );
}
