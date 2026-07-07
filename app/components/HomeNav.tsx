"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import MagneticWrap from "./MagneticWrap";

const links = [
  { href: "/projects", label: "View Projects" },
  { href: "/experience", label: "View Experience" },
  { href: "/about", label: "About Me" },
];

export default function HomeNav() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-[#6A784D] font-semibold tracking-wide"
      >
        Explore the full story
      </motion.p>
      <div className="flex flex-wrap justify-center gap-4">
        {links.map((l, i) => (
          <motion.div
            key={l.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.6 + i * 0.12 }}
          >
            <MagneticWrap>
              <Link
                href={l.href}
                className={`group inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-shadow duration-300 ${
                  i === 0
                    ? "bg-[#33432B] text-[#FCF9F2]"
                    : "border-2 border-[#6A784D] text-[#20280B]"
                }`}
              >
                {l.label} <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticWrap>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
