import React, { useState, useEffect } from 'react';
import { readingData } from '../data/readingData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, BookOpen, Clock, Languages, Volume2, Pause, Play, Sparkles } from 'lucide-react';
import { CEFRLevel } from '../types';
import { tts } from '../lib/tts';
import clsx from 'clsx';

export default function Reading() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'All'>('All');
  const [showTranslation, setShowTranslation] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(tts.getStatus());
  
  const activeArticle = readingData.find(r => r.id === activeArticleId);
  const filteredArticles = readingData.filter(art => selectedLevel === 'All' ? true : art.level === selectedLevel);

  useEffect(() => {
    // Listen to shared TTS status
    tts.registerStatusListener((s) => setPlaybackStatus(s));
    return () => { tts.stop(); };
  }, []);

  const handleAudioControl = () => {
    tts.unlock(); // Ensure gesture unlock
    const currentStatus = tts.getStatus();
    
    if (currentStatus === 'playing') {
      tts.pause();
    } else if (currentStatus === 'paused') {
      tts.resume();
    } else if (activeArticle) {
      tts.speak(activeArticle.content_fr);
    }
  };

  if (activeArticle) {
    const paragraphs_fr = activeArticle.content_fr.split('\n\n');
    const paragraphs_zh = activeArticle.content_zh.split('\n\n');

    return (
      <div className="space-y-4 animate-in slide-in-from-bottom-4">
        <header className="flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur-md py-2 z-10 border-b border-slate-50">
          <button onClick={() => { setActiveArticleId(null); tts.stop(); }} className="p-1.5 bg-slate-50 rounded-full text-slate-400 active:scale-90">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 overflow-hidden">
            <h1 className="text-sm font-black text-slate-900 truncate tracking-tight">{activeArticle.title}</h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Niveau {activeArticle.level}</p>
          </div>
        </header>

        <article className="bg-white rounded-card p-4 shadow-soft border border-slate-50 space-y-5">
          {/* Main Control: Icon-only, high visibility */}
          <div className="flex justify-center border-b border-slate-50 pb-6 pt-2">
            <button 
              onClick={handleAudioControl}
              className={clsx(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95",
                playbackStatus === 'playing' ? "bg-red-500 shadow-red-100" : "bg-[#7ED957] shadow-green-100"
              )}
            >
              {playbackStatus === 'playing' ? (
                <Pause size={32} fill="white" className="text-white" />
              ) : playbackStatus === 'paused' ? (
                <Play size={32} fill="white" className="text-white ml-1" />
              ) : (
                <Volume2 size={32} fill="white" className="text-white" />
              )}
            </button>
          </div>

          <div className="space-y-6">
            {paragraphs_fr.map((para, idx) => (
              <div key={idx} className="space-y-2.5">
                <p className="text-[15px] leading-[1.8] text-slate-800 font-medium">
                  {para}
                </p>
                {showTranslation && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border-l-4 border-brand-200 text-slate-500 text-[13px] italic animate-in fade-in leading-relaxed">
                    {paragraphs_zh[idx]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3.5 pt-4 border-t border-slate-50">
            <button 
              onClick={() => setShowTranslation(!showTranslation)}
              className="flex items-center justify-center gap-2 bg-slate-50 text-slate-600 h-11 rounded-btn font-black text-[11px] active:bg-slate-100 transition-colors border border-slate-100"
            >
              <Languages size={16} />
              {showTranslation ? "隐藏对照" : "显示中法对照"}
            </button>

            <section className="bg-brand-50 rounded-card p-4 space-y-3">
               <div className="flex items-center gap-2 text-brand-600">
                 <Sparkles size={16} />
                 <h3 className="font-black text-[10px] uppercase tracking-wider">重点词汇</h3>
               </div>
               <div className="grid grid-cols-1 gap-2">
                 {activeArticle.keywords.map((kw, i) => (
                   <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between border border-white">
                     <div className="flex items-center gap-3">
                       <TTSButton text={kw.fr} size="sm" />
                       <div>
                         <p className="font-bold text-xs text-slate-800">{kw.fr}</p>
                         <p className="text-[9px] text-slate-400 font-mono tracking-tight">{kw.ipa}</p>
                       </div>
                     </div>
                     <span className="text-[11px] text-brand-600 font-black">{kw.zh}</span>
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
    <div className="space-y-3">
      <header className="flex justify-between items-center pb-1">
        <h1 className="text-lg font-black text-slate-900">精选阅读</h1>
        <div className="text-[9px] text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full font-black tracking-wider">
          {filteredArticles.length} Articles
        </div>
      </header>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl as any)}
            className={clsx(
              "px-4 py-1.5 rounded-full font-black text-[11px] transition-all border shrink-0",
              selectedLevel === lvl ? "bg-slate-900 border-slate-900 text-white shadow-sm" : "bg-white border-slate-100 text-slate-400"
            )}
          >
            {lvl === 'All' ? '全部' : lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 pt-1">
        {filteredArticles.map((art) => (
          <button
            key={art.id}
            onClick={() => setActiveArticleId(art.id)}
            className="bg-white p-4 rounded-card border border-slate-100 shadow-soft active:scale-[0.98] transition-all text-left flex flex-col gap-2 relative overflow-hidden group"
          >
            <div className="absolute top-[-15px] right-[-15px] opacity-[0.03] text-slate-900">
              <BookOpen size={80} />
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[8px] font-black uppercase tracking-widest">
                {art.level}
              </span>
              <div className="flex items-center gap-1 text-slate-300">
                 <Clock size={10} />
                 <span className="text-[8px] font-bold">~{Math.ceil(art.content_fr.length / 120)} min</span>
              </div>
            </div>
            
            <h3 className="text-[15px] font-black text-slate-800 leading-tight relative z-10 truncate group-hover:text-brand-500 transition-colors">
              {art.title}
            </h3>
            
            <p className="text-slate-400 text-[11px] font-medium line-clamp-1 relative z-10 opacity-70">
              {art.content_fr.slice(0, 50)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
