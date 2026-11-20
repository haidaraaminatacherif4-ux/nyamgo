import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("q")?.trim() || "";
  const district = request.nextUrl.searchParams.get("district")?.trim() || "";
  const restaurants = await db.restaurant.findMany({
    where: { isApproved: true, ...(district ? { district: { contains: district, mode: "insensitive" } } : {}), ...(search ? { OR: [
      { name: { contains: search, mode: "insensitive" } },
      { cuisine: { contains: search, mode: "insensitive" } },
      { district: { contains: search, mode: "insensitive" } },
      { menuItems: { some: { name: { contains: search, mode: "insensitive" } } } },
    ] } : {}) },
    include: { menuItems: { take: 3, where: { available: true } }, stories: { where: { expiresAt: { gt: new Date() } }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ restaurants });
}
