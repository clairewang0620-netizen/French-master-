
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, MessageCircle, GraduationCap, BookOpen, Mic, PenTool, ArrowRight } from 'lucide-react';

const modules = [
  { to: '/vocab', title: '核心词汇', sub: '从 A1 到 C1 全覆盖', icon: Book, color: 'bg-blue-500', textColor: 'text-blue-500' },
  { to: '/expressions', title: '场景会话', sub: '300 句地道日常口语', icon: MessageCircle, color: 'bg-green-500', textColor: 'text-green-500' },
  { to: '/grammar', title: '语法解析', sub: '系统化规则与实战例句', icon: GraduationCap, color: 'bg-purple-500', textColor: 'text-purple-500' },
  { to: '/reading', title: '精选阅读', sub: '分级文章沉浸式朗读', icon: BookOpen, color: 'bg-orange-500', textColor: 'text-orange-500' },
  { to: '/dictation', title: '听力听写', sub: '磨耳朵拼写强化练习', icon: Mic, color: 'bg-red-500', textColor: 'text-red-500' },
  { to: '/exam', title: '等级考试', sub: '全方位法语实战评测', icon: PenTool, color: 'bg-indigo-500', textColor: 'text-indigo-500' },
];

export default function Home() {
  return (
    <div className="space-y-12 pb-10">
      <header className="text-center md:text-left space-y-2">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">FrenchMaster</h1>
        <p className="text-2xl text-slate-500 font-medium">轻松学法语</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link 
              key={m.to} 
              to={m.to} 
              className="group bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-2xl hover:border-brand-200 transition-all hover:-translate-y-2 flex flex-col h-60 justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} className={m.textColor} />
              </div>
              
              <div className="flex items-center justify-between z-10">
                <div className={`p-4 rounded-2xl ${m.color} bg-opacity-10 shadow-inner`}>
                  <Icon className={`w-8 h-8 ${m.textColor}`} />
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                   <ArrowRight size={20} />
                </div>
              </div>
              
              <div className="z-10">
                <h3 className="font-black text-2xl text-slate-800 mb-2">{m.title}</h3>
                <p className="text-slate-500 font-bold text-sm">{m.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
