"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("Please complete all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
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

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }

      // Account was successfully created.
      // Send user to login.
      router.push("/login?registered=true");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-semibold tracking-tight">
            FileFix
          </h1>

          <p className="mt-4 text-2xl text-gray-500">
            Create your workspace
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-6">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-3 block text-lg font-medium"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
                className="w-full rounded-2xl border border-gray-200 bg-[#ffffb8] px-5 py-4 text-lg outline-none focus:border-black"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-3 block text-lg font-medium"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-gray-200 bg-[#ffffb8] px-5 py-4 text-lg outline-none focus:border-black"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-3 block text-lg font-medium"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-lg outline-none focus:border-black"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-black px-5 py-4 text-lg font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-lg text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-black underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}