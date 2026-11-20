# Nyamgo

Application responsive de découverte de restaurants et de commande de repas en Guinée.

## Stack

- Next.js 15 / React 19 / TypeScript
- Prisma ORM
- PostgreSQL
- Authentification JWT sécurisée par cookie HttpOnly
- Déploiement adapté à Vercel + Neon/Supabase

## Démarrage

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Ouvrir `http://localhost:3000`.

## Comptes de démonstration

Après le seed :

- Client : `aissatou@example.gn` / `Password123!`
- Restaurant : `restaurant@nyamgo.gn` / `Password123!`
- Administrateur : `admin@nyamgo.gn` / `Password123!`

## Déploiement gratuit

1. Créer une base PostgreSQL gratuite sur Neon ou Supabase.
2. Importer le projet sur Vercel.
3. Ajouter `DATABASE_URL` et `AUTH_SECRET` dans les variables d'environnement.
4. Exécuter `npx prisma db push` depuis un terminal connecté à la base.
5. Déployer.
