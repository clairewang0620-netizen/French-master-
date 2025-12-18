
import React, { useState } from 'react';
import { expressionData } from '../data/mockData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, MessageSquare, MapPin, Coffee, User, Briefcase, Zap, ChevronRight, PlayCircle, Star } from 'lucide-react';
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

  const handlePlaySentence = async (text: string, id: string) => {
    setActiveSentenceId(id);
    await speakFrench(text);
    setTimeout(() => setActiveSentenceId(null), 3000);
  };

  if (activeCategory) {
    const sentences = expressionData.filter(e => e.category === activeCategory);
    const config = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG['默认'];

    return (
      <div className="space-y-8 max-w-3xl mx-auto pb-20 px-1">
         <button onClick={() => setActiveCategory(null)} className="flex items-center text-slate-500 hover:text-brand-600 font-black mb-2">
          <ArrowLeft size={24} className="mr-2" /> 返回分类
        </button>

        <header className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl flex items-center gap-6">
          <div className={`w-20 h-20 rounded-[28px] ${config.color} flex items-center justify-center text-4xl shadow-inner`}>
            {config.emoji}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{activeCategory}</h1>
            <p className="text-slate-500 font-bold mt-1">{sentences.length} 个精选句子</p>
          </div>
        </header>

        <div className="space-y-4">
          {sentences.map((expr, idx) => {
            const isActive = activeSentenceId === expr.id;
            return (
              <div 
                key={expr.id} 
                className={clsx(
                  "p-8 rounded-[32px] border-2 transition-all bg-white relative overflow-hidden group",
                  isActive ? "border-[#7ED957] shadow-xl" : "border-slate-100 hover:border-brand-200"
                )}
              >
                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Phrase #{idx + 1}</span>
                    <TTSButton text={expr.fr} size="sm" label="发音" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-2xl font-black text-slate-900 leading-tight">{expr.fr}</h3>
                     <p className="text-sm font-mono text-slate-400 font-bold italic">{expr.ipa}</p>
                     <p className="text-xl text-slate-600 font-bold pt-2">{expr.cn}</p>
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
    <div className="space-y-10">
      <header className="space-y-1">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">场景常用语</h1>
        <p className="text-slate-500 font-bold text-lg">地道口语表达，覆盖核心生活场景</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat: string) => {
          const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['默认'];
          const count = expressionData.filter(e => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="group bg-white p-8 rounded-[40px] border border-slate-100 hover:border-brand-400 hover:shadow-2xl transition-all text-left flex flex-col items-start relative overflow-hidden h-64 justify-between"
            >
              <div className={`w-16 h-16 rounded-[24px] ${config.color} flex items-center justify-center text-3xl shadow-sm z-10 group-hover:scale-110 transition-transform`}>
                {config.emoji}
              </div>
              <div className="z-10 w-full space-y-2">
                <h3 className="text-2xl font-black text-slate-900">{cat}</h3>
                <div className="flex justify-between items-center w-full">
                  <p className="text-slate-400 font-bold">{count} 句地道表达</p>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={22} />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-slate-50 rounded-full opacity-40 z-0 group-hover:bg-brand-50 transition-colors"></div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
