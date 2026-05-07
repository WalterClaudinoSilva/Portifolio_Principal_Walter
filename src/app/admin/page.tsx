"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Briefcase, 
  Code2, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Eye,
  Users
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

const data = [
  { name: "Jan", views: 400, messages: 24 },
  { name: "Fev", views: 300, messages: 13 },
  { name: "Mar", views: 200, messages: 98 },
  { name: "Abr", views: 278, messages: 39 },
  { name: "Mai", views: 189, messages: 48 },
  { name: "Jun", views: 239, messages: 38 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    technologies: 0,
    experiences: 0,
    messages: 0,
    views: 0,
    chartData: [] as { name: string, views: number, messages: number }[],
  });

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const cards = [
    { label: "Total de Projetos", value: stats.projects, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Tecnologias", value: stats.technologies, icon: Code2, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Experiências", value: stats.experiences, icon: FileText, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Visualizações", value: stats.views, icon: Eye, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Mensagens", value: stats.messages, icon: MessageSquare, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-bg-card p-6 rounded-2xl border border-white/5 shadow-xl transition-transform hover:scale-[1.02] shadow-glow-hover">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-xl`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Atualizado</span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{card.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-bg-card p-6 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">Visualizações do Site</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Eye className="w-4 h-4" />
              <span>Últimos 6 meses</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card-bg)", border: "1px solid #ffffff10", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area type="monotone" dataKey="views" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-bg-card p-6 rounded-2xl border border-white/5 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">Mensagens Recebidas</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Crescimento Mensal</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "var(--card-bg)", border: "1px solid #ffffff10", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                  cursor={{ fill: '#ffffff05' }}
                />
                <Bar dataKey="messages" fill="var(--secondary)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
