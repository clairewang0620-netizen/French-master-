import React from 'react';
import { Link } from 'react-router-dom';
import { Book, MessageCircle, GraduationCap, BookOpen, Mic, PenTool, ChevronRight } from 'lucide-react';

const modules = [
  { to: '/vocab', title: '核心词汇', sub: 'A1-C1', icon: Book, color: 'bg-blue-50', textColor: 'text-blue-500' },
  { to: '/expressions', title: '场景会话', sub: '地道口语', icon: MessageCircle, color: 'bg-green-50', textColor: 'text-green-500' },
  { to: '/grammar', title: '语法解析', sub: '规则详解', icon: GraduationCap, color: 'bg-purple-50', textColor: 'text-purple-500' },
  { to: '/reading', title: '精选阅读', sub: '分级美文', icon: BookOpen, color: 'bg-orange-50', textColor: 'text-orange-500' },
  { to: '/dictation', title: '听力听写', sub: '磨耳练习', icon: Mic, color: 'bg-red-50', textColor: 'text-red-500' },
  { to: '/exam', title: '等级考试', sub: '实战评测', icon: PenTool, color: 'bg-indigo-50', textColor: 'text-indigo-500' },
];

export default function Home() {
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <header className="py-2">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Bonjour !</h2>
        <p className="text-xs text-slate-500 font-medium">开启今日法语学习之旅</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link 
              key={m.to} 
              to={m.to} 
              className="bg-white p-3.5 rounded-card border border-slate-100 shadow-soft hover:shadow-md transition-all flex flex-col gap-2 group"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
                <Icon size={18} className={m.textColor} />
              </div>
              
              <div>
                <h3 className="font-bold text-[13px] text-slate-800">{m.title}</h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{m.sub}</p>
              </div>

              <div className="flex justify-end mt-1">
                <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500 transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-brand-500 rounded-card p-4 text-white shadow-lg relative overflow-hidden mt-2">
        <div className="relative z-10">
          <h3 className="font-black text-base">每日进步</h3>
          <p className="text-[11px] text-white/90 font-medium mt-0.5">坚持每天练习，塑造地道发音</p>
          <button className="mt-3 bg-white text-brand-500 px-3 py-1.5 rounded-btn text-[10px] font-black shadow-sm active:scale-95 transition-transform">
            开始今日练习
          </button>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10">
          <PenTool size={100} />
        </div>
      </div>
    </div>
  );
}