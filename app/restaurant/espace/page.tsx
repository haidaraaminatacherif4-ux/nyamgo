import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatGNF } from "@/lib/format";
import { RestaurantDashboard } from "@/components/restaurant-dashboard";

export const dynamic = "force-dynamic";
export default async function RestaurantDashboardPage() {
  const user = await getSession();
  if (!user) redirect("/connexion?next=/restaurant/espace");
  if (user.role !== "RESTAURANT") redirect("/");
  if (!user.restaurant) return <main className="dashboard-page"><section className="dashboard-content"><h1>Votre profil restaurant</h1><p>Votre demande de création sera configurée avant la mise en production.</p></section></main>;
  const [restaurant, orders] = await Promise.all([
    db.restaurant.findUnique({ where: { id: user.restaurant.id }, include: { menuItems: true, stories: { orderBy: { createdAt: "desc" }, take: 10 } } }),
    db.order.findMany({ where: { restaurantId: user.restaurant.id }, include: { items: true, user: { select: { name: true, phone: true } } }, orderBy: { createdAt: "desc" } }),
  ]);
  if (!restaurant) redirect("/");
  return <RestaurantDashboard restaurant={restaurant} orders={orders} />;
}
