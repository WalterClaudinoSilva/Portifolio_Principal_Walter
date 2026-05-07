"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Github, Check, X, Loader2, Briefcase, Upload, Camera } from "lucide-react";
import { toast } from "react-toastify";

interface Project {
  id: string;
  title: string;
  description: string;
  published: boolean;
  featured: boolean;
  image?: string;
  link?: string;
  github?: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error("Erro ao carregar projetos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    if (currentProject.image) {
      formData.append("oldUrl", currentProject.image);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setCurrentProject({ ...currentProject, image: data.url });
        toast.success("Imagem carregada!");
      } else {
        toast.error(data.error || "Erro no upload.");
      }
    } catch (error) {
      toast.error("Erro na conexão.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
        toast.success("Projeto excluído com sucesso");
      }
    } catch (error) {
      toast.error("Erro ao excluir projeto");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = currentProject.id ? "PUT" : "POST";
      const url = currentProject.id ? `/api/projects/${currentProject.id}` : "/api/projects";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentProject),
      });

      if (res.ok) {
        toast.success(currentProject.id ? "Projeto atualizado" : "Projeto criado");
        setIsModalOpen(false);
        fetchProjects();
      }
    } catch (error) {
      toast.error("Erro ao salvar projeto");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-white">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Projetos</h1>
        <button
          onClick={() => {
            setCurrentProject({ published: true, featured: false });
            setIsModalOpen(true);
          }}
          className="bg-primary hover:bg-primary/80 text-bg-dark px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-glow"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-bg-card rounded-2xl overflow-hidden border border-white/5 group shadow-glow-hover">
            {project.image ? (
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-bg-dark flex items-center justify-center">
                <Briefcase className="w-12 h-12 text-gray-700" />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-white font-bold text-lg">{project.title}</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setCurrentProject(project);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.description}</p>
              <div className="flex items-center gap-4">
                <span className={`text-xs px-2 py-1 rounded-full ${project.published ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {project.published ? "Publicado" : "Rascunho"}
                </span>
                {project.featured && (
                  <span className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-full">Destaque</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-bg-card z-10">
              <h2 className="text-xl font-bold text-white">{currentProject.id ? "Editar Projeto" : "Novo Projeto"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  value={currentProject.title || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Descrição Curta</label>
                <textarea
                  value={currentProject.description || ""}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none h-20"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capa do Projeto</label>
                  <div className="relative group">
                    <div className="w-full h-40 rounded-xl overflow-hidden bg-bg-dark border-2 border-dashed border-white/10 group-hover:border-primary/50 transition-all relative">
                      {currentProject.image ? (
                        <img src={currentProject.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                          <Upload className="w-8 h-8 mb-2" />
                          <span className="text-xs">Clique para fazer upload</span>
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload Imagem"
                      />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">A imagem será salva no servidor do site.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Link do Projeto</label>
                    <input
                      type="text"
                      value={currentProject.link || ""}
                      onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                      className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={currentProject.github || ""}
                      onChange={(e) => setCurrentProject({ ...currentProject, github: e.target.value })}
                      className="w-full bg-bg-dark border border-white/10 rounded-xl py-2 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProject.published}
                    onChange={(e) => setCurrentProject({ ...currentProject, published: e.target.checked })}
                    className="w-5 h-5 rounded border-white/10 bg-bg-dark text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-300">Publicado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentProject.featured}
                    onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-white/10 bg-bg-dark text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-300">Destaque na Home</span>
                </label>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary/80 text-bg-dark px-8 py-2 rounded-xl font-bold transition-all shadow-glow disabled:opacity-50"
                >
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
