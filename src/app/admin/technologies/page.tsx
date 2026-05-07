"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Code2, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

interface Technology {
  id: string;
  name: string;
  category: string;
}

export default function AdminTechnologies() {
  const [techs, setTechs] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTech, setNewTech] = useState({ name: "", category: "Linguagem" });
  const [saving, setSaving] = useState(false);

  const fetchTechs = useCallback(async () => {
    try {
      const res = await fetch("/api/technologies");
      const data = await res.json();
      setTechs(data);
    } catch (error) {
      toast.error("Erro ao carregar tecnologias");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechs();
  }, [fetchTechs]);

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta tecnologia?")) return;

    try {
      const res = await fetch(`/api/technologies/${id}`, { method: "DELETE" });
      if (res.ok) {
        setTechs(techs.filter((t) => t.id !== id));
        toast.success("Tecnologia excluída");
      }
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/technologies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTech),
      });

      if (res.ok) {
        toast.success("Tecnologia adicionada");
        setIsModalOpen(false);
        setNewTech({ name: "", category: "Linguagem" });
        fetchTechs();
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
        <h1 className="text-2xl font-bold text-white">Gerenciar Tecnologias</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/80 text-bg-dark px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-glow"
        >
          <Plus className="w-5 h-5" />
          Nova Tecnologia
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {techs.map((tech) => (
          <div key={tech.id} className="bg-bg-card p-4 rounded-xl border border-white/5 flex justify-between items-center group shadow-glow-hover">
            <div className="flex items-center gap-3">
              <div className="bg-bg-dark p-2 rounded-lg">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-medium">{tech.name}</p>
                <p className="text-xs text-gray-400">{tech.category}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(tech.id)}
              className="p-2 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card w-full max-w-md rounded-2xl border border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-bg-card z-10">
              <h2 className="text-xl font-bold text-white">Nova Tecnologia</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
                <input
                  type="text"
                  value={newTech.name}
                  onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Categoria</label>
                <select
                  value={newTech.category}
                  onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Linguagem">Linguagem</option>
                  <option value="Framework">Framework</option>
                  <option value="Banco de Dados">Banco de Dados</option>
                  <option value="IA / ML">IA / ML</option>
                  <option value="IoT">IoT</option>
                  <option value="Ferramenta">Ferramenta</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/80 text-bg-dark px-8 py-2 rounded-xl font-bold transition-all shadow-glow disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Adicionar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
