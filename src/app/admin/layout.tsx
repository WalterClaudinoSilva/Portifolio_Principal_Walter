"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Briefcase, 
  Code2, 
  FileText, 
  User, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Globe,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Briefcase, label: "Projetos", href: "/admin/projects" },
  { icon: FileText, label: "Experiências", href: "/admin/experiences" },
  { icon: Code2, label: "Produções", href: "/admin/productions" },
  { icon: Settings, label: "Tecnologias", href: "/admin/technologies" },
  { icon: User, label: "Perfil", href: "/admin/profile" },
  { icon: MessageSquare, label: "Mensagens", href: "/admin/messages" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [status, router, isLoginPage]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  if (!session) return null;

  return (
    <div className="min-h-screen bg-bg-dark flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-bg-card border-r border-white/10 transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}
      >
        <div className="p-6 flex items-center justify-between">
          {sidebarOpen && <span className="text-white font-bold text-xl">Walter Admin</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 mx-auto" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-primary text-bg-dark shadow-glow" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Globe className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Ver Site</span>}
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <header className="h-16 border-b border-white/10 bg-bg-dark/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-white font-semibold">
            {menuItems.find(i => i.href === pathname)?.label || "Painel"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{session.user.name}</p>
              <p className="text-xs text-gray-400">{session.user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-bg-dark font-bold shadow-glow">
              {session.user.name?.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
