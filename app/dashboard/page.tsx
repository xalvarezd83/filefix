import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, Files, Settings, CreditCard, Sparkles } from "lucide-react";
import { UploadBox } from "@/components/upload-box";

export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [sub, files] = await Promise.all([
    db.subscription.findUnique({ where: { userId: session.user.id } }),
    db.file.findMany({ where: { userId: session.user.id }, orderBy: { uploadedAt: "desc" }, take: 8 })
  ]);
  return <main className="min-h-screen bg-[#fafafa]">
    <header className="border-b border-gray-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"><div className="font-semibold">FileFix</div><nav className="flex items-center gap-1 text-sm"><Link href="/dashboard" className="rounded-lg bg-gray-100 px-3 py-2">Workspace</Link><Link href="/pricing" className="rounded-lg px-3 py-2 hover:bg-gray-100">Billing</Link></nav></div></header>
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-end justify-between"><div><p className="text-sm text-gray-500">Good to see you, {session.user.name || session.user.email}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Your files</h1></div><Link href="/pricing" className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm"><CreditCard size={16}/> {sub?.plan === "PRO" ? "Pro" : "Free"}</Link></div>
      <UploadBox />
      <div className="mt-10"><div className="mb-3 flex items-center justify-between"><h2 className="font-medium">Recent files</h2><span className="text-xs text-gray-500">{files.length} shown</span></div>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">{files.length===0?<div className="p-10 text-center text-sm text-gray-500">No files yet. Upload your first spreadsheet above.</div>:files.map(f=><div key={f.id} className="flex items-center justify-between border-b border-gray-100 px-5 py-4 last:border-0"><div className="flex items-center gap-3"><div className="rounded-lg bg-gray-100 p-2"><Files size={16}/></div><div><div className="text-sm font-medium">{f.originalName}</div><div className="text-xs text-gray-500">{f.status} · {Number(f.sizeBytes).toLocaleString()} bytes</div></div></div><span className="text-xs text-gray-400">{new Date(f.uploadedAt).toLocaleDateString()}</span></div>)}</div></div>
    </div>
  </main>;
}
