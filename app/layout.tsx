import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nyamgo — Découvrez les meilleurs restaurants",
  description: "Découvrez les restaurants, consultez les menus et commandez vos repas en Guinée.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
