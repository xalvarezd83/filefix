import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadObject } from "@/lib/storage";
import crypto from "crypto";

export const runtime = "nodejs";

const MAX_FREE = 10 * 1024 * 1024;
const MAX_PRO = 100 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({error:"Unauthorized"},{status:401});

  const sub = await db.subscription.findUnique({where:{userId:session.user.id}});
  const size = Number(req.headers.get("x-file-size") || "0");
  const max = sub?.plan === "PRO" ? MAX_PRO : MAX_FREE;
  if (!size || size > max) return NextResponse.json({error:`File exceeds your ${sub?.plan==="PRO"?"100MB":"10MB"} limit.`},{status:413});

  const name = decodeURIComponent(req.headers.get("x-file-name") || "upload");
  const type = req.headers.get("x-file-type") || "application/octet-stream";
  if (!/\.(csv|xlsx|xls)$/i.test(name)) return NextResponse.json({error:"Only CSV and Excel files are supported."},{status:400});

  const bytes = new Uint8Array(await req.arrayBuffer());
  const hash = crypto.createHash("sha256").update(bytes).digest("hex");
  const key = `${session.user.id}/${new Date().toISOString().slice(0,10)}/${crypto.randomUUID()}-${name.replace(/[^a-zA-Z0-9._-]/g,"_")}`;

  await uploadObject(key, bytes, type);
  const file = await db.file.create({data:{
    userId:session.user.id, originalName:name, objectKey:key,
    storageProvider:"S3", mimeType:type, sizeBytes:size, checksumSha256:hash
  }});
  await db.usageEvent.create({data:{userId:session.user.id,eventType:"FILE_UPLOADED",quantity:1,metadata:{fileId:file.id}}});
  await db.auditEvent.create({data:{userId:session.user.id,fileId:file.id,action:"FILE_UPLOADED"}});
  return NextResponse.json({id:file.id});
}
