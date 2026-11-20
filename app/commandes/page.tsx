import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatGNF } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CustomerOrdersPage() {
  const user = await getSession();
  if (!user) redirect("/connexion?next=/commandes");
  const orders = await db.order.findMany({ where: { userId: user.id }, include: { restaurant: true, items: true }, orderBy: { createdAt: "desc" } });
  const labels: Record<string,string> = { PENDING:"En attente", ACCEPTED:"Acceptée", PREPARING:"En préparation", READY:"Prête", COMPLETED:"Terminée", REJECTED:"Refusée" };
  return <main className="dashboard-page"><aside className="dashboard-nav"><span className="eyebrow">MON COMPTE</span><h1>Bonjour,<br/>{user.name.split(" ")[0]}.</h1><nav><a className="active" href="/commandes">Mes commandes</a><a href="/">Découvrir</a></nav></aside><section className="dashboard-content"><div className="dashboard-heading"><div><span className="eyebrow">HISTORIQUE</span><h2>Mes commandes</h2></div></div>{orders.length ? <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div><span>Commande #{order.id.slice(-6).toUpperCase()}</span><b>{order.restaurant.name}</b><small>{new Intl.DateTimeFormat("fr-GN",{dateStyle:"medium",timeStyle:"short"}).format(order.createdAt)}</small></div><div className="order-status" data-status={order.status}>{labels[order.status]}</div><ul>{order.items.map((item)=><li key={item.id}>{item.quantity}× {item.name}</li>)}</ul><b className="order-total">{formatGNF(order.total)}</b></article>)}</div> : <div className="dashboard-empty"><span>🍽</span><h3>Vous n’avez pas encore commandé.</h3><p>Découvrez un restaurant et votre prochaine adresse préférée.</p><a className="button button-dark" href="/">Explorer Conakry ↗</a></div>}</section></main>;
}
