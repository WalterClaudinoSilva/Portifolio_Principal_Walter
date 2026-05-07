"use client";

import { useState, useEffect, useRef } from "react";
import { Save, Loader2, User, Mail, MapPin, Linkedin, Github, FileText, Phone, Upload, Camera, Calendar, Sparkles, Trash2, Plus, Settings2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    image: "",
    resumeUrl: "",
    theme: "default",
    autoThemeEnabled: false,
    heroBadge: "",
    heroTitle: "",
    aboutHeadline: "",
    aboutHistoryHeadline: "",
    projectsHeadline: "",
    projectsSubheadline: "",
    specialty1Title: "",
    specialty1Desc: "",
    specialty2Title: "",
    specialty2Desc: "",
    specialty3Title: "",
    specialty3Desc: "",
    expertiseHeadline: "",
    expertise1Title: "",
    expertise1Desc: "",
    expertise2Title: "",
    expertise2Desc: "",
    visionHeadline: "",
    visionTitle: "",
    visionDesc: "",
    footerCopyright: "",
  });

  const themes = [
    { id: "default", name: "Deep Ocean (Padrão)", colors: ["#0A192F", "#06b6d4"] },
    { id: "emerald", name: "Esmeralda", colors: ["#061f1a", "#10b981"] },
    { id: "midnight", name: "Meia-Noite", colors: ["#000000", "#6366f1"] },
    { id: "sunset", name: "Pôr do Sol", colors: ["#1a0f0f", "#f97316"] },
    { id: "cyberpunk", name: "Cyberpunk", colors: ["#0f0524", "#ff00ff"] },
    { id: "forest", name: "Floresta", colors: ["#0d1a0d", "#22c55e"] },
    { id: "slate", name: "Ardósia", colors: ["#0f172a", "#94a3b8"] },
    { id: "volcano", name: "Vulcão", colors: ["#1c0a00", "#ea580c"] },
    { id: "nebula", name: "Nebulosa", colors: ["#0b0118", "#8b5cf6"] },
    { id: "gold", name: "Ouro", colors: ["#1a1600", "#eab308"] },
  ];

  const holidayThemes = [
    { id: "default", name: "Padrão" },
    { id: "emerald", name: "Esmeralda" },
    { id: "midnight", name: "Meia-Noite" },
    { id: "sunset", name: "Pôr do Sol" },
    { id: "cyberpunk", name: "Cyberpunk" },
    { id: "forest", name: "Floresta" },
    { id: "slate", name: "Ardósia" },
    { id: "volcano", name: "Vulcão" },
    { id: "nebula", name: "Nebulosa" },
    { id: "gold", name: "Ouro" },
    { id: "newyear", name: "Ano Novo" },
    { id: "carnival", name: "Carnaval" },
    { id: "easter", name: "Páscoa" },
    { id: "halloween", name: "Halloween" },
    { id: "christmas", name: "Natal" },
  ];

  const [eventThemes, setEventThemes] = useState<any[]>([]);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>({
    name: "",
    themeId: "default",
    day: 1,
    month: 1,
    activeDaysBefore: 7,
    activeDaysAfter: 3,
    priority: 1,
    enabled: true,
    message: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
    fetchEventThemes();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data) setProfile(data);
    } catch (error) {
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventThemes = async () => {
    try {
      const res = await fetch("/api/admin/event-themes");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setEventThemes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar temas de eventos", error);
    }
  };

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
    if (profile.image) {
      formData.append("oldUrl", profile.image);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfile({ ...profile, image: data.url });
        toast.success("Imagem carregada com sucesso!");
      } else {
        toast.error(data.error || "Erro ao fazer upload.");
      }
    } catch (error) {
      toast.error("Erro na conexão com o servidor.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast.success("Perfil atualizado com sucesso");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      toast.error("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentEvent.id ? "PUT" : "POST";
    const url = currentEvent.id ? `/api/admin/event-themes/${currentEvent.id}` : "/api/admin/event-themes";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentEvent),
      });

      if (res.ok) {
        toast.success("Configuração de evento salva!");
        setIsEventModalOpen(false);
        fetchEventThemes();
      }
    } catch (error) {
      toast.error("Erro ao salvar evento");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Excluir esta configuração de evento?")) return;
    try {
      const res = await fetch(`/api/admin/event-themes/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Evento removido");
        fetchEventThemes();
      }
    } catch (error) {
      toast.error("Erro ao deletar evento");
    }
  };

  if (loading) return <div className="text-white">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Editar Perfil Profissional</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-bg-card p-8 rounded-2xl border border-white/5 shadow-xl space-y-8">
          {/* Seção de Foto */}
          <div className="flex flex-col items-center gap-6 pb-6 border-b border-white/10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-bg-dark border-2 border-primary/50 relative">
                {profile.image ? (
                  <img src={profile.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-700" />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-bg-dark shadow-lg hover:opacity-90 transition-all"
                title="Trocar Foto"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="text-center">
              <h3 className="text-white font-medium">Foto de Perfil</h3>
              <p className="text-xs text-gray-400 mt-1">Clique no ícone para fazer upload de uma imagem do seu computador</p>
            </div>
          </div>

          {/* Seção de Temas */}
          <div className="pt-8 border-t border-white/10 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" /> Aparência do Site
              </h3>
              <div className="flex items-center gap-3 bg-bg-dark p-2 rounded-xl border border-white/5">
                <span className="text-xs font-bold text-gray-400 uppercase">Tema Automático</span>
                <button
                  type="button"
                  onClick={() => setProfile({ ...profile, autoThemeEnabled: !profile.autoThemeEnabled })}
                  className={`w-12 h-6 rounded-full transition-all relative ${profile.autoThemeEnabled ? "bg-primary" : "bg-gray-700"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${profile.autoThemeEnabled ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-400">Escolha o tema manual padrão do site:</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setProfile({ ...profile, theme: t.id });
                      document.documentElement.setAttribute("data-theme", t.id);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                      profile.theme === t.id ? "border-primary bg-primary/10 shadow-glow" : "border-white/5 bg-bg-dark hover:border-white/20"
                    }`}
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors[0] }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.colors[1] }} />
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase text-center">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {profile.autoThemeEnabled && (
              <div className="mt-8 p-6 bg-primary/5 border border-primary/10 rounded-3xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-white font-bold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" /> Eventos Sazonais
                    </h4>
                    <p className="text-xs text-gray-400">Configure temas que ativam automaticamente em datas específicas</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentEvent({ name: "", themeId: "default", day: 1, month: 1, activeDaysBefore: 7, activeDaysAfter: 3, priority: 1, enabled: true });
                      setIsEventModalOpen(true);
                    }}
                    className="bg-primary/20 text-primary hover:bg-primary hover:text-bg-dark p-2 rounded-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {eventThemes.map((event) => (
                    <div key={event.id} className="bg-bg-dark/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-xl text-primary">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold">{event.name}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-black">{event.themeId}</span>
                          </div>
                          <p className="text-xs text-gray-400">
                            Data: {event.day}/{event.month} | Ativo {event.activeDaysBefore} dias antes até {event.activeDaysAfter} dias depois
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          type="button"
                          onClick={() => { setCurrentEvent(event); setIsEventModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-white"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {eventThemes.length === 0 && (
                    <p className="text-center py-6 text-gray-500 text-sm italic">Nenhum evento configurado ainda.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4" /> Nome Completo
              </label>
              <input
                type="text"
                value={profile.name || ""}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Cargo / Título
              </label>
              <input
                type="text"
                value={profile.title || ""}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Bio / Resumo Profissional</label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all h-32"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email de Contato
              </label>
              <input
                type="email"
                value={profile.email || ""}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Telefone
              </label>
              <input
                type="text"
                value={profile.phone || ""}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Localização
              </label>
              <input
                type="text"
                value={profile.location || ""}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn (URL)
              </label>
              <input
                type="text"
                value={profile.linkedin || ""}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub (URL)
              </label>
              <input
                type="text"
                value={profile.github || ""}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Conteúdo das Páginas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Hero: Selo superior (Badge)</label>
                <input
                  type="text"
                  value={profile.heroBadge || ""}
                  onChange={(e) => setProfile({ ...profile, heroBadge: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Hero: Título Principal</label>
                <textarea
                  value={profile.heroTitle || ""}
                  onChange={(e) => setProfile({ ...profile, heroTitle: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all h-24"
                  placeholder="Use quebras de linha para separar em 3 linhas..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Sobre: Título da Seção</label>
                <input
                  type="text"
                  value={profile.aboutHeadline || ""}
                  onChange={(e) => setProfile({ ...profile, aboutHeadline: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Sobre: Título "Minha História"</label>
                <input
                  type="text"
                  value={profile.aboutHistoryHeadline || ""}
                  onChange={(e) => setProfile({ ...profile, aboutHistoryHeadline: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Sobre: Título "Expertise"</label>
                <input
                  type="text"
                  value={profile.expertiseHeadline || ""}
                  onChange={(e) => setProfile({ ...profile, expertiseHeadline: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Sobre: Título "Visão"</label>
                <input
                  type="text"
                  value={profile.visionHeadline || ""}
                  onChange={(e) => setProfile({ ...profile, visionHeadline: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Projetos: Título da Seção</label>
                <input
                  type="text"
                  value={profile.projectsHeadline || ""}
                  onChange={(e) => setProfile({ ...profile, projectsHeadline: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 italic">Footer: Copyright</label>
                <input
                  type="text"
                  value={profile.footerCopyright || ""}
                  onChange={(e) => setProfile({ ...profile, footerCopyright: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-300 italic">Projetos: Subtítulo da Seção</label>
                <input
                  type="text"
                  value={profile.projectsSubheadline || ""}
                  onChange={(e) => setProfile({ ...profile, projectsSubheadline: e.target.value })}
                  className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Especialidades (Home)</h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Especialidade 1: Título</label>
                  <input
                    type="text"
                    value={profile.specialty1Title || ""}
                    onChange={(e) => setProfile({ ...profile, specialty1Title: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Especialidade 1: Descrição</label>
                  <input
                    type="text"
                    value={profile.specialty1Desc || ""}
                    onChange={(e) => setProfile({ ...profile, specialty1Desc: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Especialidade 2: Título</label>
                  <input
                    type="text"
                    value={profile.specialty2Title || ""}
                    onChange={(e) => setProfile({ ...profile, specialty2Title: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Especialidade 2: Descrição</label>
                  <input
                    type="text"
                    value={profile.specialty2Desc || ""}
                    onChange={(e) => setProfile({ ...profile, specialty2Desc: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Especialidade 3: Título</label>
                  <input
                    type="text"
                    value={profile.specialty3Title || ""}
                    onChange={(e) => setProfile({ ...profile, specialty3Title: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Especialidade 3: Descrição</label>
                  <input
                    type="text"
                    value={profile.specialty3Desc || ""}
                    onChange={(e) => setProfile({ ...profile, specialty3Desc: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">Expertise & Visão (Sobre)</h3>
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Expertise 1: Título</label>
                  <input
                    type="text"
                    value={profile.expertise1Title || ""}
                    onChange={(e) => setProfile({ ...profile, expertise1Title: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Expertise 1: Descrição</label>
                  <input
                    type="text"
                    value={profile.expertise1Desc || ""}
                    onChange={(e) => setProfile({ ...profile, expertise1Desc: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Expertise 2: Título</label>
                  <input
                    type="text"
                    value={profile.expertise2Title || ""}
                    onChange={(e) => setProfile({ ...profile, expertise2Title: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Expertise 2: Descrição</label>
                  <input
                    type="text"
                    value={profile.expertise2Desc || ""}
                    onChange={(e) => setProfile({ ...profile, expertise2Desc: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Visão: Título do Card</label>
                  <input
                    type="text"
                    value={profile.visionTitle || ""}
                    onChange={(e) => setProfile({ ...profile, visionTitle: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 italic">Visão: Texto da Visão</label>
                  <textarea
                    value={profile.visionDesc || ""}
                    onChange={(e) => setProfile({ ...profile, visionDesc: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none transition-all h-24"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary hover:bg-primary/80 text-bg-dark px-8 py-3 rounded-xl font-bold transition-all shadow-glow disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Salvar Alterações
            </button>
          </div>
        </div>
      </form>

      {/* Modal de Evento */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-bg-card w-full max-w-md rounded-[32px] border border-white/10 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/10 bg-bg-dark/50">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" /> Configurar Evento
              </h3>
            </div>
            <form onSubmit={handleSaveEvent} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Nome do Evento</label>
                  <input
                    type="text"
                    value={currentEvent.name}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, name: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Ex: Natal, Ano Novo..."
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Mensagem Especial (Opcional)</label>
                  <textarea
                    value={currentEvent.message || ""}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, message: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none h-20"
                    placeholder="Ex: Feliz Natal para todos os nossos clientes!"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Dia (1-31)</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={currentEvent.day ?? ""}
                      onChange={(e) => setCurrentEvent({ ...currentEvent, day: e.target.value === "" ? "" : parseInt(e.target.value) })}
                      className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Mês (1-12)</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={currentEvent.month ?? ""}
                      onChange={(e) => setCurrentEvent({ ...currentEvent, month: e.target.value === "" ? "" : parseInt(e.target.value) })}
                      className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Tema a Aplicar</label>
                  <select
                    value={currentEvent.themeId}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, themeId: e.target.value })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  >
                    {holidayThemes.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Dias Antes</label>
                    <input
                      type="number"
                      value={currentEvent.activeDaysBefore ?? ""}
                      onChange={(e) => setCurrentEvent({ ...currentEvent, activeDaysBefore: e.target.value === "" ? "" : parseInt(e.target.value) })}
                      className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Dias Depois</label>
                    <input
                      type="number"
                      value={currentEvent.activeDaysAfter ?? ""}
                      onChange={(e) => setCurrentEvent({ ...currentEvent, activeDaysAfter: e.target.value === "" ? "" : parseInt(e.target.value) })}
                      className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Prioridade (Maior = Preferencial)</label>
                  <input
                    type="number"
                    value={currentEvent.priority ?? ""}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, priority: e.target.value === "" ? "" : parseInt(e.target.value) })}
                    className="w-full bg-bg-dark border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-all font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-bg-dark px-6 py-3 rounded-xl font-black shadow-glow hover:opacity-90 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
