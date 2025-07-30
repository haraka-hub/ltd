// Notifications.jsx
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Card, CardContent } from "../components/ui/card";

initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "notifications"), where("user_id", "==", user.uid));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(items);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-orange-600 mb-6">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No notifications available.</p>
      ) : (
        <div className="grid gap-4">
          {notifications.map((note) => (
            <Card key={note.id} className="border">
              <CardContent className="p-4">
                <p className="text-sm text-gray-800">{note.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
