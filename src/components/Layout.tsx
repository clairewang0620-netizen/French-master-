
import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Book, MessageCircle, GraduationCap, BookOpen, Mic, PenTool, Menu, X, Home, User } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/vocab', label: '核心词汇', icon: Book },
  { path: '/expressions', label: '场景会话', icon: MessageCircle },
  { path: '/grammar', label: '语法解析', icon: GraduationCap },
  { path: '/reading', label: '精选阅读', icon: BookOpen },
  { path: '/dictation', label: '听力听写', icon: Mic },
  { path: '/exam', label: '等级考试', icon: PenTool },
  { path: '/profile', label: '个人中心', icon: User },
];

export default function Layout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <h1 className="text-xl font-black text-brand-600 tracking-tight">FrenchMaster</h1>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={clsx(
        "fixed md:sticky md:top-0 h-screen w-72 bg-white border-r border-slate-200 z-40 transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 hidden md:block">
          <h1 className="text-2xl font-black text-brand-600 tracking-tighter">FrenchMaster</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mt-1">L'Art d'Apprendre</p>
        </div>

        <nav className="px-4 pb-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) => clsx(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-bold transition-all",
                  isActive 
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-100" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={22} strokeWidth={2.5} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 md:p-10 max-w-6xl mx-auto w-full">
         <Outlet />
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
