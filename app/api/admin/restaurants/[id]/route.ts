import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["ADMIN"]);
  if (!user) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const { id } = await params;
  const form = await request.formData();
  const value = form.get("approved");
  if (value !== "true" && value !== "false") return NextResponse.json({ error: "Valeur invalide." }, { status: 400 });
  try {
    await db.restaurant.update({ where: { id }, data: { isApproved: value === "true" } });
  } catch {
    return NextResponse.json({ error: "Restaurant introuvable." }, { status: 404 });
  }
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
