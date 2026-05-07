"use client";

import Link from "next/link";
import { ArrowRight, Code2, Cpu, Brain, Briefcase, GraduationCap, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalProjects: 0, yearsOfExperience: 0 });

  useEffect(() => {
    // Fetch data from API instead of direct prisma for client component
    const fetchData = async () => {
      const [profileRes, projectsRes, statsRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/projects"),
        fetch("/api/admin/stats")
      ]);
      
      const profileData = await profileRes.json();
      const projectsData = await projectsRes.json();
      const statsData = await statsRes.json();

      setProfile(profileData);
      setProjects(projectsData.filter((p: any) => p.featured && p.published).slice(0, 3));
      
      // Calculate years of experience from profile/stats
      setStats({
        totalProjects: statsData.projects,
        yearsOfExperience: statsData.experiences > 0 ? 10 : 0 // Placeholder logic, could be more precise
      });
    };

    fetchData();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-bg-dark min-h-screen selection:bg-primary/30 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[120px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2] 
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.span 
              {...fadeInUp}
              className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8"
            >
              {profile?.heroBadge || "Professor EBTT | IFAM Campus Manacapuru"}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl lg:text-8xl font-black mb-8 tracking-tighter leading-[1.1] pt-4"
            >
              {profile?.heroTitle ? (
                profile.heroTitle.split('\n').map((line: string, index: number, array: string[]) => (
                  <span key={index} className="block">
                    {index === array.length - 1 ? (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary inline-block py-2">
                        {line}
                      </span>
                    ) : (
                      <span className="text-white">
                        {line}
                      </span>
                    )}
                  </span>
                ))
              ) : (
                <>
                  <span className="text-white">Liderando a</span> <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-primary inline-block py-2">
                    Inovação com IA
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl text-gray-200 mb-12 leading-relaxed max-w-2xl mx-auto font-medium whitespace-pre-wrap"
            >
              {profile?.bio || "Especialista em Inteligência Artificial, IoT e Visão Computacional. Transformando tecnologia em soluções para o mundo real."}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6"
            >
              <Link
                href="/projetos"
                className="group bg-primary hover:bg-primary/80 text-bg-dark px-10 py-5 rounded-2xl font-black transition-all shadow-glow hover:shadow-primary/40 flex items-center gap-3 active:scale-95"
              >
                Ver Projetos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contato"
                className="bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-bold border border-white/10 transition-all backdrop-blur-md active:scale-95"
              >
                Contato
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specialties - Refined Cards */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Brain, 
                title: profile?.specialty1Title || "Inteligência Artificial", 
                desc: profile?.specialty1Desc || "Modelos preditivos e redes neurais aplicadas à resolução de problemas complexos.", 
                color: "from-primary to-secondary" 
              },
              { 
                icon: Cpu, 
                title: profile?.specialty2Title || "IoT & Embarcados", 
                desc: profile?.specialty2Desc || "Integração hardware-software com foco em monitoramento e automação inteligente.", 
                color: "from-secondary to-accent" 
              },
              { 
                icon: Code2, 
                title: profile?.specialty3Title || "Visão Computacional", 
                desc: profile?.specialty3Desc || "Processamento de imagens e reconhecimento de padrões para aplicações industriais.", 
                color: "from-accent to-primary" 
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-10 rounded-[40px] glass border border-white/5 hover:border-primary/20 transition-all group relative overflow-hidden shadow-glow-hover"
              >
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="bg-white/5 w-16 h-16 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary/20">
                  <item.icon className="text-primary w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects - Refined Layout */}
      <section className="py-32 bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tighter">
                {profile?.projectsHeadline?.split(" ").slice(0, -1).join(" ") || "Projetos em"} <br/> 
                <span className="text-primary">{profile?.projectsHeadline?.split(" ").slice(-1) || "Destaque"}</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium max-w-xl">{profile?.projectsSubheadline || "Inovação aplicada através de pesquisas e desenvolvimentos no IFAM."}</p>
            </div>
            <Link href="/projetos" className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl border border-white/10 transition-all font-bold">
              Explorar Todos <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group glass rounded-[48px] overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 flex flex-col shadow-glow-hover"
              >
                <div className="h-72 bg-bg-dark relative overflow-hidden">
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bg-card to-bg-dark">
                      <Briefcase className="w-20 h-20 text-white/5" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent opacity-60" />
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-primary transition-colors tracking-tight">{project.title}</h3>
                  <p className="text-gray-400 text-base mb-8 line-clamp-3 font-medium leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-auto">
                    <Link href={`/projetos/${project.id}`} className="inline-flex items-center gap-2 text-white font-black uppercase text-xs tracking-widest hover:text-primary transition-colors">
                      Detalhes do Projeto <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Premium Look */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-bg-card/40 to-transparent p-12 lg:p-24 rounded-[60px] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden border-2 border-white/10 shadow-2xl relative z-10">
                  {profile?.image ? (
                    <img src={profile.image} alt="Walter Claudino" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-bg-dark">
                      <User className="w-40 h-40 text-white/5" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-10 -left-10 bg-primary text-bg-dark p-8 rounded-3xl shadow-2xl z-20 hidden md:block">
                  <GraduationCap className="w-12 h-12" />
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl lg:text-6xl font-black text-white mb-10 tracking-tighter">
                  {profile?.aboutHeadline?.split(" ").slice(0, -2).join(" ") || "Sobre"} <br/> 
                  <span className="text-primary">{profile?.aboutHeadline?.split(" ").slice(-2).join(" ") || "Walter Claudino"}</span>
                </h2>
                <div className="space-y-6 text-gray-200 text-xl leading-relaxed mb-12 font-medium whitespace-pre-wrap">
                  <p>
                    {profile?.bio || "Professor do Instituto Federal do Amazonas (IFAM) - Campus Manacapuru. Atuando como Chefe do DEPEX e liderando projetos de inovação tecnológica."}
                  </p>
                </div>
                
                <div className="flex gap-16 mb-12">
                  <div>
                    <h4 className="text-white font-black text-5xl mb-2 tracking-tighter">{stats.yearsOfExperience}+</h4>
                    <p className="text-primary text-xs font-black uppercase tracking-widest">Anos de Trajetória</p>
                  </div>
                  <div>
                    <h4 className="text-white font-black text-5xl mb-2 tracking-tighter">{stats.totalProjects}+</h4>
                    <p className="text-secondary text-xs font-black uppercase tracking-widest">Projetos Ativos</p>
                  </div>
                </div>

                <Link
                  href="/sobre"
                  className="group inline-flex items-center gap-3 text-white font-black uppercase text-sm tracking-[0.2em] border-b-2 border-primary pb-2 hover:text-primary hover:border-white transition-all"
                >
                  Biografia Completa <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
