import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  restaurantId: z.string().min(1),
  customerName: z.string().min(2).max(80),
  customerPhone: z.string().min(6).max(30),
  deliveryAddress: z.string().min(3).max(200),
  fulfillment: z.enum(["PICKUP", "DELIVERY"]),
  note: z.string().max(500).optional(),
  items: z.array(z.object({ menuItemId: z.string().min(1), quantity: z.number().int().min(1).max(20) })).min(1).max(50),
});

export async function POST(request: NextRequest) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Informations de commande invalides." }, { status: 400 });
  const data = parsed.data;
  const menuIds = data.items.map((item) => item.menuItemId);
  if (new Set(menuIds).size !== menuIds.length) {
    return NextResponse.json({ error: "Un plat ne peut apparaître qu’une seule fois dans la commande." }, { status: 400 });
  }

  const restaurant = await db.restaurant.findUnique({ where: { id: data.restaurantId }, select: { id: true, isOpen: true, isApproved: true } });
  if (!restaurant || !restaurant.isApproved) return NextResponse.json({ error: "Restaurant introuvable." }, { status: 404 });
  if (!restaurant.isOpen) return NextResponse.json({ error: "Ce restaurant est actuellement fermé." }, { status: 409 });

  const menu = await db.menuItem.findMany({ where: { id: { in: menuIds }, restaurantId: data.restaurantId, available: true } });
  if (menu.length !== menuIds.length) return NextResponse.json({ error: "Un plat n’est plus disponible." }, { status: 409 });
  const quantities = new Map(data.items.map((item) => [item.menuItemId, item.quantity]));
  const total = menu.reduce((sum, item) => sum + item.price * (quantities.get(item.id) ?? 0), 0);
  const order = await db.order.create({ data: {
    userId: user.id, restaurantId: data.restaurantId, customerName: data.customerName, customerPhone: data.customerPhone,
    deliveryAddress: data.deliveryAddress, fulfillment: data.fulfillment, note: data.note,
    total, items: { create: menu.map((item) => ({ menuItemId: item.id, name: item.name, price: item.price, quantity: quantities.get(item.id) ?? 1 })) },
  }, include: { items: true, restaurant: true } });
  return NextResponse.json({ order }, { status: 201 });
}
