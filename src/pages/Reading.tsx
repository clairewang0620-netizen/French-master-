import React, { useState, useEffect } from 'react';
import { readingData } from '../data/readingData';
import { ArrowLeft, Languages, Pause, Play, Sparkles } from 'lucide-react';
import { tts } from '../lib/tts';
import clsx from 'clsx';

export default function Reading() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showZH, setShowZH] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(tts.getStatus());
  
  const article = readingData.find(r => r.id === activeId);

  useEffect(() => {
    tts.registerStatusListener((s) => setPlaybackStatus(s));
    return () => tts.stop();
  }, [activeId]);

  const handleMasterControl = () => {
    if (!article) return;
    const status = tts.getStatus();
    
    // Toggle logic is handled inside tts.playAudio when the same audioUrl is passed
    tts.playAudio({ text: article.content_fr, audioUrl: article.audioUrl });
  };

  if (article) {
    return (
      <div className="space-y-4 animate-in slide-in-from-bottom-4 pb-20">
        <header className="flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur-md py-2 z-10">
          <button onClick={() => { setActiveId(null); tts.stop(); }} className="p-1.5 bg-slate-50 rounded-full text-slate-400 active:scale-90 transition-transform"><ArrowLeft size={20} /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-black text-slate-900 truncate">{article.title}</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Niveau {article.level}</p>
          </div>
        </header>

        <article className="bg-white rounded-card p-6 shadow-md border border-slate-50 space-y-6">
          {/* Main Playback Control */}
          <div className="flex justify-center border-b border-slate-50 pb-8 pt-4">
            <button 
              onClick={handleMasterControl}
              className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95",
                playbackStatus === 'playing' ? "bg-danger" : "bg-success"
              )}
            >
              {playbackStatus === 'playing' ? (
                <Pause size={40} fill="white" className="text-white" />
              ) : (
                <Play size={40} fill="white" className="text-white ml-2" />
              )}
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-lg leading-[2.2] text-slate-800 font-medium tracking-wide first-letter:text-4xl first-letter:font-black first-letter:text-brand-500 first-letter:mr-1">
                {article.content_fr}
              </p>
              {showZH && (
                <div className="p-4 rounded-2xl bg-slate-50 border-l-4 border-brand-200 text-slate-500 text-sm italic leading-relaxed animate-in fade-in slide-in-from-top-2">
                  {article.content_zh}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6 border-t border-slate-50">
            <button 
              onClick={() => setShowZH(!showZH)} 
              className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 h-12 rounded-btn font-black text-xs shadow-inner transition-colors"
            >
              <Languages size={18} />
              {showZH ? "隐藏中文对照" : "显示中文对照"}
            </button>

            {article.keywords && article.keywords.length > 0 && (
              <section className="bg-brand-50 rounded-card p-5 space-y-4 mt-4">
                <div className="flex items-center gap-2 text-brand-600">
                  <Sparkles size={18} />
                  <h3 className="font-black text-[11px] uppercase tracking-wider">核心词库</h3>
                </div>
                <div className="grid gap-2">
                  {article.keywords.map((kw, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between border border-white">
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{kw.fr}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{kw.ipa}</p>
                      </div>
                      <span className="text-xs text-brand-600 font-black">{kw.zh}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-slate-900">精选阅读</h1>
      <div className="grid gap-3">
        {readingData.map(art => (
          <button 
            key={art.id} 
            onClick={() => setActiveId(art.id)} 
            className="bg-white p-5 rounded-card border border-slate-100 shadow-soft flex flex-col gap-2 relative overflow-hidden group active:scale-98 transition-all"
          >
            <div className="flex items-center justify-between relative z-10">
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{art.level}</span>
            </div>
            <h3 className="text-base font-black text-slate-800 group-hover:text-brand-500 transition-colors text-left">{art.title}</h3>
            <p className="text-slate-400 text-xs line-clamp-2 text-left">{art.content_fr}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
