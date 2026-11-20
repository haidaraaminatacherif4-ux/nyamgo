# Nyamgo

Application web responsive de découverte de restaurants et de commande de repas en Guinée.

## Technologies

- Next.js 15, React 19 et TypeScript
- Prisma ORM et PostgreSQL
- Sessions JWT stockées dans un cookie HttpOnly

## Prérequis

Node.js 20 ou plus récent et une base PostgreSQL accessible.

## Lancement local

```bash
npm install
cp .env.example .env
```

Configurez `DATABASE_URL` et `AUTH_SECRET` dans `.env`. `AUTH_SECRET` doit contenir au moins 32 caractères aléatoires. Puis lancez :

```bash
npm run db:push
npm run db:seed
npm run dev
```

Ouvrir http://localhost:3000.

## Vérifications

```bash
npx prisma validate
npm run typecheck
npm run build
```

Une GitHub Actions workflow exécute la validation Prisma, la vérification TypeScript et le build sur les pushes vers `main` et les pull requests. Ces commandes nécessitent les dépendances installées; je ne peux pas exécuter le terminal depuis cette interface.

## Déploiement

1. Créez une base PostgreSQL hébergée et définissez `DATABASE_URL` dans les variables d’environnement du fournisseur.
2. Définissez `AUTH_SECRET` comme secret aléatoire robuste d’au moins 32 caractères. Ne publiez pas sa valeur dans Git.
3. Appliquez le schéma avec `npx prisma db push` depuis un environnement ayant accès à la base.
4. Déployez l’application. La commande de build est `npm run build`.

Le seed fournit des comptes et données de démonstration avec un mot de passe connu. Ne lancez pas ce seed sur un environnement public de production; retirez ou modifiez les données de démonstration avant mise en ligne.
