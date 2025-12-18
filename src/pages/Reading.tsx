
import React, { useState } from 'react';
import { readingData } from '../data/mockData';
import { TTSButton } from '../components/TTSButton';
import { speakFrench } from '../lib/tts';
import { ArrowLeft, BookOpen, Clock, Languages, Headphones, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function Reading() {
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const activeArticle = readingData.find(r => r.id === activeArticleId);

  if (activeArticle) {
    return (
      <div className="space-y-6 pb-20 animate-in fade-in duration-500 max-w-4xl mx-auto">
        <button 
          onClick={() => { setActiveArticleId(null); setShowTranslation(false); }} 
          className="flex items-center text-slate-500 hover:text-brand-600 font-medium transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> 返回文章列表
        </button>

        <article className="bg-white rounded-[2rem] p-6 md:p-12 shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-50 pb-8">
            <div className="space-y-3 flex-1">
               <span className="px-3 py-1 bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">
                Niveau {activeArticle.level}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">{activeArticle.title}</h1>
            </div>
            
            <button 
              onClick={() => speakFrench(activeArticle.content_fr)}
              className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-brand-600 shadow-xl transition-all active:scale-95"
            >
              <Headphones size={22} />
              全文朗读 (fr-FR)
            </button>
          </div>

          <div className="space-y-12">
            {/* French Text */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-brand-600">
                 <div className="w-1.5 h-6 bg-brand-500 rounded-full"></div>
                 <h2 className="font-black text-lg uppercase tracking-wider">Texte Original</h2>
              </div>
              <div className="text-xl md:text-2xl leading-[2.2] text-slate-800 font-medium bg-slate-50/50 p-6 md:p-10 rounded-3xl border border-slate-100 shadow-inner select-text whitespace-pre-wrap">
                {activeArticle.content_fr}
              </div>
            </section>

            {/* Translation (Foldable) */}
            <section className="space-y-4">
              <button 
                onClick={() => setShowTranslation(!showTranslation)}
                className={clsx(
                  "w-full flex items-center justify-between p-6 rounded-2xl border font-bold transition-all",
                  showTranslation ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 shadow-sm"
                )}
              >
                <div className="flex items-center gap-3">
                  <Languages size={24} className={showTranslation ? "text-emerald-500" : "text-slate-400"} />
                  显示/隐藏中文翻译
                </div>
                {showTranslation ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {showTranslation && (
                <div className="text-lg md:text-xl leading-[2] text-slate-600 bg-emerald-50/20 p-8 rounded-3xl border border-emerald-100 italic animate-in slide-in-from-top-2 duration-300">
                  {activeArticle.content_zh}
                </div>
              )}
            </section>

            {/* Keywords */}
            <section className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
              <h3 className="font-black text-slate-900 mb-6 text-xl flex items-center gap-3">
                <BookOpen size={24} className="text-accent-500" /> 
                核心词汇 / Vocabulaire Clé
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeArticle.keywords.map((kw, i) => (
                  <div key={i} className="flex flex-col p-5 bg-white border border-slate-200 rounded-2xl hover:border-brand-300 transition-all shadow-sm group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-brand-900 text-lg">{kw.fr}</span>
                      <TTSButton text={kw.fr} size="sm" variant="ghost" />
                    </div>
                    {kw.ipa && <span className="text-[10px] font-mono text-slate-400 mb-1">{kw.ipa}</span>}
                    <span className="text-slate-500 text-sm font-medium">{kw.zh}</span>
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
      <header className="max-w-2xl">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">精选阅读 (Lecture)</h1>
        <p className="text-lg text-slate-500 font-medium">通过 20 篇高品质文章建立法语语感与逻辑思考。</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {readingData.map(article => (
          <div 
            key={article.id} 
            onClick={() => { setActiveArticleId(article.id); window.scrollTo(0,0); }}
            className="group bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-brand-400 hover:shadow-xl cursor-pointer transition-all flex flex-col h-full relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-tighter">
                  {article.level}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> 约 500 词
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-brand-600 transition-colors leading-tight">
              {article.title}
            </h3>
            
            <p className="text-slate-400 line-clamp-2 mb-6 flex-1 text-sm font-medium">
              {article.content_fr.substring(0, 100)}...
            </p>
            
            <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
               <span className="flex items-center gap-1"><Headphones size={14} className="text-brand-300"/> 全文朗读</span>
               <span className="flex items-center gap-1"><Languages size={14} className="text-emerald-300"/> 双语切换</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
