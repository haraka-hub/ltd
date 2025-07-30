// Browse.jsx
import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { MapPin } from "lucide-react";

initializeApp(firebaseConfig);
const db = getFirestore();

export function Browse() {
  const [talents, setTalents] = useState([]);

  useEffect(() => {
    const fetchTalents = async () => {
      const q = query(collection(db, "users"), where("user_type", "==", "talent"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTalents(data);
    };

    fetchTalents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Browse Talents</h1>
      {talents.length === 0 ? (
        <p className="text-gray-600">No talents found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {talents.map(talent => (
            <Card key={talent.id} className="bg-white shadow hover:shadow-md transition border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {talent.profile_picture ? (
                    <img
                      src={talent.profile_picture}
                      alt={talent.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-orange-200 flex items-center justify-center text-white font-bold">
                      {talent.full_name?.charAt(0) || "T"}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{talent.full_name}</h3>
                    {talent.location && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {talent.location}
                      </div>
                    )}
                  </div>
                </div>
                {talent.skills && talent.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {talent.skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {talent.skills.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                        +{talent.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                {talent.hourly_rate && (
                  <div className="text-sm text-green-700 font-semibold">
                    UGX {talent.hourly_rate}/hr
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
