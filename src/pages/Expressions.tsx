import React, { useState } from 'react';
import { expressionData } from '../data/mockData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

export default function Expressions() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(expressionData.map(e => e.category)));

  if (activeCategory) {
    const sentences = expressionData.filter(e => e.category === activeCategory);
    return (
      <div className="space-y-4 animate-in slide-in-from-right-4">
        <header className="flex items-center gap-3">
          <button onClick={() => setActiveCategory(null)} className="p-1.5 bg-slate-50 rounded-full text-slate-400"><ArrowLeft size={20} /></button>
          <h1 className="text-lg font-black text-slate-900">{activeCategory}</h1>
        </header>

        <div className="space-y-3">
          {sentences.map((expr) => (
            <div key={expr.id} className="p-4 rounded-card border border-slate-50 bg-white shadow-sm flex items-start justify-between gap-4">
              <div className="space-y-1 overflow-hidden">
                 <h3 className="text-base font-black text-slate-800 leading-snug">{expr.fr}</h3>
                 <p className="text-[10px] font-mono text-slate-400 italic">{expr.ipa}</p>
                 <p className="text-sm text-slate-500 font-medium mt-1">{expr.cn}</p>
              </div>
              <TTSButton text={expr.fr} size="md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">场景会话</h1>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const count = expressionData.filter(e => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="bg-white p-6 rounded-card border border-slate-50 shadow-sm flex flex-col items-center gap-3 active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center text-2xl font-black">
                {cat[0]}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">{cat}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{count} Phrases</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
