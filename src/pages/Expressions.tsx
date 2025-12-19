import React, { useState } from 'react';
import { expressionData } from '../data/mockData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, Coffee, User, Briefcase, Zap, ChevronRight, MapPin } from 'lucide-react';
import clsx from 'clsx';

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string }> = {
  '自我介绍': { emoji: '👋', color: 'bg-blue-50 text-blue-500' },
  '日常生活': { emoji: '☕', color: 'bg-orange-50 text-orange-500' },
  '餐厅': { emoji: '🍽️', color: 'bg-green-50 text-green-500' },
  '交通': { emoji: '🚇', color: 'bg-purple-50 text-purple-500' },
  '紧急情况': { emoji: '🚑', color: 'bg-red-50 text-red-500' },
  '旅行': { emoji: '✈️', color: 'bg-sky-50 text-sky-500' },
  '默认': { emoji: '💬', color: 'bg-slate-50 text-slate-500' }
};

export default function Expressions() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(expressionData.map(e => e.category)));

  if (activeCategory) {
    const sentences = expressionData.filter(e => e.category === activeCategory);
    return (
      <div className="space-y-3 animate-in slide-in-from-right-4">
        <header className="flex items-center gap-3">
          <button onClick={() => setActiveCategory(null)} className="p-1.5 bg-slate-50 rounded-full text-slate-400 active:scale-90">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-base font-black text-slate-900">{activeCategory}</h1>
        </header>

        <div className="space-y-2.5">
          {sentences.map((expr) => (
            <div key={expr.id} className="p-3.5 rounded-card border border-slate-50 bg-white shadow-soft space-y-3">
              <div className="space-y-0.5">
                 <h3 className="text-[15px] font-black text-slate-800 leading-snug">{expr.fr}</h3>
                 <p className="text-[10px] font-mono text-slate-400 font-bold italic tracking-tighter">{expr.ipa}</p>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-slate-50 pt-2.5">
                <p className="text-[13px] text-slate-500 font-medium">{expr.cn}</p>
                <TTSButton text={expr.fr} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-0.5">
        <h1 className="text-lg font-black text-slate-900">场景常用语</h1>
        <p className="text-[11px] text-slate-400 font-medium tracking-wide">地道口语 · 全场景覆盖</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['默认'];
          const count = expressionData.filter(e => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="bg-white p-4 rounded-card border border-slate-50 shadow-soft flex flex-col items-center text-center gap-2 active:scale-95 transition-all"
            >
              <div className={clsx("w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-inner", config.color)}>
                {config.emoji}
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 leading-tight">{cat}</h3>
                <p className="text-[9px] text-slate-400 font-bold mt-1 tracking-tight">{count} 常用语</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}