"use client";

import { useState, useEffect } from "react";
import { Mail, Trash2, CheckCircle, Clock, X, Loader2, User } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      toast.error("Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir esta mensagem?")) return;

    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        toast.success("Mensagem excluída");
        if (selectedMessage?.id === id) setSelectedMessage(null);
      }
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const markAsRead = async (id: string, read: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (res.ok) {
        setMessages(messages.map((m) => (m.id === id ? { ...m, read } : m)));
        if (selectedMessage?.id === id) setSelectedMessage({ ...selectedMessage, read });
      }
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  if (loading) return <div className="text-white">Carregando...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List */}
      <div className="lg:col-span-1 space-y-4">
        <h1 className="text-2xl font-bold text-white mb-6">Mensagens</h1>
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.read) markAsRead(msg.id, true);
              }}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedMessage?.id === msg.id 
                  ? "bg-primary/10 border-primary/50 shadow-glow" 
                  : "bg-bg-card border-white/5 hover:border-white/10"
              } ${!msg.read ? "border-l-4 border-l-primary" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold text-sm truncate">{msg.name}</span>
                <span className="text-[10px] text-gray-400 whitespace-nowrap">{format(new Date(msg.createdAt), "dd/MM")}</span>
              </div>
              <p className="text-gray-400 text-xs truncate mb-1">{msg.subject || "(Sem assunto)"}</p>
              <p className="text-gray-500 text-[10px] line-clamp-1">{msg.message}</p>
            </button>
          ))}
          {messages.length === 0 && (
            <div className="text-center py-10 text-gray-500">Nenhuma mensagem recebida.</div>
          )}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-2">
        {selectedMessage ? (
          <div className="bg-bg-card rounded-3xl border border-white/5 p-8 shadow-2xl animate-in fade-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-bg-dark p-4 rounded-2xl text-primary">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedMessage.name}</h2>
                  <p className="text-primary text-sm">{selectedMessage.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => markAsRead(selectedMessage.id, !selectedMessage.read)}
                  className={`p-3 rounded-xl transition-all ${selectedMessage.read ? "bg-green-500/10 text-green-400" : "bg-white/5 text-gray-400"}`}
                  title={selectedMessage.read ? "Marcar como não lida" : "Marcar como lida"}
                >
                  <CheckCircle className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="bg-red-500/10 p-3 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"
                  title="Excluir mensagem"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Assunto</p>
                <p className="text-white text-lg font-medium">{selectedMessage.subject || "(Sem assunto)"}</p>
              </div>
              
              <div className="bg-bg-dark p-6 rounded-2xl border border-white/5">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-4">Mensagem</p>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>Recebida em {format(new Date(selectedMessage.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full bg-bg-card/50 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 p-12">
            <Mail className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-xl">Selecione uma mensagem para visualizar</p>
          </div>
        )}
      </div>
    </div>
  );
}
