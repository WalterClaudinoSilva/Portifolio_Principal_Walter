"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Award, Presentation, ExternalLink, Calendar, Microscope } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ProducaoPage() {
  const [productions, setProductions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/productions")
      .then(res => res.json())
      .then(data => {
        setProductions(data.filter((p: any) => p.published));
        setLoading(false);
      });
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "artigo": return <BookOpen className="w-8 h-8" />;
      case "curso": return <Award className="w-8 h-8" />;
      case "palestra": return <Presentation className="w-8 h-8" />;
      case "pesquisa": return <Microscope className="w-8 h-8" />;
      default: return <BookOpen className="w-8 h-8" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "artigo": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "curso": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "palestra": return "text-purple-400 bg-purple-400/10 border-purple-400/20";
      case "pesquisa": return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

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
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Produção <br/><span className="text-cyan-500">Acadêmica</span></h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed max-w-3xl mx-auto">
              Disseminação de conhecimento através de publicações científicas, mentorias e palestras especializadas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            {productions.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-[#1F3A5F]/20 to-transparent p-10 rounded-[48px] border border-white/5 flex flex-col md:flex-row gap-10 items-start hover:border-cyan-500/30 transition-all duration-500 group backdrop-blur-sm shadow-2xl"
              >
                <div className={`shrink-0 p-6 rounded-[32px] border ${getTypeColor(item.type)} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  {getTypeIcon(item.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-bold bg-white/5 px-4 py-1.5 rounded-full">
                      <Calendar className="w-4 h-4 text-cyan-500" />
                      <span>{format(new Date(item.date), "MMMM yyyy", { locale: ptBR })}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-6 group-hover:text-cyan-400 transition-colors tracking-tight leading-tight">{item.title}</h3>
                  
                  {item.description && (
                    <p className="text-gray-400 leading-relaxed mb-8 text-lg font-medium">
                      {item.description}
                    </p>
                  )}

                  {item.link && (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      className="inline-flex items-center gap-3 text-white font-black uppercase text-xs tracking-widest hover:text-cyan-400 transition-all group/link"
                    >
                      Ver Conteúdo Completo <ExternalLink className="w-5 h-5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}

            {!loading && productions.length === 0 && (
              <div className="text-center py-32 bg-[#1F3A5F]/10 rounded-[48px] border-2 border-dashed border-white/5">
                <BookOpen className="w-20 h-20 text-gray-700 mx-auto mb-6 opacity-20" />
                <p className="text-gray-500 text-2xl font-bold">Nenhuma produção cadastrada no momento.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
