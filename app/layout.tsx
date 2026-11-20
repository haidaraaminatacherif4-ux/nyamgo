import "./globals.css";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Nyamgo — Les bonnes saveurs de Conakry",
  description: "Découvrez les restaurants de Conakry, leurs menus et leurs nouveautés. Commandez directement auprès des restaurants.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body><SiteHeader />{children}<footer className="footer"><a className="brand" href="/">nyamgo<span>.</span></a><p>Les saveurs de Conakry, à portée de main.</p><small>© {new Date().getFullYear()} Nyamgo · Fait avec ❤️ en Guinée</small></footer></body></html>;
}
