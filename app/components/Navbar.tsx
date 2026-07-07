"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./ThemeProvider";
import MagneticWrap from "./MagneticWrap";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background border-b-[3px] border-border px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
          medhansh<span className="text-accent">.kapoor</span>
        </Link>

        <div className="hidden md:flex items-center gap-3">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <MagneticWrap key={l.href}>
                <Link
                  href={l.href}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-widest border-[3px] transition-all duration-200 select-none cursor-pointer ${
                    active
                      ? "bg-background text-foreground border-border shadow-[3px_3px_0_0_var(--accent)] translate-x-[1px] translate-y-[1px]"
                      : "bg-background text-foreground border-border shadow-xs hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  }`}
                >
                  {l.label}
                </Link>
              </MagneticWrap>
            );
          })}
          <MagneticWrap>
            <button
              onClick={toggle}
              className="p-2 border-2 border-border shadow-sm hover:shadow-[3px_3px_0_0_var(--color-accent-secondary)] transition-all duration-200 text-accent-secondary cursor-pointer bg-background"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
            </button>
          </MagneticWrap>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 border-2 border-border text-accent"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
          </button>
          <button onClick={() => setOpen(!open)} className="text-foreground focus:outline-none p-1" aria-label="Toggle menu">
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden w-full bg-background border-b-[3px] border-border px-6 py-4 flex flex-col space-y-4 mt-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2 text-[11px] font-bold uppercase tracking-widest border-[3px] transition-all duration-200 ${
                pathname === l.href
                  ? "bg-background text-foreground border-border shadow-[3px_3px_0_0_var(--accent)] translate-x-[1px] translate-y-[1px]"
                  : "bg-background text-foreground border-border shadow-xs"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
