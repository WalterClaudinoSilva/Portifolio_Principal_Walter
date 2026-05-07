"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Code2, Database, Layout, ShieldCheck, Zap, Globe, Server, Cpu, Copyright, BarChart3, BellRing, CalendarRange, Lock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TecnologiasPage() {
  const technologies = [
    {
      icon: Layout,
      name: "Next.js 15 (App Router)",
      desc: "Framework React para produção que permite renderização híbrida (estática e servidora), garantindo performance excepcional e SEO otimizado.",
      category: "Frontend & Fullstack"
    },
    {
      icon: Code2,
      name: "React 19 & TypeScript",
      desc: "Biblioteca para construção de interfaces modernas com tipagem estática, garantindo código robusto e manutenível.",
      category: "Desenvolvimento"
    },
    {
      icon: Zap,
      name: "Tailwind CSS 4",
      desc: "Framework utilitário para design rápido e responsivo, permitindo a criação de interfaces customizadas com alta performance.",
      category: "Design & Estilo"
    },
    {
      icon: Database,
      name: "MySQL & Prisma ORM",
      desc: "Banco de dados relacional robusto integrado através de um ORM moderno que facilita a manipulação de dados com segurança e performance.",
      category: "Backend & Persistência"
    },
    {
      icon: ShieldCheck,
      name: "NextAuth.js",
      desc: "Solução de autenticação segura para o painel administrativo, utilizando criptografia BCrypt para proteção de credenciais.",
      category: "Segurança"
    },
    {
      icon: Cpu,
      name: "Framer Motion",
      desc: "Biblioteca de animações poderosa para React que proporciona uma experiência de usuário fluida e interações cinematográficas.",
      category: "Interatividade"
    },
    {
      icon: BarChart3,
      name: "Recharts",
      desc: "Biblioteca de gráficos compositáveis para React, utilizada para visualização dinâmica de dados no painel administrativo.",
      category: "Data Visualization"
    },
    {
      icon: BellRing,
      name: "React Toastify",
      desc: "Sistema de notificações elegante e responsivo para fornecer feedback imediato sobre as ações realizadas no sistema.",
      category: "User Experience"
    },
    {
      icon: CalendarRange,
      name: "Date-fns",
      desc: "Conjunto de ferramentas modular e consistente para manipulação e formatação de datas em todo o projeto.",
      category: "Utilitários"
    },
    {
      icon: CheckCircle2,
      name: "Zod",
      desc: "Biblioteca de declaração e validação de esquemas focada em TypeScript, garantindo a integridade dos dados de entrada.",
      category: "Validação"
    },
    {
      icon: Lock,
      name: "BCrypt.js",
      desc: "Algoritmo de hash de senhas otimizado, garantindo que as credenciais administrativas sejam armazenadas com máxima segurança.",
      category: "Segurança"
    },
    {
      icon: Globe,
      name: "Lucide Icons",
      desc: "Coleção de ícones vetoriais consistentes e elegantes que reforçam a identidade visual tecnológica do projeto.",
      category: "Interface"
    }
  ];

  return (
    <div className="bg-[#0A192F] min-h-screen text-white selection:bg-cyan-500/30">
      <Navbar />
      
      <main className="pt-40 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Stack <br/><span className="text-cyan-500">Tecnológica</span></h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              O ecossistema de ferramentas de ponta utilizadas para construir esta plataforma dinâmica e profissional.
            </p>
          </motion.div>

          {/* Grid de Tecnologias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {technologies.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="p-10 rounded-[40px] bg-[#1F3A5F]/20 border border-white/5 hover:border-cyan-500/30 transition-all group backdrop-blur-sm shadow-xl"
              >
                <div className="bg-cyan-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-cyan-500 group-hover:text-[#0A192F]">
                  <tech.icon className="text-cyan-400 w-8 h-8 group-hover:text-inherit" />
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500">{tech.category}</span>
                  <h3 className="text-2xl font-black text-white tracking-tight">{tech.name}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">
                    {tech.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Seção de Direitos Autorais */}
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-[#1F3A5F]/40 to-transparent p-12 lg:p-16 rounded-[48px] border border-white/5 text-center relative overflow-hidden backdrop-blur-md">
              <div className="absolute -top-10 -right-10 bg-cyan-500/10 w-40 h-40 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 bg-blue-500/10 w-40 h-40 rounded-full blur-3xl" />
              
              <Copyright className="w-16 h-16 text-cyan-500 mx-auto mb-8 opacity-50" />
              <h2 className="text-3xl font-black text-white mb-6 tracking-tighter">Propriedade Intelectual</h2>
              <p className="text-gray-400 text-lg font-medium leading-relaxed mb-8">
                Todo o conteúdo deste site, incluindo textos, logotipos, design da interface e códigos customizados, 
                é de propriedade exclusiva de Walter Claudino. A utilização das tecnologias open-source listadas segue 
                suas respectivas licenças (MIT, Apache 2.0, etc.).
              </p>
              <div className="inline-block py-3 px-8 rounded-full bg-cyan-500 text-[#0A192F] font-black text-sm uppercase tracking-widest shadow-xl">
                © 2026 Walter. Todos os direitos reservados.
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
