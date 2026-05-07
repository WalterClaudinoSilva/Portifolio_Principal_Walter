"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, Calendar, MapPin, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ExperienciaPage() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experiences")
      .then(res => res.json())
      .then(data => {
        setExperiences(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#0A192F] min-h-screen text-white selection:bg-cyan-500/30">
      <Navbar />
      
      <main className="pt-40 pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-24"
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Jornada <br/><span className="text-cyan-500">Profissional</span></h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              Uma trajetória dedicada à excelência acadêmica e ao desenvolvimento de soluções tecnológicas inovadoras no Amazonas.
            </p>
          </motion.div>

          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-cyan-500/30 before:to-transparent">
            {experiences.map((exp, index) => (
              <motion.div 
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              >
                {/* Dot */}
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-cyan-500/30 bg-[#0A192F] text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)] z-10 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-[#0A192F] transition-all duration-500">
                  <Briefcase className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-gradient-to-br from-[#1F3A5F]/20 to-transparent p-10 rounded-[40px] border border-white/5 shadow-2xl hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm">
                  <div className="flex flex-col mb-6">
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest mb-3 bg-cyan-400/10 w-fit px-4 py-1.5 rounded-full">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(exp.startDate), "MMM yyyy", { locale: ptBR })} — {exp.current ? "Presente" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy", { locale: ptBR }) : ""}
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{exp.position}</h3>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-300 font-bold mb-6">
                    <span className="flex items-center gap-2 text-blue-400">
                      <ChevronRight className="w-5 h-5" /> {exp.company}
                    </span>
                    {exp.location && (
                      <span className="text-gray-500 text-sm flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-lg">
                        <MapPin className="w-4 h-4" /> {exp.location}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-400 leading-relaxed font-medium text-lg">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {!loading && experiences.length === 0 && (
              <div className="text-center py-32 bg-[#1F3A5F]/10 rounded-[48px] border-2 border-dashed border-white/5">
                <Briefcase className="w-20 h-20 text-gray-700 mx-auto mb-6 opacity-20" />
                <p className="text-gray-500 text-2xl font-bold">Histórico profissional em atualização.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
