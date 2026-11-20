"use client";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [nextPath, setNextPath] = useState("/");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mode") === "register") setMode("register");
    setNextPath(params.get("next") || "/");
  }, []);

  return <main className="auth-page"><section className="auth-visual"><a className="brand auth-brand" href="/">nyamgo<span>.</span></a><div><span className="eyebrow">L’APPÉTIT COMMENCE ICI</span><h1>Les bonnes adresses<br/>vous attendent.</h1><p>Découvrez, commandez et soutenez les restaurants de Conakry.</p></div><img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=85" alt="Table garnie de repas"/></section><section className="auth-panel"><div className="auth-box"><div className="auth-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Connexion</button><button type="button" className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Créer un compte</button></div><h2>{mode === "login" ? "Content de vous revoir." : "Bienvenue à table."}</h2>{mode === "register" && <p>Créez votre compte pour commander et retrouver vos adresses préférées.</p>}<form onSubmit={async (event) => {event.preventDefault();setBusy(true);setError("");const data=Object.fromEntries(new FormData(event.currentTarget));const endpoint=mode === "login"?"/api/auth/login":"/api/auth/register";try{const response=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const result=await response.json();if(!response.ok){setError(result.error||"Une erreur est survenue.");return;}window.location.assign(nextPath);}catch{setError("Impossible de joindre Nyamgo.");}finally{setBusy(false);}}}>{mode === "register"&&<label>Nom complet<input name="name" required minLength={2} placeholder="Votre nom"/></label>}<label>Adresse e-mail<input name="email" type="email" required placeholder="vous@exemple.gn"/></label>{mode === "register"&&<label>Téléphone<input name="phone" minLength={6} placeholder="+224 6XX XX XX XX"/></label>}<label>Mot de passe<input name="password" type="password" required minLength={8} placeholder="Au moins 8 caractères"/></label>{error&&<p className="form-error">{error}</p>}<button className="button button-orange auth-submit" disabled={busy}>{busy?"Veuillez patienter…":mode === "login"?"Se connecter":"Créer mon compte"}</button></form><small>En continuant, vous acceptez les conditions d’utilisation de Nyamgo.</small></div></section></main>;
}
