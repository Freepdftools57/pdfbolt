"use client";

import Link from "next/link";
import { useState } from "react";
import { tools } from "@/lib/tools";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span>
            PDF<span className="text-primary">Bolt</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="px-3 py-1.5 text-sm text-muted hover:text-foreground rounded-md hover:bg-card-hover transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-muted hover:text-foreground"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-2">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-muted hover:text-foreground rounded-md hover:bg-card-hover transition-colors"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
