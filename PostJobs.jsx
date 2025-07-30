import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default function PostJob() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [skills, setSkills] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = auth.currentUser;

      await addDoc(collection(db, "jobs"), {
        title,
        description,
        category,
        location,
        budget_min: Number(budgetMin),
        budget_max: Number(budgetMax),
        budget_type: "fixed",
        skills_required: skills.split(",").map((s) => s.trim()),
        status: "open",
        client_id: user.uid,
        applications_count: 0,
        created_at: serverTimestamp(),
      });

      navigate("/client-dashboard");
    } catch (error) {
      console.error("Error posting job:", error);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Post a New Job</h2>

        <label className="block text-sm font-medium text-gray-700">Job Title</label>
        <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded mb-4"></textarea>

        <label className="block text-sm font-medium text-gray-700">Category</label>
        <Input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Location</label>
        <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Budget (Min)</label>
        <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Budget (Max)</label>
        <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Required Skills (comma separated)</label>
        <Input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required className="mb-6" />

        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={submitting}>
          {submitting ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </div>
  );
}
