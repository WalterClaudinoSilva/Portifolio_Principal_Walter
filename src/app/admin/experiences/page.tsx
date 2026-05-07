"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Calendar, MapPin, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
}

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experiences");
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      toast.error("Erro ao carregar experiências");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta experiência?")) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExperiences(experiences.filter((e) => e.id !== id));
        toast.success("Experiência excluída");
      }
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = currentExp.id ? "PUT" : "POST";
      const url = currentExp.id ? `/api/experiences/${currentExp.id}` : "/api/experiences";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentExp),
      });

      if (res.ok) {
        toast.success(currentExp.id ? "Atualizada" : "Criada");
        setIsModalOpen(false);
        fetchExperiences();
      }
    } catch (error) {
      toast.error("Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Experiências</h1>
        <button
          onClick={() => {
            setCurrentExp({ current: false });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/80 text-bg-dark px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-glow"
        >
          <Plus className="w-5 h-5" />
          Nova Experiência
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-bg-card p-6 rounded-2xl border border-white/5 flex justify-between items-center group shadow-glow-hover">
            <div>
              <h3 className="text-white font-bold text-lg">{exp.position}</h3>
              <p className="text-primary font-medium">{exp.company}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(exp.startDate), "MM/yyyy")} - {exp.current ? "Presente" : exp.endDate ? format(new Date(exp.endDate), "MM/yyyy") : ""}</span>
                {exp.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {exp.location}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setCurrentExp(exp); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(exp.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">{currentExp.id ? "Editar Experiência" : "Nova Experiência"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Cargo</label>
                  <input
                    type="text"
                    value={currentExp.position || ""}
                    onChange={(e) => setCurrentExp({ ...currentExp, position: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Empresa / Instituição</label>
                  <input
                    type="text"
                    value={currentExp.company || ""}
                    onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={currentExp.startDate ? new Date(currentExp.startDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => setCurrentExp({ ...currentExp, startDate: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={currentExp.endDate ? new Date(currentExp.endDate).toISOString().split('T')[0] : ""}
                    onChange={(e) => setCurrentExp({ ...currentExp, endDate: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
                    disabled={currentExp.current}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentExp.current}
                  onChange={(e) => setCurrentExp({ ...currentExp, current: e.target.checked })}
                  className="w-5 h-5 rounded border-white/10 bg-bg-dark text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-300">Trabalho atual</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Localização</label>
                <input
                  type="text"
                  value={currentExp.location || ""}
                  onChange={(e) => setCurrentExp({ ...currentExp, location: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Ex: Manacapuru, AM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição das Atividades</label>
                <textarea
                  value={currentExp.description || ""}
                  onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none h-32"
                  required
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-xl text-gray-400 hover:text-white">Cancelar</button>
                <button type="submit" disabled={saving} className="bg-primary hover:bg-primary/80 text-bg-dark px-8 py-2 rounded-xl font-bold transition-all shadow-glow disabled:opacity-50">
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
