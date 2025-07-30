import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

export default function ClientProfile() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const user = auth.currentUser;
      let profilePicUrl = "";

      if (profilePicture) {
        const storageRef = ref(storage, `clients/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profilePicUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        full_name: fullName,
        location,
        company,
        profile_picture: profilePicUrl,
        user_type: "client",
        is_verified: false,
        email: user.email,
      });

      navigate("/client-dashboard");
    } catch (err) {
      console.error("Error saving profile:", err);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-orange-600">Complete Your Client Profile</h2>

        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Company / Business</label>
        <Input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Location</label>
        <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="mb-4" />

        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        <Input type="file" onChange={(e) => setProfilePicture(e.target.files[0])} accept="image/*" className="mb-6" />

        <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={uploading}>
          {uploading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </div>
  );
}
