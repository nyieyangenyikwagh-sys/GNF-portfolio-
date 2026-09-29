"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Portfolio } from "@/data/types";
import { Brand, Button } from "./casebook-primitives";
export function Header({ navigation, profile, ui }: { navigation: Portfolio["navigation"]; profile: Pick<Portfolio["profile"], "name" | "title" | "email">; ui: Pick<Portfolio["ui"], "backToTop" | "navigation" | "connect" | "openMenu" | "closeMenu" | "menu"> }) {
  const [scrolled, setScrolled] = useState(false), [open, setOpen] = useState(false), [active, setActive] = useState("overview");
  const dialogRef = useRef<HTMLDivElement>(null), closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const update = () => { setScrolled(window.scrollY > 20); const sections = navigation.map(item => document.getElementById(item.id)).filter((item): item is HTMLElement => !!item); const current = sections.filter(item => item.getBoundingClientRect().top <= window.innerHeight * .4).at(-1); setActive(current?.id ?? navigation[0].id); };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [navigation]);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null, overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; closeRef.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab") { const items = [...(dialogRef.current?.querySelectorAll<HTMLElement>("a,button") ?? [])]; const first = items[0], last = items.at(-1); if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } }
    };
    window.addEventListener("keydown", key);
    const main = document.querySelector("main"), footer = document.querySelector("footer");
    if (main) main.inert = true; if (footer) footer.inert = true;
    return () => { document.body.style.overflow = overflow; window.removeEventListener("keydown", key); if (main) main.inert = false; if (footer) footer.inert = false; previous?.focus(); };
  }, [open]);
  return <header className={`header ${scrolled ? "header-scrolled" : ""}`}><div className="shell header-inner"><Brand {...profile} backToTop={ui.backToTop} /><nav className="desktop-nav" aria-label={ui.navigation}>{navigation.map(item => <a key={item.id} href={`#${item.id}`} className={active === item.id ? "active" : ""} aria-current={active === item.id ? "location" : undefined}>{item.title}</a>)}</nav><Button href="#contact" className="header-cta">{ui.connect}<ArrowUpRight size={16} /></Button><button className="menu-button" onClick={() => setOpen(true)} aria-label={ui.openMenu} aria-expanded={open}><Menu /></button></div><AnimatePresence>{open && <motion.div ref={dialogRef} className="mobile-menu" role="dialog" aria-modal="true" aria-label={ui.menu} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }}><div className="mobile-menu-top"><Brand {...profile} backToTop={ui.backToTop} /><button ref={closeRef} className="menu-button" onClick={() => setOpen(false)} aria-label={ui.closeMenu}><X /></button></div><nav aria-label={ui.navigation}>{navigation.map((item, i) => <motion.a key={item.id} href={`#${item.id}`} onClick={() => setOpen(false)} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .22, delay: reduced ? 0 : .04 * i }} aria-current={active === item.id ? "location" : undefined}>{item.title}<span>{String(i + 1).padStart(2, "0")}</span></motion.a>)}</nav>{profile.email && <Button href={`mailto:${profile.email}`} className="mobile-menu-cta">{profile.email}</Button>}</motion.div>}</AnimatePresence></header>;
}
