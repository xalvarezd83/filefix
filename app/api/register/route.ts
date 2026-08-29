import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = z.object({
    name: z.string().min(1).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(72)
  }).safeParse(body);

  if (!parsed.success) return NextResponse.json({ error: "Invalid registration data." }, { status: 400 });

  const email = parsed.data.email.toLowerCase();
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await db.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      subscription: { create: { plan: "FREE", status: "ACTIVE" } }
    }
  });

  return NextResponse.json({ id: user.id });
}
