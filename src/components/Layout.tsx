import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Book, MessageCircle, BookOpen, PenTool, Home, User } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/vocab', label: '词汇', icon: Book },
  { path: '/expressions', label: '会话', icon: MessageCircle },
  { path: '/reading', label: '阅读', icon: BookOpen },
  { path: '/exam', label: '测试', icon: PenTool },
  { path: '/profile', label: '我的', icon: User },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center font-sans antialiased text-slate-800">
      {/* Mobile-centric container: Max 420px */}
      <div className="w-full max-w-[420px] bg-white min-h-screen shadow-2xl flex flex-col relative pb-[70px]">
        
        {/* Header - Compact & Solid */}
        <header className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">L</span>
            </div>
            <h1 className="text-base font-black text-slate-900 tracking-tight">Lumière French</h1>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Bottom Navigation - Solid background, thumb-friendly */}
        <nav className="fixed bottom-0 w-full max-w-[420px] bg-white border-t border-slate-100 px-1 py-1 flex justify-around items-center z-50 shadow-[0_-2px_8px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => clsx(
                  "flex flex-col items-center justify-center flex-1 py-2 transition-all",
                  isActive ? "text-brand-500" : "text-slate-400"
                )}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-bold mt-1">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}