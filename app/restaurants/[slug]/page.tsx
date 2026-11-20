import { db } from "@/lib/db";
import { RestaurantPageClient } from "@/components/restaurant-page-client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({ where: { slug }, include: { menuItems: { where: { available: true }, orderBy: { category: "asc" } }, stories: { where: { expiresAt: { gt: new Date() } }, orderBy: { createdAt: "desc" } } });
  if (!restaurant || !restaurant.isApproved) notFound();
  return <RestaurantPageClient restaurant={restaurant} />;
}
