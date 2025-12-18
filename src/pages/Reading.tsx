import React, { useState, useEffect } from 'react';
import { readingData } from '../data/readingData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, BookOpen, Clock, Languages, Headphones, ChevronRight, Play, Square, Sparkles } from 'lucide-react';
import { CEFRLevel } from '../types';
import clsx from 'clsx';

export default function Reading() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'All'>('All');
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  const [currentParaIdx, setCurrentParaIdx] = useState<number | null>(null);
  
  const activeArticle = readingData.find(r => r.id === activeArticleId);

  // Level mapping for the list view
  const filteredArticles = readingData.filter(art => 
    selectedLevel === 'All' ? true : art.level === selectedLevel
  );

  // Audio sequencing logic for full article playback
  const playParagraph = (paragraphs: string[], index: number) => {
    if (index >= paragraphs.length || !isPlayingFull) {
      setIsPlayingFull(false);
      setCurrentParaIdx(null);
      return;
    }

    setCurrentParaIdx(index);
    const utterance = new SpeechSynthesisUtterance(paragraphs[index]);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;

    utterance.onend = () => {
      // Check state again because it might have been canceled during playback
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
         // This is a browser quirk fix
      }
      playParagraph(paragraphs, index + 1);
    };

    utterance.onerror = () => {
      setIsPlayingFull(false);
      setCurrentParaIdx(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleFullAudio = () => {
    if (isPlayingFull) {
      window.speechSynthesis.cancel();
      setIsPlayingFull(false);
      setCurrentParaIdx(null);
    } else if (activeArticle) {
      const paragraphs = activeArticle.content_fr.split('\n\n');
      setIsPlayingFull(true);
      playParagraph(paragraphs, 0);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // --- ARTICLE DETAIL VIEW ---
  if (activeArticle) {
    const paragraphs_fr = activeArticle.content_fr.split('\n\n');
    const paragraphs_zh = activeArticle.content_zh.split('\n\n');

    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <button 
          onClick={() => { 
            window.speechSynthesis.cancel();
            setActiveArticleId(null); 
            setShowTranslation(false); 
            setIsPlayingFull(false);
            setCurrentParaIdx(null);
          }} 
          className="flex items-center text-slate-500 hover:text-brand-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> 返回文章列表
        </button>

        <article className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-50 pb-8">
            <div className="space-y-3 flex-1">
               <span className="px-3 py-1 bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                Niveau {activeArticle.level}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{activeArticle.title}</h1>
            </div>
            
            <button 
              onClick={handleToggleFullAudio}
              className={clsx(
                "flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all active:scale-95 whitespace-nowrap",
                isPlayingFull ? "bg-red-500 text-white hover:bg-red-600" : "bg-slate-900 text-white hover:bg-brand-600"
              )}
            >
              {isPlayingFull ? <Square size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              {isPlayingFull ? "停止播放" : "全文朗读"}
            </button>
          </div>

          <div className="space-y-12">
            {/* French Text Content */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-brand-600 border-b border-brand-100 pb-2 w-fit">
                 <h2 className="font-black text-xs md:text-sm uppercase tracking-[0.2em]">Texte Original</h2>
              </div>
              
              <div className="space-y-8">
                {paragraphs_fr.map((para, idx) => (
                  <div key={idx} className="relative">
                    <div className={clsx(
                      "text-xl md:text-2xl leading-[2] text-slate-800 font-medium transition-all duration-500 rounded-2xl p-4 -mx-4",
                      currentParaIdx === idx ? "bg-brand-50 text-brand-900 shadow-sm scale-[1.01]" : "bg-transparent"
                    )}>
                      {para}
                    </div>
                    {showTranslation && (
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 border-l-4 border-slate-200 text-slate-500 italic animate-in fade-in slide-in-from-left-2 duration-500">
                        {paragraphs_zh[idx]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold transition-all"
              >
                <Languages size={20} />
                {showTranslation ? "隐藏翻译" : "显示翻译"}
              </button>
            </div>

            {/* Keywords */}
            <section className="bg-slate-50 rounded-[2rem] p-8 space-y-6">
               <div className="flex items-center gap-2 text-slate-400">
                 <Sparkles size={20} />
                 <h3 className="font-black text-xs uppercase tracking-widest">Mots clés (重点词汇)</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {activeArticle.keywords.map((kw, i) => (
                   <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
                     <div className="flex items-center gap-3">
                       <TTSButton text={kw.fr} size="sm" />
                       <div>
                         <p className="font-bold text-slate-900">{kw.fr}</p>
                         <p className="text-[10px] text-slate-400 font-mono">{kw.ipa}</p>
                       </div>
                     </div>
                     <span className="text-sm text-brand-600 font-bold">{kw.zh}</span>
                   </div>
                 ))}
               </div>
            </section>
          </div>
        </article>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">精选阅读 (Lecture)</h1>
          <p className="text-slate-500 font-medium mt-1">分级精品美文，地道表达与朗读伴读。</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 text-brand-600 font-black">
          <BookOpen size={20} />
          {readingData.length} 篇
        </div>
      </header>

      {/* Level Filter */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl as any)}
            className={clsx(
              "px-6 py-2 rounded-full font-black transition-all border-2",
              selectedLevel === lvl 
                ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                : "bg-white border-slate-100 text-slate-400 hover:border-brand-200"
            )}
          >
            {lvl === 'All' ? '全部级别' : lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredArticles.map((art) => (
          <button
            key={art.id}
            onClick={() => setActiveArticleId(art.id)}
            className="group bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-brand-500 hover:shadow-2xl transition-all text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <BookOpen size={120} />
            </div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className={clsx(
                  "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                  art.level === 'A1' && "bg-blue-100 text-blue-600",
                  art.level === 'A2' && "bg-green-100 text-green-600",
                  art.level === 'B1' && "bg-yellow-100 text-yellow-600",
                  art.level === 'B2' && "bg-orange-100 text-orange-600",
                  art.level === 'C1' && "bg-red-100 text-red-600"
                )}>
                  Niveau {art.level}
                </span>
                {art.audio && (
                  <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-brand-500 transition-colors">
                    <Headphones size={16} />
                    <span className="text-[10px] font-black uppercase">Audio</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-brand-600 transition-colors">
                {art.title}
              </h3>
              
              <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
                 <div className="flex items-center gap-1">
                   <Clock size={14} />
                   <span>~{Math.ceil(art.content_fr.length / 50)} min</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <Languages size={14} />
                   <span>Traduit</span>
                 </div>
              </div>

              <div className="pt-4 flex items-center gap-2 text-brand-600 font-black text-sm opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                开始阅读 <ChevronRight size={18} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
           <BookOpen size={64} className="text-slate-100 mb-4" />
           <p className="text-slate-400 font-bold">该级别文章正在编写中，请先探索其他级别。</p>
        </div>
      )}
    </div>
  );
}
