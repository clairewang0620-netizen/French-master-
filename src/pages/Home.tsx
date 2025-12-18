import React from 'react';
import { Link } from 'react-router-dom';
import { Book, MessageCircle, GraduationCap, BookOpen, Mic, PenTool, ArrowRight } from 'lucide-react';

const modules = [
  { to: '/vocab', title: '单词', sub: '核心词汇 (A1-C1)', icon: Book, color: 'bg-blue-500', textColor: 'text-blue-500' },
  { to: '/expressions', title: '场景会话', sub: '300 句地道口语', icon: MessageCircle, color: 'bg-green-500', textColor: 'text-green-500' },
  { to: '/grammar', title: '基础语法', sub: '规则与例句解析', icon: GraduationCap, color: 'bg-purple-500', textColor: 'text-purple-500' },
  { to: '/reading', title: '精选阅读', sub: '分级文章 + 朗读', icon: BookOpen, color: 'bg-orange-500', textColor: 'text-orange-500' },
  { to: '/dictation', title: '听写', sub: '磨耳朵练拼写', icon: Mic, color: 'bg-red-500', textColor: 'text-red-500' },
  { to: '/exam', title: '等级考试', sub: '阶段性自我检测', icon: PenTool, color: 'bg-indigo-500', textColor: 'text-indigo-500' },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Lumière French 🇫🇷</h1>
        <p className="text-slate-500 mt-2 text-lg">系统化法语知识付费课程</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link 
              key={m.to} 
              to={m.to} 
              className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-brand-200 transition-all hover:-translate-y-1 flex flex-col h-48 justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={80} className={m.textColor} />
              </div>
              
              <div className="flex items-center justify-between z-10">
                <div className={`p-3 rounded-xl ${m.color} bg-opacity-10`}>
                  <Icon className={`w-8 h-8 ${m.textColor}`} />
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-brand-500 transition-colors" />
              </div>
              
              <div className="z-10">
                <h3 className="font-bold text-xl text-slate-800 mb-1">{m.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{m.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}