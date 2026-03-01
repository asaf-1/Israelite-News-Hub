"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Moon, Sun, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/sources";

export default function Header() {
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved === null ? true : saved === "dark";
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      {/* Top bar */}
      <div className="header-topbar">
        <div className="header-topbar-inner">
          <span className="topbar-flag">🇮🇱</span>
          <span className="topbar-text">Israelite News Hub – Your window to Israel &amp; the world</span>
          <span className="topbar-date">
            {new Date().toLocaleDateString("en-IL", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>
      </div>

      <div className="header-inner">
        {/* Logo */}
        <Link href="/" className="logo">
          <span className="logo-emblem">✡</span>
          <div>
            <span className="logo-name">Israelite</span>
            <span className="logo-sub">News Hub</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`nav-link ${pathname.includes(cat.slug) ? "nav-link-active" : ""}`}
            >
              <span className="nav-icon">{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="header-controls">
          <form onSubmit={handleSearch} className="search-form">
            <Search size={15} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search news…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <button onClick={toggleTheme} className="icon-btn theme-btn" aria-label="Toggle theme" title={dark ? "Light mode" : "Dark mode"}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-btn menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-nav" onClick={() => setMenuOpen(false)}>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="mobile-nav-link">
              {cat.icon} {cat.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
