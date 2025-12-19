import React, { useState, useEffect } from 'react';
import { readingData } from '../data/readingData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, BookOpen, Clock, Languages, Volume2, Sparkles } from 'lucide-react';
import { CEFRLevel } from '../types';
import { tts } from '../lib/tts';
import clsx from 'clsx';

export default function Reading() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'All'>('All');
  const [showTranslation, setShowTranslation] = useState(false);
  const [isReadingFull, setIsReadingFull] = useState(false);
  
  const activeArticle = readingData.find(r => r.id === activeArticleId);
  const filteredArticles = readingData.filter(art => selectedLevel === 'All' ? true : art.level === selectedLevel);

  const handleReadFull = () => {
    if (isReadingFull) {
      tts.stop();
      setIsReadingFull(false);
    } else if (activeArticle) {
      setIsReadingFull(true);
      tts.speak(activeArticle.content_fr, () => setIsReadingFull(false));
    }
  };

  useEffect(() => {
    return () => { tts.stop(); };
  }, []);

  if (activeArticle) {
    const paragraphs_fr = activeArticle.content_fr.split('\n\n');
    const paragraphs_zh = activeArticle.content_zh.split('\n\n');

    return (
      <div className="space-y-4 animate-in slide-in-from-bottom-4">
        <header className="flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur py-2 z-10 border-b border-slate-50">
          <button onClick={() => { setActiveArticleId(null); tts.stop(); }} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90 transition-transform">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-black text-slate-800 truncate">{activeArticle.title}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Niveau {activeArticle.level}</p>
          </div>
        </header>

        <article className="bg-white rounded-card p-5 shadow-soft border border-slate-100 space-y-6">
          <div className="flex justify-center border-b border-slate-50 pb-5">
            <button 
              onClick={handleReadFull}
              className={clsx(
                "flex items-center gap-2 px-6 h-11 rounded-btn font-black text-sm transition-all shadow-md active:scale-95",
                isReadingFull ? "bg-red-500 text-white shadow-red-100" : "bg-[#7ED957] text-white shadow-green-100"
              )}
            >
              <Volume2 size={18} fill="white" />
              {isReadingFull ? "停止播放" : "🔊 法音"}
            </button>
          </div>

          <div className="space-y-8">
            {paragraphs_fr.map((para, idx) => (
              <div key={idx} className="space-y-3">
                <p className="text-lg leading-[1.8] text-slate-800 font-medium">
                  {para}
                </p>
                {showTranslation && (
                  <div className="p-3 rounded-xl bg-slate-50 border-l-4 border-brand-200 text-slate-500 text-sm italic animate-in fade-in leading-relaxed">
                    {paragraphs_zh[idx]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-slate-50">
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 h-11 rounded-btn font-black text-sm active:bg-slate-200 transition-colors"
            >
              <Languages size={18} />
              {showTranslation ? "隐藏对照" : "显示中法对照"}
            </button>

            <section className="bg-sky-50 rounded-card p-5 space-y-4">
               <div className="flex items-center gap-2 text-brand-600">
                 <Sparkles size={18} />
                 <h3 className="font-black text-sm uppercase">重点词汇</h3>
               </div>
               <div className="grid grid-cols-1 gap-2">
                 {activeArticle.keywords.map((kw, i) => (
                   <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between border border-slate-50">
                     <div className="flex items-center gap-3">
                       <TTSButton text={kw.fr} size="sm" />
                       <div>
                         <p className="font-black text-sm text-slate-800">{kw.fr}</p>
                         <p className="text-[10px] text-slate-400 font-mono">{kw.ipa}</p>
                       </div>
                     </div>
                     <span className="text-xs text-brand-600 font-black">{kw.zh}</span>
                   </div>
                 ))}
               </div>
            </section>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-lg font-black text-slate-800">精选阅读</h1>
        <div className="text-[10px] text-brand-500 bg-brand-50 px-3 py-1 rounded-full font-black">
          {filteredArticles.length} Articles
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl as any)}
            className={clsx(
              "px-4 py-2 rounded-full font-black text-xs transition-all border shrink-0",
              selectedLevel === lvl 
                ? "bg-slate-900 border-slate-900 text-white" 
                : "bg-white border-slate-100 text-slate-400"
            )}
          >
            {lvl === 'All' ? '全部' : lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredArticles.map((art) => (
          <button
            key={art.id}
            onClick={() => setActiveArticleId(art.id)}
            className="bg-white p-5 rounded-card border border-slate-50 shadow-soft active:scale-95 transition-all text-left flex flex-col gap-3 relative overflow-hidden group"
          >
            <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] group-hover:scale-110 transition-transform">
              <BookOpen size={100} />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase">
                {art.level}
              </span>
              <div className="flex items-center gap-1.5 text-slate-300">
                 <Clock size={12} />
                 <span className="text-[9px] font-bold">~{Math.ceil(art.content_fr.length / 100)} min</span>
              </div>
            </div>
            
            <h3 className="text-base font-black text-slate-800 leading-tight relative z-10">
              {art.title}
            </h3>
            
            <p className="text-slate-400 text-xs font-medium line-clamp-1 relative z-10">
              {art.content_fr.slice(0, 60)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}