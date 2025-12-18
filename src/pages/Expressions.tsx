
import React, { useState } from 'react';
import { expressionData } from '../data/mockData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, MessageSquare, MapPin, Coffee, User, Briefcase, Zap, ChevronRight, PlayCircle } from 'lucide-react';
import clsx from 'clsx';
import { speakFrench } from '../lib/tts';

const CATEGORY_CONFIG: Record<string, { icon: any; emoji: string; color: string; ringColor: string }> = {
  '自我介绍': { icon: User, emoji: '👋', color: 'bg-blue-100 text-blue-600', ringColor: 'ring-blue-100' },
  '日常生活': { icon: Coffee, emoji: '☕', color: 'bg-orange-100 text-orange-600', ringColor: 'ring-orange-100' },
  '餐厅': { icon: Briefcase, emoji: '🍽️', color: 'bg-green-100 text-green-600', ringColor: 'ring-green-100' },
  '交通': { icon: MapPin, emoji: '🚇', color: 'bg-purple-100 text-purple-600', ringColor: 'ring-purple-100' },
  '紧急情况': { icon: Zap, emoji: '🚑', color: 'bg-red-100 text-red-600', ringColor: 'ring-red-100' },
  '旅行': { icon: MapPin, emoji: '✈️', color: 'bg-sky-100 text-sky-600', ringColor: 'ring-sky-100' },
  '默认': { icon: MessageSquare, emoji: '💬', color: 'bg-slate-100 text-slate-600', ringColor: 'ring-slate-100' }
};

export default function Expressions() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);

  const categories = Array.from(new Set(expressionData.map(e => e.category)));

  const handlePlaySentence = async (text: string, id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveSentenceId(id);
    await speakFrench(text);
  };

  if (activeCategory) {
    const sentences = expressionData.filter(e => e.category === activeCategory);
    const config = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG['默认'];
    const progress = activeSentenceId ? sentences.findIndex(s => s.id === activeSentenceId) + 1 : 0;
    const progressPercent = Math.min((progress / sentences.length) * 100, 100);

    return (
      <div className="space-y-6 max-w-2xl mx-auto pb-10">
         <button onClick={() => setActiveCategory(null)} className="flex items-center text-slate-500 hover:text-brand-600 font-medium transition-colors mb-2">
          <ArrowLeft size={20} className="mr-2" /> 返回场景列表
        </button>

        {/* 修复：Sticky 头部，确保 z-index 正确 */}
        <header className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg sticky top-[72px] md:top-4 z-40 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl ${config.color} flex items-center justify-center text-2xl shadow-sm`}>
              {config.emoji}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">{activeCategory}</h1>
              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-500 mt-1">
                 <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{sentences.length} 句表达</span>
                 <span className="hidden sm:inline">· 点击句子即可听音</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }}></div> 
             </div>
             <span className="text-xs font-bold text-slate-400 whitespace-nowrap min-w-[3rem] text-right">
               {progress} / {sentences.length}
             </span>
          </div>
        </header>

        <div className="space-y-3 mt-4">
          {sentences.map((expr, idx) => {
            const isActive = activeSentenceId === expr.id;
            return (
              <div 
                key={expr.id} 
                onClick={() => handlePlaySentence(expr.fr, expr.id)}
                className={clsx(
                  "group p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden select-none",
                  isActive 
                    ? `bg-brand-50 border-brand-300 shadow-md ring-1 ring-brand-200`
                    : "bg-white border-slate-100 hover:border-brand-200 hover:shadow-sm"
                )}
              >
                <div className="flex gap-4 items-start relative z-10">
                  <div className={clsx(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mt-1",
                    isActive ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-brand-100 group-hover:text-brand-600"
                  )}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                     <h3 className={clsx("text-lg font-bold leading-snug", isActive ? "text-brand-700" : "text-slate-800")}>{expr.fr}</h3>
                     <p className="text-sm font-mono text-slate-400 bg-slate-50 px-1.5 rounded inline-block">{expr.ipa}</p>
                     <p className={clsx("text-base pt-1", isActive ? "text-slate-700" : "text-slate-500")}>{expr.cn}</p>
                  </div>
                  <div className={clsx(
                    "absolute right-0 top-0 p-5 transition-all transform",
                    isActive ? "opacity-100 scale-100 text-brand-500" : "opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 text-slate-300"
                  )}>
                    <PlayCircle size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">场景会话</h1>
        <p className="text-slate-600 mt-1">300句地道口语，覆盖核心生活场景</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat: string) => {
          const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['默认'];
          const count = expressionData.filter(e => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="group bg-white p-6 rounded-3xl border border-slate-100 hover:border-brand-300 hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col items-start relative overflow-hidden"
            >
              <div className={`w-14 h-14 rounded-2xl ${config.color} flex items-center justify-center mb-4 text-3xl shadow-sm z-10 group-hover:scale-110 transition-transform`}>
                {config.emoji}
              </div>
              <div className="z-10 w-full">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{cat}</h3>
                <div className="flex justify-between items-center w-full">
                  <p className="text-slate-400 text-sm font-medium">{count} 句表达</p>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <ChevronRight size={18} />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-slate-50 rounded-full opacity-50 group-hover:bg-brand-50 transition-colors z-0"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
