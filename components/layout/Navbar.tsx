"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookmarkCheck, User, Menu, X, Clapperboard } from "lucide-react";
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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-void/95 backdrop-blur-md border-b border-ash"
          : "bg-transparent"
      )}
    >
      <div className="section-padding flex items-center justify-between h-16 md:h-18">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded bg-ember flex items-center justify-center group-hover:bg-ember-light transition-colors">
            <Clapperboard className="w-4 h-4 text-void" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-ivory">
            Cinematic
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-body transition-colors relative py-1",
                pathname === link.href
                  ? "text-ivory"
                  : "text-silver hover:text-ivory"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-px bg-ember"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <Link href="/search" className="btn-icon hidden md:flex" aria-label="Search">
            <Search className="w-4 h-4" />
          </Link>

          {session ? (
            <div className="relative group">
              <button className="flex items-center gap-2 rounded-full border border-ash bg-obsidian px-3 py-1.5 hover:border-smoke transition-all">
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <User className="w-4 h-4 text-silver" />
                )}
                <span className="text-sm text-ivory hidden sm:block max-w-[100px] truncate">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </button>
              {/* Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-obsidian border border-ash rounded-lg shadow-cinema opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/profile" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-graphite rounded-t-lg transition-colors">
                  <User className="w-4 h-4 text-silver" /> Profile
                </Link>
                <Link href="/watchlist" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-graphite transition-colors">
                  <BookmarkCheck className="w-4 h-4 text-silver" /> Watchlist
                </Link>
                <hr className="border-ash" />
                <button
                  onClick={() => signOut()}
                  className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm text-silver hover:bg-graphite hover:text-reel rounded-b-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/signin" className="btn-primary py-2 px-4 text-sm hidden md:block">
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="btn-icon md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-obsidian border-t border-ash overflow-hidden"
          >
            <nav className="section-padding py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "py-3 px-4 rounded-md text-sm font-body transition-colors",
                    pathname === link.href
                      ? "bg-graphite text-ivory"
                      : "text-silver hover:text-ivory hover:bg-graphite"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {!session && (
                <Link
                  href="/auth/signin"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary text-center mt-2"
                >
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
