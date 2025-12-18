import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Book, MessageCircle, GraduationCap, BookOpen, Mic, PenTool, Menu, X, Home, User } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/vocab', label: 'Vocabulaire', icon: Book },
  { path: '/expressions', label: 'Expressions', icon: MessageCircle },
  { path: '/grammar', label: 'Grammaire', icon: GraduationCap },
  { path: '/reading', label: 'Lecture', icon: BookOpen },
  { path: '/dictation', label: 'Dictée', icon: Mic },
  { path: '/exam', label: 'Examen', icon: PenTool },
  { path: '/profile', label: 'Profil', icon: User },
];

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <h1 className="text-xl font-bold text-brand-600">Lumière French</h1>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={clsx(
        "fixed md:sticky md:top-0 h-[calc(100vh-60px)] md:h-screen w-64 bg-white border-r border-slate-200 z-10 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto",
        isSidebarOpen ? "translate-x-0 top-[60px]" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-bold text-brand-600">Lumière</h1>
          <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Apprendre le français</p>
        </div>

        <nav className="px-4 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive 
                    ? "bg-brand-50 text-brand-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={20} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
         <Outlet />
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-0 md:hidden top-[60px]"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
