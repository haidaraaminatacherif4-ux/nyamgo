import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(160),
  phone: z.string().min(6).max(30).optional(),
  password: z.string().min(8).max(100),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Informations invalides." }, { status: 400 });
  const { name, email, phone, password } = parsed.data;
  if (await db.user.findUnique({ where: { email: email.toLowerCase() } })) {
    return NextResponse.json({ error: "Cette adresse e-mail existe déjà." }, { status: 409 });
  }
  const user = await db.user.create({ data: { name, email: email.toLowerCase(), phone, passwordHash: await bcrypt.hash(password, 12), role: "CUSTOMER" } });
  await createSession(user);
  return NextResponse.json({ user: { id: user.id, name: user.name, role: user.role } }, { status: 201 });
}
