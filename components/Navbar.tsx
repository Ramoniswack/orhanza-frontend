"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const primaryLinks = [
  { label: "New Arrivals", href: "/shop" },
  { label: "Try On", href: "/try-on" },
  { label: "Custom Made", href: "/custom-made" },
  { label: "About", href: "/about" },
  { label: "Book a Consultation", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScroll = () => setScrolled(pathname !== "/" || window.scrollY > 10);
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      setSearchOpen(false);
      menuButton.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen, searchOpen]);

  const openSearch = () => {
    setMenuOpen(false);
    setSearchOpen(true);
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 grid h-14 grid-cols-3 items-center px-4 transition-colors duration-200 sm:px-5 md:px-8 ${
          scrolled
            ? "border-b border-neutral-200 bg-white text-[#1A1A1A]"
            : "border-b border-transparent bg-transparent text-white"
        }`}
      >
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <button
            ref={menuButton}
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="orhanza-navigation-drawer"
            onClick={() => {
              setSearchOpen(false);
              setMenuOpen((open) => !open);
            }}
            className="flex h-10 w-6 shrink-0 flex-col items-center justify-center gap-[5px]"
          >
            <span className="h-px w-[18px] bg-current" />
            <span className="h-px w-[18px] bg-current" />
          </button>
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            aria-controls="orhanza-search-drawer"
            onClick={() => {
              setMenuOpen(false);
              setSearchOpen((open) => !open);
            }}
            className="grid h-10 w-6 place-items-center"
          >
            {searchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
          </button>
        </div>

        <Link
          href="/"
          aria-label="ORHANZA home"
          className="justify-self-center whitespace-nowrap text-sm font-bold tracking-[0.22em] md:text-base"
        >
          ORHANZA
        </Link>

        <div className="flex items-center justify-self-end gap-3 sm:gap-5">
          <Link href="/profile" aria-label="User profile" className="grid h-10 w-5 place-items-center">
            <UserRound size={18} strokeWidth={1.5} />
          </Link>
          <Link href="/shop" aria-label="Wishlist" className="grid h-10 w-5 place-items-center">
            <Bookmark size={18} strokeWidth={1.5} />
          </Link>
          <Link href="/shop" aria-label="Shopping bag, 0 items" className="relative grid h-10 w-5 place-items-center">
            <ShoppingBag size={18} strokeWidth={1.5} />
            <span aria-hidden className="absolute -right-2 top-1 text-[9px] leading-none">0</span>
          </Link>
        </div>
      </header>

      <div
        id="orhanza-search-drawer"
        aria-hidden={!searchOpen}
        inert={!searchOpen}
        className={`fixed inset-x-0 top-14 z-40 border-b border-neutral-200 bg-white text-[#1A1A1A] transition-[opacity,transform,visibility] duration-200 ${
          searchOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <form action="/shop" role="search" className="flex h-16 items-center gap-4 px-5 md:px-8">
          <Search size={18} strokeWidth={1.5} aria-hidden="true" />
          <input
            ref={searchInput}
            type="search"
            name="q"
            aria-label="Search ORHANZA"
            placeholder="Search"
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-neutral-500"
          />
          <button type="submit" className="text-[11px] font-medium uppercase tracking-[0.14em]">
            Search
          </button>
        </form>
      </div>

      <div
        className={`fixed inset-0 z-[60] ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          tabIndex={menuOpen ? 0 : -1}
          aria-label="Close navigation menu"
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 h-full w-full bg-black/30 transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          id="orhanza-navigation-drawer"
          aria-label="Navigation menu"
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className={`absolute left-0 top-0 flex h-[100dvh] w-[300px] max-w-full flex-col justify-between overflow-y-auto bg-white p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-[#1A1A1A] transition-transform duration-300 sm:w-[340px] ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <button type="button" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} className="grid h-9 w-9 place-items-center">
                <X size={20} strokeWidth={1.5} />
              </button>
              <button type="button" aria-label="Open search" onClick={openSearch} className="grid h-9 w-9 place-items-center">
                <Search size={18} strokeWidth={1.5} />
              </button>
            </div>

            <nav aria-label="Primary menu" className="mt-8">
              <ul className="space-y-3.5 text-[15px] font-semibold">
                {primaryLinks.map((link, index) => (
                  <li
                    key={link.label}
                    className={`transition-[opacity,transform] duration-300 ${
                      menuOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
                    }`}
                    style={{ transitionDelay: menuOpen ? `${index * 45}ms` : "0ms" }}
                  >
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className="block transition-[opacity,transform] duration-200 hover:translate-x-1 hover:opacity-60"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex gap-4 text-[11px] text-neutral-500">
            <span>Nepal</span>
            <span aria-hidden>|</span>
            <span>English</span>
          </div>
        </aside>
      </div>
    </>
  );
}
