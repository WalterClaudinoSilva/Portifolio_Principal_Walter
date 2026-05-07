"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

export default function Footer() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error("Error fetching footer profile:", err));
  }, []);

  return (
    <footer className="bg-bg-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-bold text-2xl mb-4 tracking-tighter uppercase">{profile?.name || "WALTER CLAUDINO"}</h3>
            <p className="text-gray-400 max-w-md leading-relaxed">
              {profile?.title || "Professor EBTT do IFAM, especialista em Inteligência Artificial, IoT e Visão Computacional. Líder de projetos tecnológicos e pesquisador apaixonado por inovação."}
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link href="/sobre" className="text-gray-400 hover:text-primary transition-colors">Sobre</Link></li>
              <li><Link href="/projetos" className="text-gray-400 hover:text-primary transition-colors">Projetos</Link></li>
              <li><Link href="/experiencia" className="text-gray-400 hover:text-primary transition-colors">Experiência</Link></li>
              <li><Link href="/contato" className="text-gray-400 hover:text-primary transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-primary transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="bg-white/5 p-3 rounded-xl text-gray-400 hover:text-white hover:bg-primary transition-all">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {profile?.footerCopyright || "© 2026 Walter. Todos os direitos reservados."}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/tecnologias" className="text-gray-500 text-sm hover:text-primary transition-colors">Tecnologias & Direitos</Link>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{profile?.location || "Manacapuru, Amazonas - Brasil"}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
