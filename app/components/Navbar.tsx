"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#FCF9F2]/90 backdrop-blur-md border-b border-[#6A784D]/20 px-6 py-4 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="font-serif text-2xl font-bold tracking-tight text-[#20280B] hover:text-[#6A784D] transition-colors"
        >
          medhansh<span className="text-[#C4866D]">.kapoor</span>
          <span className="text-[#6A784D] font-sans font-normal ml-1 text-base">✦</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-semibold tracking-wide transition-colors duration-200 relative group py-1 ${
                isActive(l.href)
                  ? "text-[#C4866D]"
                  : "text-[#33432B] hover:text-[#C4866D]"
              }`}
            >
              {l.label}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-[#C4866D] transition-all duration-300 ${
                  isActive(l.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[#33432B] focus:outline-none p-1"
          aria-label="Toggle menu"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden w-full bg-[#FCF9F2]/95 border-b border-[#6A784D]/20 px-6 py-4 flex flex-col space-y-4 mt-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-semibold tracking-wide py-1 ${
                isActive(l.href) ? "text-[#C4866D]" : "text-[#33432B] hover:text-[#C4866D]"
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
