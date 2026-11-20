# Nyamgo

Application web responsive de découverte de restaurants et de commande de repas en Guinée.

## Stack

- Next.js 15, React 19 et TypeScript
- Prisma ORM et PostgreSQL
- Sessions JWT stockées dans un cookie HttpOnly

## Prérequis

Node.js 20 ou plus récent et une base PostgreSQL accessible.

## Démarrage local

```bash
npm install
cp .env.example .env
```

Renseignez `DATABASE_URL` et `AUTH_SECRET` dans `.env`, puis :

```bash
npm run db:push
npm run db:seed
npm run dev
```

Ouvrir http://localhost:3000. Vérifications disponibles : `npm run typecheck` et `npm run build`.

## Déploiement

1. Créez une base PostgreSQL et configurez `DATABASE_URL` dans l’environnement de déploiement.
2. Définissez `AUTH_SECRET` avec une valeur aléatoire forte (au moins 32 caractères). Ne réutilisez pas la valeur de développement.
3. Configurez les variables d’environnement et lancez `npm run build` avant le déploiement.
4. Appliquez le schéma avec `npm run db:push`.

Le seed de démonstration crée des comptes de test. Utilisez uniquement des identifiants non sensibles et retirez ces comptes avant une mise en production.
