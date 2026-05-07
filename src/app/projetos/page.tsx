"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Github, ExternalLink, Code2, Search, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjetosPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Todos");

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => {
        const published = data.filter((p: any) => p.published);
        setProjects(published);
        setFilteredProjects(published);
        setLoading(false);
      });
  }, []);

  const handleFilter = (tech: string) => {
    setActiveFilter(tech);
    if (tech === "Todos") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => 
        p.technologies.some((t: any) => t.technology.name === tech)
      ));
    }
  };

  // Extrair tecnologias únicas
  const allTechs = Array.from(new Set(
    projects.flatMap(p => p.technologies.map((t: any) => t.technology.name))
  )).sort() as string[];

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
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Portfólio de <br/><span className="text-cyan-500">Projetos</span></h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              Exploração técnica e científica em IA, Visão Computacional e IoT aplicada a problemas do mundo real.
            </p>
          </motion.div>

          {/* Filters */}
          {!loading && projects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3 mb-16"
            >
              <button
                onClick={() => handleFilter("Todos")}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeFilter === "Todos" ? "bg-cyan-500 text-[#0A192F] shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
              >
                Todos
              </button>
              {allTechs.map(tech => (
                <button
                  key={tech}
                  onClick={() => handleFilter(tech)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeFilter === tech ? "bg-cyan-500 text-[#0A192F] shadow-[0_0_20px_rgba(6,182,212,0.4)]" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  {tech}
                </button>
              ))}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div 
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-[#1F3A5F]/10 rounded-[40px] overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all duration-500 flex flex-col backdrop-blur-sm"
                >
                  <div className="h-64 bg-[#0A192F] relative overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1F3A5F] to-[#0A192F]">
                        <Briefcase className="w-16 h-16 text-white/5" />
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-6 right-6 bg-cyan-500 text-[#0A192F] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-xl">
                        Destaque
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] to-transparent opacity-60" />
                  </div>
                  
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors tracking-tight">{project.title}</h3>
                      <p className="text-gray-400 font-medium mb-8 line-clamp-4 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((t: any) => (
                          <span key={t.technology.id} className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-lg border border-cyan-400/20 uppercase tracking-wider">
                            {t.technology.name}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex gap-6 pt-6 border-t border-white/5">
                        {project.github && (
                          <a href={project.github} target="_blank" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                            <Github className="w-4 h-4" /> Código
                          </a>
                        )}
                        {project.link && (
                          <a href={project.link} target="_blank" className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                            <ExternalLink className="w-4 h-4" /> Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!loading && filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-[#1F3A5F]/10 rounded-[48px] border-2 border-dashed border-white/5"
            >
              <Code2 className="w-20 h-20 text-gray-700 mx-auto mb-6 opacity-20" />
              <p className="text-gray-500 text-2xl font-bold">Nenhum projeto encontrado nesta categoria.</p>
            </motion.div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[500px] bg-white/5 rounded-[40px] animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
