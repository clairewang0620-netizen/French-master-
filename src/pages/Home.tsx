import React from 'react';
import { Link } from 'react-router-dom';
import { Book, MessageCircle, GraduationCap, BookOpen, Mic, PenTool, ChevronRight } from 'lucide-react';

const modules = [
  { to: '/vocab', title: '核心词汇', sub: 'A1-C1 全覆盖', icon: Book, color: 'bg-blue-50', textColor: 'text-blue-500' },
  { to: '/expressions', title: '场景会话', sub: '地道日常口语', icon: MessageCircle, color: 'bg-emerald-50', textColor: 'text-emerald-500' },
  { to: '/grammar', title: '语法解析', sub: '系统规则详解', icon: GraduationCap, color: 'bg-purple-50', textColor: 'text-purple-500' },
  { to: '/reading', title: '精选阅读', sub: '分级美文伴读', icon: BookOpen, color: 'bg-orange-50', textColor: 'text-orange-500' },
  { to: '/dictation', title: '听力听写', sub: '磨耳朵强化练习', icon: Mic, color: 'bg-rose-50', textColor: 'text-rose-500' },
  { to: '/exam', title: '等级考试', sub: '法语实战评测', icon: PenTool, color: 'bg-indigo-50', textColor: 'text-indigo-500' },
];

export default function Home() {
  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Bonjour !</h2>
        <p className="text-sm text-slate-500 font-medium">轻松学法语 · 开启今日学习</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link 
              key={m.to} 
              to={m.to} 
              className="bg-white p-4 rounded-card border border-slate-100 shadow-soft hover:shadow-md transition-all flex flex-col gap-3 group"
            >
              <div className={[`w-10 h-10 rounded-xl flex items-center justify-center`, m.color].join(' ')}>
                <Icon className={`w-5 h-5 ${m.textColor}`} />
              </div>
              
              <div>
                <h3 className="font-bold text-sm text-slate-800">{m.title}</h3>
                <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{m.sub}</p>
              </div>

              <div className="flex justify-end">
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-500 group-hover:text-white transition-all">
                   <ChevronRight size={14} strokeWidth={3} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Progress placeholder card */}
      <div className="bg-brand-500 rounded-card p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="font-black text-lg">今日目标已达成 80%</h3>
          <p className="text-xs text-white/80 font-bold mt-1">再练习 10 个单词即可解锁勋章</p>
          <button className="mt-4 bg-white text-brand-500 px-4 py-2 rounded-btn text-xs font-black shadow-sm">
            继续学习
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-20">
          <PenTool size={100} />
        </div>
      </div>
    </div>
  );
}