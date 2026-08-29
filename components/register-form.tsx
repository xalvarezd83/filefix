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

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create the user
      const r = await fetch("/api/register", {
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

      const d = await r.json();

      if (!r.ok) {
        setError(d.error || "Could not create account.");
        return;
      }

      // Automatically log the new user in
      const login = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (login?.error) {
        setError(login.error);
        return;
      }

      // Go to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-2 block font-medium">Name</span>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-medium">Email</span>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
        />
      </label>

      <label className="block text-sm">
        <span className="mb-2 block font-medium">Password</span>

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          minLength={8}
          required
          className="w-full rounded-xl border border-gray-200 px-3 py-2.5"
        />
      </label>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}