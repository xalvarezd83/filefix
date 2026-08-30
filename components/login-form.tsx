"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    alert("LOGIN BUTTON WORKS");

    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase(),
        password,
        redirect: false,
      });

      console.log("LOGIN RESULT:", result);

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      // Use a full browser navigation so the new
      // NextAuth session is definitely available.
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">

      {/* Email */}
      <label className="block text-sm">
        <span className="mb-2 block font-medium">
          Email
        </span>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          disabled={loading}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500"
        />
      </label>

      {/* Password */}
      <label className="block text-sm">
        <span className="mb-2 block font-medium">
          Password
        </span>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          disabled={loading}
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-500"
        />
      </label>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Login */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>

    </form>
  );
}