import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../config/firebase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

initializeApp(firebaseConfig);
const auth = getAuth();

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("talent");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      localStorage.setItem("role", role);
      navigate(`/${role}-profile`);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      localStorage.setItem("role", role);
      navigate(`/${role}-profile`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-blue-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg p-6 rounded-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-600">
          Create an Account
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="role"
              value="talent"
              checked={role === "talent"}
              onChange={(e) => setRole(e.target.value)}
            />
            Talent
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="role"
              value="client"
              checked={role === "client"}
              onChange={(e) => setRole(e.target.value)}
            />
            Client
          </label>
        </div>

        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />

        <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />

        <Button
          type="submit"
          className="w-full mt-6 bg-orange-600 hover:bg-orange-700 text-white"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="text-center text-sm my-4 text-gray-500">or</div>

        <Button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full bg-white border text-gray-700 hover:bg-gray-50"
        >
          Sign Up with Google
        </Button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <a href="/login" className="text-orange-600 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
