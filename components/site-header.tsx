"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Session = { id: string; name: string; role: string; restaurant?: { slug: string } | null };
export function SiteHeader() {
  const [user, setUser] = useState<Session | null>(null);
  const [count, setCount] = useState(0);
  useEffect(() => {
    fetch("/api/auth/session").then((r) => r.json()).then((d) => setUser(d.user)).catch(() => {});
    const update = () => { try { const c = JSON.parse(localStorage.getItem("nyamgo-cart") || "[]"); setCount(c.reduce((n: number, x: { quantity: number }) => n + x.quantity, 0)); } catch { setCount(0); } };
    update(); window.addEventListener("storage", update); window.addEventListener("nyamgo-cart-update", update);
    return () => { window.removeEventListener("storage", update); window.removeEventListener("nyamgo-cart-update", update); };
  }, []);
  const dashboard = user?.role === "ADMIN" ? "/admin" : user?.role === "RESTAURANT" ? "/restaurant/espace" : "/commandes";
  return <header className="site-header"><Link className="brand" href="/">nyamgo<span>.</span></Link><nav className="desktop-nav"><a href="/#restaurants">Restaurants</a><a href="/#stories">Stories</a><a href="/restaurant/espace">Espace restaurant</a></nav><div className="header-actions"><Link className="cart-link" href="/panier">Panier <span>{count}</span></Link>{user ? <Link className="avatar-link" href={dashboard}>{user.name.split(" ")[0]} <span>↗</span></Link> : <Link className="login-link" href="/connexion">Connexion <span>↗</span></Link>}</div></header>;
}
