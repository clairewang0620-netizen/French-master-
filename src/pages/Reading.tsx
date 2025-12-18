import React, { useState, useEffect, useRef } from 'react';
import { readingData } from '../data/readingData';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, BookOpen, Clock, Languages, Headphones, ChevronRight, Volume2, Square, Sparkles } from 'lucide-react';
import { CEFRLevel } from '../types';
import clsx from 'clsx';

export default function Reading() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'All'>('All');
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlayingFull, setIsPlayingFull] = useState(false);
  
  // Ref to track if playback should continue (to stop immediately on user cancel)
  const isPlayingRef = useRef(false);
  
  const activeArticle = readingData.find(r => r.id === activeArticleId);

  const filteredArticles = readingData.filter(art => 
    selectedLevel === 'All' ? true : art.level === selectedLevel
  );

  /**
   * CROSS-PLATFORM AUDIO QUEUE SYSTEM:
   * 1. Splits text into small chunks (< 160 chars) at sentence boundaries.
   * 2. Uses sequential onend triggers to avoid buffer overflow on iOS/Android.
   * 3. Forces fr-FR locale and specific French voice selection.
   */
  const handleToggleFullAudio = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlayingFull) {
      window.speechSynthesis.cancel();
      isPlayingRef.current = false;
      setIsPlayingFull(false);
      return;
    }

    if (!activeArticle) return;

    window.speechSynthesis.cancel();
    isPlayingRef.current = true;
    setIsPlayingFull(true);

    // 1. Prepare Text: Split by sentence delimiters and ensure chunks are small
    const rawText = activeArticle.content_fr;
    const sentences = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
    
    // Sub-chunking if any sentence exceeds character limits (for mobile stability)
    const chunks: string[] = [];
    sentences.forEach(s => {
      const text = s.trim();
      if (text.length > 160) {
        const parts = text.match(/.{1,160}(\s|$)/g) || [text];
        parts.forEach(p => chunks.push(p.trim()));
      } else {
        chunks.push(text);
      }
    });

    let currentChunkIdx = 0;

    const speakNextChunk = () => {
      if (!isPlayingRef.current || currentChunkIdx >= chunks.length) {
        setIsPlayingFull(false);
        isPlayingRef.current = false;
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[currentChunkIdx]);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Ensure French voice is selected
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith('fr')) || null;
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onend = () => {
        currentChunkIdx++;
        speakNextChunk();
      };

      utterance.onerror = () => {
        setIsPlayingFull(false);
        isPlayingRef.current = false;
      };

      window.speechSynthesis.speak(utterance);
    };

    // Begin sequence
    speakNextChunk();
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      isPlayingRef.current = false;
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
            isPlayingRef.current = false;
            setActiveArticleId(null); 
            setShowTranslation(false); 
            setIsPlayingFull(false);
          }} 
          className="flex items-center text-slate-500 hover:text-brand-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> 返回文章列表
        </button>

        <article className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 border-b border-slate-50 pb-8">
            <div className="space-y-3 flex-1">
               <span className="px-3 py-1 bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                Niveau {activeArticle.level}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{activeArticle.title}</h1>
            </div>
            
            {/* MANDATORY GREEN PRONUNCIATION BUTTON */}
            <button 
              onClick={handleToggleFullAudio}
              className={clsx(
                "flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black shadow-xl transition-all active:scale-95 whitespace-nowrap",
                isPlayingFull 
                  ? "bg-red-500 text-white hover:bg-red-600 shadow-red-100" 
                  : "bg-[#16a34a] text-white hover:bg-[#15803d] shadow-green-100"
              )}
            >
              {isPlayingFull ? (
                <>
                  <Square size={24} fill="currentColor" />
                  <span>停止播放</span>
                </>
              ) : (
                <>
                  <Volume2 size={24} />
                  <span>🔊 法语朗读</span>
                </>
              )}
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
                    <div className="text-xl md:text-2xl leading-[2.2] text-slate-800 font-medium rounded-2xl">
                      {para}
                    </div>
                    {showTranslation && (
                      <div className="mt-4 p-5 rounded-2xl bg-slate-50 border-l-4 border-slate-200 text-slate-500 italic animate-in fade-in slide-in-from-left-2 duration-500 text-lg leading-relaxed">
                        {paragraphs_zh[idx]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50">
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
                   <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
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
        <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 text-brand-600 font-black">
          <BookOpen size={20} />
          {readingData.length} 篇美文
        </div>
      </header>

      {/* Level Filter */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl as any)}
            className={clsx(
              "px-6 py-2.5 rounded-full font-black transition-all border-2",
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
                  <div className="flex items-center gap-1.5 text-brand-500 font-black uppercase tracking-tighter">
                    <Volume2 size={18} />
                    <span className="text-[10px]">Audio Ready</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-brand-600 transition-colors">
                {art.title}
              </h3>
              
              <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
                {art.content_fr.slice(0, 120)}...
              </p>
              
              <div className="flex items-center gap-4 text-slate-400 text-xs font-bold pt-2">
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
                进入阅读模式 <ChevronRight size={18} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
           <BookOpen size={64} className="text-slate-100 mb-4" />
           <p className="text-slate-400 font-bold">该级别文章正在编写中...</p>
        </div>
      )}
    </div>
  );
}
