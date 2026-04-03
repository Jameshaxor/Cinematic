"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bookmark, User, Menu, X, Film } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
      scrolled ? "glass border-b border-white/[0.04]" : "bg-transparent"
    )}>
      <div className="section-padding flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-glow-violet"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
            <Film className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-bold text-[17px] tracking-tight text-ivory">
            Cinematic
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                pathname === link.href
                  ? "text-violet-light bg-violet-muted"
                  : "text-silver hover:text-ivory hover:bg-ash"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div layoutId="nav-pill"
                  className="absolute inset-0 rounded-lg bg-violet-muted border border-violet/20"
                  style={{ zIndex: -1 }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link href="/search" className="btn-icon hidden md:flex" aria-label="Search">
            <Search className="w-4 h-4" />
          </Link>

          {session ? (
            <div className="relative group">
              <button className="flex items-center gap-2.5 rounded-lg border border-ash bg-graphite px-3 py-2 hover:border-smoke transition-all text-sm">
                {session.user?.image
                  ? <img src={session.user.image} alt="Avatar" className="w-5 h-5 rounded-full" />
                  : <div className="w-5 h-5 rounded-full bg-violet-muted border border-violet/30 flex items-center justify-center">
                      <span className="text-[10px] text-violet-light font-bold">
                        {session.user?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                }
                <span className="text-ivory hidden sm:block max-w-[90px] truncate font-medium">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-cinema opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <Link href="/profile" className="flex items-center gap-2.5 px-4 py-3 text-sm text-silver hover:text-ivory hover:bg-ash transition-colors">
                  <User className="w-3.5 h-3.5" /> Profile & Taste
                </Link>
                <Link href="/watchlist" className="flex items-center gap-2.5 px-4 py-3 text-sm text-silver hover:text-ivory hover:bg-ash transition-colors">
                  <Bookmark className="w-3.5 h-3.5" /> Watchlist
                </Link>
                <div className="h-px bg-ash mx-3" />
                <button onClick={() => signOut()}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm text-muted hover:text-rose-light hover:bg-rose-muted transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/signin" className="btn-primary py-2 hidden md:block">
              Sign In
            </Link>
          )}

          <button className="btn-icon md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="md:hidden glass border-t border-white/[0.04] overflow-hidden">
            <nav className="section-padding py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                  className={cn("py-3 px-4 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href ? "bg-violet-muted text-violet-light" : "text-silver hover:text-ivory hover:bg-ash"
                  )}>
                  {link.label}
                </Link>
              ))}
              {!session && (
                <Link href="/auth/signin" onClick={() => setMenuOpen(false)} className="btn-primary text-center mt-2">
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
