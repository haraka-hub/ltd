import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default function Chat() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("created_at"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to send messages.");

    const messageData = {
      sender_id: user.uid,
      content: newMessage,
      created_at: serverTimestamp(),
    };

    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender_id === auth.currentUser?.uid ? "bg-orange-100 ml-auto" : "bg-gray-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button onClick={sendMessage} className="bg-orange-600 text-white hover:bg-orange-700">
          Send
        </Button>
      </div>
    </div>
  );
}
