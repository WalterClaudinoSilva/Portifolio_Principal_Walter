"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Mail, MapPin, Linkedin, Github, Loader2, CheckCircle, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function ContatoPage() {
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSent(true);
        toast.success("Mensagem enviada com sucesso!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Erro ao enviar mensagem.");
      }
    } catch (error) {
      toast.error("Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

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
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter">Vamos <br/><span className="text-cyan-500">Conversar?</span></h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              Sinta-se à vontade para entrar em contato para parcerias acadêmicas, projetos tecnológicos ou palestras.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="bg-gradient-to-br from-[#1F3A5F]/20 to-transparent p-12 rounded-[48px] border border-white/5 shadow-2xl backdrop-blur-md">
                <h3 className="text-3xl font-black text-white mb-10 tracking-tight">Canais de Contato</h3>
                
                <div className="space-y-10">
                  <div className="flex items-start gap-6 group">
                    <div className="bg-cyan-500/10 p-5 rounded-[24px] text-cyan-400 group-hover:bg-cyan-500 group-hover:text-[#0A192F] transition-all duration-500 shadow-lg">
                      <Mail className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2">E-mail Profissional</p>
                      <p className="text-white font-bold text-xl break-all">{profile?.email || "walter.claudino@ifam.edu.br"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="bg-blue-500/10 p-5 rounded-[24px] text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-lg">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-2">Localização</p>
                      <p className="text-white font-bold text-xl">{profile?.location || "Manacapuru, AM — Brasil"}</p>
                      <p className="text-gray-400 font-medium mt-1">IFAM Campus Manacapuru</p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/5">
                  <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em] mb-6">Presença Digital</p>
                  <div className="flex gap-4">
                    {profile?.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-5 rounded-[24px] text-gray-400 hover:text-white hover:bg-[#0077b5] transition-all active:scale-95 shadow-xl">
                        <Linkedin className="w-7 h-7" />
                      </a>
                    )}
                    {profile?.github && (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="bg-white/5 p-5 rounded-[24px] text-gray-400 hover:text-white hover:bg-gray-800 transition-all active:scale-95 shadow-xl">
                        <Github className="w-7 h-7" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-[#1F3A5F]/20 to-transparent p-12 lg:p-16 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-md"
            >
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="py-12 text-center"
                  >
                    <div className="bg-green-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                      <CheckCircle className="text-green-500 w-14 h-14" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4 tracking-tighter">Mensagem Enviada!</h3>
                    <p className="text-gray-400 text-xl mb-10 font-medium">Obrigado pelo contato, Walter responderá em breve.</p>
                    <button 
                      onClick={() => setSent(false)}
                      className="text-cyan-400 font-black uppercase text-xs tracking-widest hover:text-white transition-colors"
                    >
                      Enviar outra mensagem
                    </button>
                  </motion.div>
                ) : (
                  <form key="form" onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Seu Nome</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#0A192F]/50 border border-white/10 rounded-[20px] py-5 px-8 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium placeholder:text-gray-700"
                          placeholder="Como posso te chamar?"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Seu Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#0A192F]/50 border border-white/10 rounded-[20px] py-5 px-8 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium placeholder:text-gray-700"
                          placeholder="email@exemplo.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Assunto</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#0A192F]/50 border border-white/10 rounded-[20px] py-5 px-8 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium placeholder:text-gray-700"
                        placeholder="Sobre o que vamos conversar?"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Sua Mensagem</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#0A192F]/50 border border-white/10 rounded-[20px] py-5 px-8 text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all font-medium h-48 resize-none placeholder:text-gray-700"
                        placeholder="Escreva sua mensagem detalhadamente..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="group w-full bg-cyan-500 hover:bg-cyan-400 text-[#0A192F] font-black py-6 rounded-[24px] shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95"
                    >
                      {sending ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : (
                        <>
                          Enviar Mensagem <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
