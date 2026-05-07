"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, MapPin, Mail, Phone, Linkedin, Github, Briefcase, Award, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SobrePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-bg-dark min-h-screen text-white selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-40 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Sidebar info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="bg-gradient-to-br from-bg-card/40 to-transparent rounded-[40px] p-8 border border-white/5 sticky top-32 backdrop-blur-md">
                <div className="aspect-square rounded-[32px] overflow-hidden mb-10 border-2 border-white/10 shadow-2xl group">
                  {profile?.image ? (
                    <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-bg-dark flex items-center justify-center">
                      <GraduationCap className="w-20 h-20 text-white/5" />
                    </div>
                  )}
                </div>
                
                <h1 className="text-3xl font-black text-white mb-3 tracking-tighter">{profile?.name || "Walter Claudino"}</h1>
                <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-8">{profile?.title || "Professor EBTT / IFAM"}</p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gray-400 group">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{profile?.location || "Manacapuru, AM"}</span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-400 group">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium break-all">{profile?.email || "walter.claudino@ifam.edu.br"}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-4 text-gray-400 group">
                      <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-bg-dark transition-all">
                        <Phone className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-10">
                  {profile?.linkedin && (
                    <a href={profile.linkedin} target="_blank" className="bg-white/5 p-4 rounded-2xl text-gray-400 hover:text-white hover:bg-primary transition-all active:scale-95 shadow-lg">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                  {profile?.github && (
                    <a href={profile.github} target="_blank" className="bg-white/5 p-4 rounded-2xl text-gray-400 hover:text-white hover:bg-bg-dark transition-all active:scale-95 shadow-lg">
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main bio */}
            <div className="lg:col-span-2 space-y-20">
              <motion.section {...fadeInUp}>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-10 tracking-tighter">
                  {profile?.aboutHistoryHeadline?.split(" ").slice(0, -1).join(" ") || "Minha"} <span className="text-primary">{profile?.aboutHistoryHeadline?.split(" ").slice(-1) || "História"}</span>
                </h2>
                <div className="prose prose-invert max-w-none text-gray-200 text-xl leading-relaxed space-y-8 font-medium whitespace-pre-wrap">
                  {profile?.bio || "Professor do Instituto Federal do Amazonas (IFAM) - Campus Manacapuru. Atuando como Chefe do DEPEX e liderando projetos de inovação tecnológica."}
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="space-y-10"
              >
                <h2 className="text-3xl font-black text-white tracking-tighter">
                  {profile?.expertiseHeadline?.split(" & ").length > 1 ? (
                    <>
                      {profile.expertiseHeadline.split(" & ")[0]} & <span className="text-primary">{profile.expertiseHeadline.split(" & ")[1]}</span>
                    </>
                  ) : (
                    profile?.expertiseHeadline || "Atuação & Expertise"
                  )}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-bg-card/20 p-10 rounded-[40px] border border-white/5 hover:border-primary/30 transition-all group backdrop-blur-sm">
                    <div className="bg-primary/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-primary group-hover:text-bg-dark">
                      <GraduationCap className="text-primary w-8 h-8 group-hover:text-inherit" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{profile?.expertise1Title || "Docência IFAM"}</h3>
                    <p className="text-gray-200 font-medium leading-relaxed">
                      {profile?.expertise1Desc || "Professor de Ensino Básico, Técnico e Tecnológico (EBTT) no Campus Manacapuru, formando a próxima geração de talentos."}
                    </p>
                  </div>
                  <div className="bg-bg-card/20 p-10 rounded-[40px] border border-white/5 hover:border-secondary/30 transition-all group backdrop-blur-sm">
                    <div className="bg-secondary/10 w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:bg-secondary group-hover:text-white">
                      <Briefcase className="text-secondary w-8 h-8 group-hover:text-inherit" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{profile?.expertise2Title || "Gestão Estratégica"}</h3>
                    <p className="text-gray-200 font-medium leading-relaxed">
                      {profile?.expertise2Desc || "Chefe do DEPEX, liderando o Departamento de Extensão e Pesquisa e conectando a academia com o mercado tecnológico."}
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-primary/10 to-secondary/10 p-12 rounded-[48px] border border-primary/20"
              >
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="shrink-0">
                    <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(var(--color-primary),0.4)]">
                      <Award className="text-bg-dark w-10 h-10" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">{profile?.visionTitle || "Visão de Futuro"}</h3>
                    <p className="text-gray-200 font-medium text-lg leading-relaxed whitespace-pre-wrap">
                      {profile?.visionDesc || "Meu objetivo é aplicar Inteligência Artificial e IoT para resolver desafios reais da região amazônica, impulsionando o desenvolvimento tecnológico sustentável."}
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
