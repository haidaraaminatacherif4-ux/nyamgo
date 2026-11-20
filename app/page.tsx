import { db } from "@/lib/db";
import { HomeExplorer } from "@/components/home-explorer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [restaurants, stories] = await Promise.all([
    db.restaurant.findMany({ where: { isApproved: true }, include: { menuItems: { where: { available: true }, take: 1 }, _count: { select: { menuItems: true } } }, orderBy: { createdAt: "desc" } }),
    db.story.findMany({ where: { expiresAt: { gt: new Date() }, restaurant: { isApproved: true } }, include: { restaurant: { select: { name: true, slug: true, imageUrl: true } } }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);
  return <HomeExplorer restaurants={restaurants} stories={stories} />;
}
