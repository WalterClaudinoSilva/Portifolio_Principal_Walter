"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Code2 } from "lucide-react";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Projetos", href: "/projetos" },
  { label: "Experiência", href: "/experiencia" },
  { label: "Produção", href: "/producao" },
  { label: "Contato", href: "/contato" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Error fetching navbar profile:", err));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-bg-dark/80 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <Code2 className="text-white w-6 h-6" />
            </div>
            <span className="text-white font-bold text-xl tracking-tighter uppercase">{profile?.name || "WALTER CLAUDINO"}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-gray-300"}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full border border-white/10 text-sm font-medium transition-all"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-bg-card border-t border-white/10 py-6 px-4 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg text-gray-300 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
