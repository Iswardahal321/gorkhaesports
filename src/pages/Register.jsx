// 📁 src/pages/Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      try {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          role: "user",
          popupShown: false,   // ✅ Show popup only once
          disabled: false,     // ✅ Default status
        });
        navigate("/dashboard");
      } catch (firestoreError) {
        console.error("❌ Firestore Error:", firestoreError.message);
        setError("User created, but failed to save in database.");
      }

    } catch (authError) {
      if (authError.code === "auth/email-already-in-use") {
        setError("This email is already registered. Try logging in.");
      } else if (authError.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (authError.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else {
        setError("Registration failed. Try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-red-500 mb-3 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
