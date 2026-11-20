import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/").at(-1);
  const restaurant = await db.restaurant.findUnique({ where: { slug }, include: { menuItems: { where: { available: true } }, stories: { where: { expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } } } });
  if (!restaurant || !restaurant.isApproved) return NextResponse.json({ error: "Restaurant introuvable." }, { status: 404 });
  return NextResponse.json({ restaurant });
}
