"use client";

import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("http://localhost:8000/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ email: "", username: "", password: "" });
      } else {
        const data = await res.json();
        console.log("Response:", data);
        setStatus(data.detail || "Error creating user");
      }
    } catch (err) {
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <form
        className="flex flex-col gap-4 bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-xl font-semibold text-center">Create Account</h1>

        <input
          type="email"
          placeholder="Email"
          className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white focus:outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Username"
          className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white focus:outline-none"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-white focus:outline-none"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {status && (
          <p
            className={`text-sm text-center ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status === "success"
              ? "User created successfully!"
              : status}
          </p>
        )}
      </form>
    </div>
  );
}
