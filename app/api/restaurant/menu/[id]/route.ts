import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole(["RESTAURANT"]);
  if (!user?.restaurant) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const { id } = await params;
  const form = await request.formData();
  const availableValue = form.get("available");
  if (availableValue !== "true" && availableValue !== "false") return NextResponse.json({ error: "Disponibilité invalide." }, { status: 400 });
  const result = await db.menuItem.updateMany({ where: { id, restaurantId: user.restaurant.id }, data: { available: availableValue === "true" } });
  if (result.count === 0) return NextResponse.json({ error: "Plat introuvable." }, { status: 404 });
  return NextResponse.redirect(new URL("/restaurant/espace", request.url), 303);
}
