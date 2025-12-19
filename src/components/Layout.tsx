import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Book, MessageCircle, GraduationCap, BookOpen, Mic, PenTool, Home, User } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Mobile-centric container: Max 420px on larger screens */}
      <div className="w-full max-w-[420px] bg-white min-h-screen shadow-xl flex flex-col relative pb-20">
        
        {/* Header - Compact */}
        <header className="px-4 py-3 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-lg">F</span>
            </div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight">FrenchMaster</h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Bottom Navigation - Solid background, mobile-first */}
        <nav className="fixed bottom-0 w-full max-w-[420px] bg-white border-t border-slate-100 px-2 py-1 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => clsx(
                  "flex flex-col items-center justify-center py-2 px-1 transition-all rounded-xl",
                  isActive 
                    ? "text-brand-500" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                {/* Use a function for children to properly access isActive state from NavLink */}
                {({ isActive }) => (
                  <>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
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