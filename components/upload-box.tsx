"use client";
import { useRef, useState } from "react";
import { UploadCloud, Loader2, CheckCircle2 } from "lucide-react";

export function UploadBox(){
  const ref=useRef<HTMLInputElement>(null); const [busy,setBusy]=useState(false); const [msg,setMsg]=useState("");
  async function upload(file:File){setBusy(true);setMsg("");const r=await fetch("/api/files/upload",{method:"POST",headers:{"x-file-name":encodeURIComponent(file.name),"x-file-type":file.type||"application/octet-stream","x-file-size":String(file.size)},body:file});const d=await r.json();setBusy(false);setMsg(r.ok?`Uploaded ${file.name}.`:(d.error||"Upload failed."));if(r.ok) window.location.reload();}
  return <div onClick={()=>!busy&&ref.current?.click()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files?.[0];if(f)upload(f)}} onDragOver={e=>e.preventDefault()} className="cursor-pointer rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center transition hover:border-gray-500 hover:bg-gray-50">
    <input ref={ref} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)upload(f)}}/>
    {busy?<Loader2 className="mx-auto animate-spin" />:<UploadCloud className="mx-auto text-gray-500" size={30}/>}
    <h2 className="mt-4 font-medium">{busy?"Uploading…":"Drop an Excel or CSV file here"}</h2>
    <p className="mt-2 text-sm text-gray-500">or click to browse · CSV, XLSX, XLS</p>
    {msg&&<p className="mt-4 flex justify-center gap-2 text-sm"><CheckCircle2 size={16}/>{msg}</p>}
  </div>;
}
