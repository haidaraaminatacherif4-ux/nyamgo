import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash("Password123!", 12);
  const admin = await db.user.upsert({ where: { email: "admin@nyamgo.gn" }, update: {}, create: { name: "Admin Nyamgo", email: "admin@nyamgo.gn", passwordHash: pass, role: "ADMIN" } });
  void admin;
  const customers = [
    { name: "Aissatou Diallo", email: "aissatou@example.gn", role: "CUSTOMER" as const },
    { name: "Chez Néné", email: "restaurant@nyamgo.gn", role: "RESTAURANT" as const },
  ];
  for (const customer of customers) {
    const user = await db.user.upsert({ where: { email: customer.email }, update: {}, create: { ...customer, passwordHash: pass } });
    if (customer.role === "RESTAURANT") {
      await db.restaurant.upsert({ where: { slug: "chez-nene" }, update: {}, create: { ownerId: user.id, name: "Chez Néné", slug: "chez-nene", description: "Les saveurs généreuses de la cuisine guinéenne, préparées avec amour.", cuisine: "Guinéenne", district: "Kaloum", address: "Centre-ville, Kaloum", phone: "+224 620 00 00 00", imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85", isApproved: true, menuItems: { create: [
        { name: "Poulet yassa", description: "Poulet mariné, oignons fondants et riz parfumé.", price: 85000, imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80", category: "Plats" },
        { name: "Riz gras au bœuf", description: "Un classique guinéen mijoté aux épices.", price: 70000, imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80", category: "Plats" },
        { name: "Jus de bissap", description: "Infusion florale maison, fraîche et acidulée.", price: 12000, imageUrl: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=80", category: "Boissons" },
      ] } } });
      await db.story.createMany({ data: [{ restaurantId: (await db.restaurant.findUniqueOrThrow({ where: { slug: "chez-nene" } })).id, caption: "Notre poulet yassa du jour 🍋", imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=80", expiresAt: new Date(Date.now() + 86400000) }], skipDuplicates: true });
    }
  }
  for (const [email, name, slug, cuisine, district, imageUrl] of [
    ["mariam@example.gn", "Le Jardin de Mariam", "jardin-mariam", "Grillades", "Ratoma", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=85"],
    ["sory@example.gn", "Sory's Kitchen", "sory-kitchen", "Africaine", "Dixinn", "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"],
  ]) {
    const user = await db.user.upsert({ where: { email }, update: {}, create: { name, email, passwordHash: pass, role: "RESTAURANT" } });
    await db.restaurant.upsert({ where: { slug }, update: {}, create: { ownerId: user.id, name, slug, cuisine, district, address: district + ", Conakry", phone: "+224 620 00 00 00", description: "Des produits frais et des recettes maison à découvrir à Conakry.", imageUrl, isApproved: true, menuItems: { create: [{ name: "Assiette du chef", description: "Une assiette généreuse préparée à la minute.", price: 65000, category: "Plats", imageUrl }] } } });
  }
  console.log("Nyamgo database seeded.");
}
main().finally(() => db.$disconnect());
