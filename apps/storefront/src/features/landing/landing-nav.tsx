"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "../cart/use-cart";
import { ThemeSwitch } from "../layout/theme-switch";
import { WHATSAPP_BOOKING_URL } from "./landing-links";

const NAV_LINKS = [
  ["#doctora", "La Doctora"],
  ["#servicios", "Servicios"],
  ["#instagram", "Instagram"],
  ["#blog", "Blog"],
  ["#tienda", "Tienda"],
  ["#contacto", "Contacto"],
] as const;

export function LandingNav() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartQuery } = useCart();
  const quantity = cartQuery.data?.totalQuantity ?? 0;

  useEffect(() => {
    const update = () => setSolid(window.scrollY > 40);
    update();
    document.addEventListener("scroll", update, { passive: true });
    return () => document.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={solid ? "nav solid" : "nav"} data-slot="landing-nav">
      <a className="brand" href="#inicio">
        <svg aria-hidden="true" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1" />
          <path d="M24 12c-4 4-6 8-6 12s2 8 6 12c4-4 6-8 6-12s-2-8-6-12Z" stroke="currentColor" strokeWidth="1" />
          <path d="M17 24h14" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="brand-word"><b>Anne Kusch</b><span>CDE · Diagnóstico Ecográfico</span></span>
      </a>
      <nav aria-label="Secciones" className={menuOpen ? "nav-links open" : "nav-links"} id="landing-nav-links">
        {NAV_LINKS.map(([href, label]) => (
          <a href={href} key={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
      </nav>
      <div className="nav-actions">
        <a className="btn btn-gold" href={WHATSAPP_BOOKING_URL} rel="noopener" target="_blank">Agendar</a>
        <Link aria-label={`Ver carrito, ${quantity} ${quantity === 1 ? "unidad" : "unidades"}`} className="icon-btn" href="/cart">
          <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" width="18"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" /><circle cx="9" cy="21" r="1" /><circle cx="17" cy="21" r="1" /></svg>
          {quantity > 0 ? <span aria-hidden="true" className="cart-badge">{quantity}</span> : null}
        </Link>
        <ThemeSwitch />
        <button aria-controls="landing-nav-links" aria-expanded={menuOpen} aria-label="Abrir menú" className="hamburger" onClick={() => setMenuOpen((open) => !open)} type="button">
          <svg aria-hidden="true" fill="none" height="22" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24" width="22"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </header>
  );
}
