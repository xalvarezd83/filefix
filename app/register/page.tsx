import Link from "next/link";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6">
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center"><div className="text-2xl font-semibold">FileFix</div><p className="mt-2 text-sm text-gray-500">Create your workspace</p></div>
      <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm"><RegisterForm /></div>
      <p className="mt-5 text-center text-sm text-gray-500">Already have an account? <Link className="text-black underline" href="/login">Log in</Link></p>
    </div>
  </main>;
}
