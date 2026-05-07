"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Calendar, Link as LinkIcon, X, Loader2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

interface Production {
  id: string;
  title: string;
  type: string;
  description?: string;
  link?: string;
  date: string;
  published: boolean;
}

export default function AdminProductions() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProd, setCurrentProd] = useState<Partial<Production>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProductions();
  }, []);

  const fetchProductions = async () => {
    try {
      const res = await fetch("/api/productions");
      const data = await res.json();
      setProductions(data);
    } catch (error) {
      toast.error("Erro ao carregar produções");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta produção?")) return;

    try {
      const res = await fetch(`/api/productions/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProductions(productions.filter((p) => p.id !== id));
        toast.success("Produção excluída");
      }
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = currentProd.id ? "PUT" : "POST";
      const url = currentProd.id ? `/api/productions/${currentProd.id}` : "/api/productions";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProd),
      });

      if (res.ok) {
        toast.success(currentProd.id ? "Atualizada" : "Criada");
        setIsModalOpen(false);
        fetchProductions();
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
        <h1 className="text-2xl font-bold text-white">Gerenciar Produções</h1>
        <button
          onClick={() => {
            setCurrentProd({ published: true, type: "Artigo" });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/80 text-bg-dark px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-glow"
        >
          <Plus className="w-5 h-5" />
          Nova Produção
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {productions.map((prod) => (
          <div key={prod.id} className="bg-bg-card p-6 rounded-2xl border border-white/5 flex justify-between items-center group shadow-glow-hover">
            <div className="flex items-center gap-4">
              <div className="bg-bg-dark p-3 rounded-xl text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{prod.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="text-primary font-bold uppercase tracking-widest">{prod.type}</span>
                  <span className="text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {format(new Date(prod.date), "MM/yyyy")}</span>
                  <span className={`px-2 py-0.5 rounded-full ${prod.published ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {prod.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setCurrentProd(prod); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(prod.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-bg-card z-10">
              <h2 className="text-xl font-bold text-white">{currentProd.id ? "Editar Produção" : "Nova Produção"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  value={currentProd.title || ""}
                  onChange={(e) => setCurrentProd({ ...currentProd, title: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
                  <select
                    value={currentProd.type || "Artigo"}
                    onChange={(e) => setCurrentProd({ ...currentProd, type: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Artigo">Artigo</option>
                    <option value="Curso">Curso</option>
                    <option value="Palestra">Palestra</option>
                    <option value="Pesquisa">Pesquisa</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Data</label>
                  <input
                    type="date"
                    value={currentProd.date ? new Date(currentProd.date).toISOString().split('T')[0] : ""}
                    onChange={(e) => setCurrentProd({ ...currentProd, date: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Link (URL)</label>
                <input
                  type="text"
                  value={currentProd.link || ""}
                  onChange={(e) => setCurrentProd({ ...currentProd, link: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
                <textarea
                  value={currentProd.description || ""}
                  onChange={(e) => setCurrentProd({ ...currentProd, description: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none h-24"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentProd.published}
                  onChange={(e) => setCurrentProd({ ...currentProd, published: e.target.checked })}
                  className="w-5 h-5 rounded border-white/10 bg-bg-dark text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-300">Publicar no site</span>
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
