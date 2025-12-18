
import React, { useState, useEffect } from 'react';
import { readingData } from '../data/readingData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, BookOpen, Clock, Languages, Headphones, ChevronRight, Volume2, Sparkles } from 'lucide-react';
import { CEFRLevel } from '../types';
import { tts } from '../lib/tts';
import clsx from 'clsx';

export default function Reading() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'All'>('All');
  const [showTranslation, setShowTranslation] = useState(false);
  const [isReadingFull, setIsReadingFull] = useState(false);
  
  const activeArticle = readingData.find(r => r.id === activeArticleId);

  const filteredArticles = readingData.filter(art => 
    selectedLevel === 'All' ? true : art.level === selectedLevel
  );

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
      <div className="space-y-8 pb-20 animate-in fade-in max-w-4xl mx-auto px-1">
        <button 
          onClick={() => { setActiveArticleId(null); tts.stop(); }} 
          className="flex items-center text-slate-500 hover:text-brand-600 font-bold"
        >
          <ArrowLeft size={24} className="mr-2" /> 返回目录
        </button>

        <article className="bg-white rounded-[40px] p-8 md:p-14 shadow-2xl border border-slate-100 overflow-hidden space-y-12">
          <div className="space-y-6 text-center border-b border-slate-50 pb-10">
            <span className="px-5 py-2 bg-brand-500 text-white rounded-full text-xs font-black uppercase tracking-widest">
              Level {activeArticle.level}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">{activeArticle.title}</h1>
            
            <div className="flex justify-center pt-2">
              <button 
                onClick={handleReadFull}
                className={clsx(
                  "flex items-center gap-3 px-10 py-5 rounded-full font-black text-lg transition-all shadow-xl active:scale-95",
                  isReadingFull ? "bg-red-500 text-white" : "bg-[#7ED957] text-white"
                )}
              >
                <Volume2 size={24} fill="white" />
                {isReadingFull ? "停止播放" : "全文伴读"}
              </button>
            </div>
          </div>

          <div className="space-y-14">
            {paragraphs_fr.map((para, idx) => (
              <div key={idx} className="space-y-6">
                <p className="text-[18px] md:text-[22px] leading-[1.9] text-slate-800 font-medium font-serif">
                  {para}
                </p>
                {showTranslation && (
                  <div className="p-6 rounded-3xl bg-slate-50 border-l-8 border-brand-200 text-slate-500 font-bold text-base italic animate-in fade-in">
                    {paragraphs_zh[idx]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-6 pt-10 border-t border-slate-50">
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-5 rounded-[24px] font-black text-lg"
            >
              <Languages size={24} />
              {showTranslation ? "隐藏中文" : "对照翻译"}
            </button>

            <section className="bg-brand-50 rounded-[32px] p-8 space-y-8">
               <div className="flex items-center gap-3 text-brand-600">
                 <Sparkles size={24} />
                 <h3 className="font-black text-lg uppercase">重点词汇 (Mots clés)</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {activeArticle.keywords.map((kw, i) => (
                   <div key={i} className="bg-white p-5 rounded-2xl shadow-sm flex items-center justify-between border border-white">
                     <div className="flex items-center gap-3">
                       <TTSButton text={kw.fr} size="sm" />
                       <div>
                         <p className="font-black text-slate-900">{kw.fr}</p>
                         <p className="text-[10px] text-slate-400 font-mono">{kw.ipa}</p>
                       </div>
                     </div>
                     <span className="text-sm text-brand-600 font-black">{kw.zh}</span>
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
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">精选阅读</h1>
          <p className="text-slate-500 font-bold text-lg">地道美文与分级阅读伴读</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 text-brand-600 font-black">
          <BookOpen size={20} />
          {readingData.length} 篇文章
        </div>
      </header>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl as any)}
            className={clsx(
              "px-8 py-3 rounded-full font-black transition-all border-2 whitespace-nowrap",
              selectedLevel === lvl 
                ? "bg-slate-900 border-slate-900 text-white shadow-xl" 
                : "bg-white border-slate-100 text-slate-400 hover:border-brand-200"
            )}
          >
            {lvl === 'All' ? '全部级别' : lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((art) => (
          <button
            key={art.id}
            onClick={() => setActiveArticleId(art.id)}
            className="group bg-white p-10 rounded-[40px] border border-slate-100 hover:border-brand-500 hover:shadow-2xl transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={160} />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  Niveau {art.level}
                </span>
                <div className="flex items-center gap-2 text-brand-500">
                  <Volume2 size={20} fill="currentColor" fillOpacity={0.1} />
                  <span className="text-[10px] font-black uppercase">Audio</span>
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-slate-800 leading-tight group-hover:text-brand-600 transition-colors">
                {art.title}
              </h3>
              
              <div className="flex items-center gap-6 text-slate-400 text-xs font-bold pt-2">
                 <div className="flex items-center gap-2">
                   <Clock size={16} />
                   <span>~{Math.ceil(art.content_fr.length / 50)} min</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Languages size={16} />
                   <span>中法对照</span>
                 </div>
              </div>

              <div className="pt-4 flex items-center gap-2 text-brand-600 font-black text-sm opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                立即阅读 <ChevronRight size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
