"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log("CREATE ACCOUNT CLICKED");

    setError("");
    setLoading(true);

    try {
      // Create account
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      console.log("REGISTER RESPONSE:", response.status);

      const data = await response.json();

      console.log("REGISTER DATA:", data);

      if (!response.ok) {
        setError(data.error || "Could not create account.");
        return;
      }

      // Automatically sign in after registration
      console.log("ACCOUNT CREATED - SIGNING IN");

      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("LOGIN RESULT:", login);

      if (login?.error) {
        setError(
          "Account was created, but automatic login failed. Please log in manually."
        );
        return;
      }

      // Go to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-2 block font-medium">
          Name
        </span>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="Your name"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-400"
        />
      </label>

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
          placeholder="you@example.com"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-400"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-medium">
          Password
        </span>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-gray-400"
        />
      </label>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}