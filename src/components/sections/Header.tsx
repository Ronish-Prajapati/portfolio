"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { ArrowDownToLine, Menu, X } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { CTA, SECTIONS } from "@/lib/sections";

interface HeaderProps {
  email?: string | null;
  resumeUrl?: string | null;
  /** "home" renders transparent over the hero; "page" is always solid. */
  variant?: "home" | "page";
}

const NAV = [
  ...SECTIONS.filter((s) => s.nav).map((s) => ({ href: `/#${s.id}`, id: s.id, label: s.nav as string })),
];
// Blog sits before Contact so Contact stays the last stop on the route.
NAV.splice(NAV.length - 1, 0, { href: "/blog", id: "blog", label: "Blog" });

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 20 14" className="h-3 w-[1.1rem] text-ember" aria-hidden>
        <path d="M0 14 L7.5 3 L10.5 7 L13 4 L20 14 Z" fill="currentColor" />
      </svg>
      <span className="font-display text-[1.02rem] font-semibold uppercase tracking-[0.08em] text-snow [font-stretch:82%] [font-variation-settings:'wdth'_82]">
        Ronish Prajapati
      </span>
    </span>
  );
}

const Header = ({ resumeUrl, variant = "page" }: HeaderProps) => {
  const isHome = variant === "home";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const active = useActiveSection(isHome ? SECTIONS.map((s) => s.id) : []);
  const resume = resumeUrl ?? "/ronish-frontend.pdf";

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));
  useEffect(() => setScrolled(window.scrollY > 24), []);

  const openMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    setMenuOpen(true);
    requestAnimationFrame(() => setMenuVisible(true));
  }, []);

  const closeMenu = useCallback((afterClose?: () => void) => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    setMenuVisible(false);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        document.documentElement.style.overflow = "";
        dialog.close();
        afterClose?.();
      },
      reduce ? 0 : 220,
    );
  }, []);

  // Native dialog handles Escape and focus; keep our state and scroll lock in sync.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.style.overflow = "";
      setMenuOpen(false);
      setMenuVisible(false);
      menuButtonRef.current?.focus();
    };
    const onCancel = (e: Event) => {
      e.preventDefault();
      closeMenu();
    };
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("cancel", onCancel);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("cancel", onCancel);
    };
  }, [closeMenu]);

  const solid = !isHome || scrolled;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        solid
          ? "border-b border-snow/[0.08] bg-forest-950/80 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Main" className="s-container flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Ronish Prajapati, home" className="shrink-0 rounded-[2px]">
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const current = isHome && active === item.id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={current ? "location" : undefined}
                  className={`s-link text-sm ${current ? "!bg-[length:100%_1px] text-ember" : "text-fog hover:text-snow"}`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={resume}
            target="_blank"
            rel="noopener noreferrer"
            className="s-btn s-btn-ghost hidden h-9 px-3.5 text-sm sm:inline-flex"
          >
            <ArrowDownToLine data-nudge="down" aria-hidden />
            {CTA.resume}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="s-btn s-btn-ghost h-9 px-3 text-sm lg:hidden"
          >
            <Menu aria-hidden />
            Menu
          </button>
        </div>
      </nav>

      <dialog
        ref={dialogRef}
        id="site-menu"
        aria-label="Site menu"
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-fog backdrop:bg-transparent"
      >
        <div
          className={`summit flex h-full flex-col bg-forest-950 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none ${
            menuVisible ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[url(/landscape/topo.svg)] bg-[length:160%_auto] bg-[position:30%_70%] bg-no-repeat opacity-[0.12]"
          />
          <div className="s-container relative flex h-16 items-center justify-between">
            <Wordmark />
            <button type="button" onClick={() => closeMenu()} className="s-btn s-btn-ghost h-9 px-3 text-sm">
              <X aria-hidden />
              Close
            </button>
          </div>
          <ol className="s-container relative mt-6 flex flex-1 flex-col gap-1 overflow-y-auto pb-6">
            {NAV.map((item) => {
              const section = SECTIONS.find((s) => s.id === item.id);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("/#") && isHome) {
                        e.preventDefault();
                        closeMenu(() => {
                          document.getElementById(item.id)?.scrollIntoView();
                          history.pushState(null, "", `#${item.id}`);
                        });
                      } else closeMenu();
                    }}
                    className="group flex items-baseline justify-between gap-4 border-b border-snow/[0.07] py-4"
                  >
                    <span className="s-display text-[2.6rem] transition-colors group-hover:text-ember">{item.label}</span>
                    {section ? <span className="s-label hidden min-[420px]:inline">{section.waypoint}</span> : null}
                  </a>
                </li>
              );
            })}
          </ol>
          <div className="s-container relative flex flex-wrap gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <a href={resume} target="_blank" rel="noopener noreferrer" className="s-btn s-btn-ghost">
              <ArrowDownToLine aria-hidden />
              {CTA.resume}
            </a>
            <Link
              href="/#contact"
              onClick={(e) => {
                if (!isHome) return closeMenu();
                e.preventDefault();
                closeMenu(() => {
                  document.getElementById("contact")?.scrollIntoView();
                  history.pushState(null, "", "#contact");
                });
              }}
              className="s-btn s-btn-primary"
            >
              {CTA.contact}
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  );
};

export default Header;
