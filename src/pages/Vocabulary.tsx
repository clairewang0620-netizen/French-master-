
import React, { useState } from 'react';
import { vocabularyData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, Star, ChevronRight, ChevronLeft, Book, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { CEFRLevel } from '../types';
import clsx from 'clsx';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

const MOTIVATION_TEXTS = [
  "太棒了！继续保持！ 🔥",
  "好样的！发音非常地道 🇫🇷",
  "进步飞快！加油 🎓",
  "完美！ ✨",
  "别放弃，你是最棒的！ 💪"
];

export default function Vocabulary() {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [flashCardIndex, setFlashCardIndex] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false); 
  const { progress, toggleFavorite } = useUserProgress();

  const filteredWords = vocabularyData.filter(w => w.level === selectedLevel);

  const enterFlashCard = (index: number) => {
    setFlashCardIndex(index);
  };
  const exitFlashCard = () => {
    setFlashCardIndex(null);
    setShowFeedback(false);
  };

  const prevCard = () => {
    if (flashCardIndex !== null && flashCardIndex > 0) {
      setFlashCardIndex(flashCardIndex - 1);
      setShowFeedback(false);
    }
  };

  const nextCard = () => {
    if (flashCardIndex !== null && flashCardIndex < filteredWords.length - 1) {
      setFlashCardIndex(flashCardIndex + 1);
      if (Math.random() > 0.7) setShowFeedback(true);
      else setShowFeedback(false);
    }
  };

  if (flashCardIndex !== null) {
    const word = filteredWords[flashCardIndex];
    if (!word) { exitFlashCard(); return null; }

    const isFavorite = progress.favorites.includes(word.id);
    const hasNext = flashCardIndex < filteredWords.length - 1;
    const hasPrev = flashCardIndex > 0;
    const progressPercent = ((flashCardIndex + 1) / filteredWords.length) * 100;

    return (
      <div className="max-w-xl mx-auto h-[calc(100vh-120px)] flex flex-col space-y-4 px-2">
        <button onClick={exitFlashCard} className="flex items-center text-slate-500 hover:text-brand-600 font-bold transition-colors">
          <ArrowLeft size={22} className="mr-2" /> 退出学习
        </button>
        
        <div className="flex items-center gap-4">
             <div className="h-3 bg-slate-200 rounded-full flex-1 overflow-hidden shadow-inner">
               <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
             </div>
             <span className="text-xs font-black text-slate-400 bg-white px-3 py-1.5 rounded-full shadow-sm border">
               {selectedLevel} · {flashCardIndex + 1} / {filteredWords.length}
             </span>
        </div>

        <div className="flex-1 bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-y-auto flex flex-col relative">
           {showFeedback && (
             <div className="absolute top-6 left-0 right-0 z-20 flex justify-center animate-bounce">
               <span className="bg-white border-2 border-brand-100 text-brand-600 px-6 py-2 rounded-full text-sm font-black shadow-xl">
                 {MOTIVATION_TEXTS[Math.floor(Math.random() * MOTIVATION_TEXTS.length)]}
               </span>
             </div>
           )}

           <div className="p-10 text-center border-b border-slate-50 space-y-4">
              <h2 className="text-6xl font-black text-slate-900 tracking-tighter break-words">{word.fr}</h2>
              <div className="flex justify-center items-center gap-4">
                <span className="text-xl text-slate-400 font-mono bg-slate-50 px-4 py-2 rounded-2xl border">{word.ipa}</span>
                <TTSButton text={word.fr} size="lg" />
              </div>
           </div>

           <div className="p-8 md:p-10 space-y-10">
              <p className="text-3xl text-center text-slate-700 font-bold">{word.cn}</p>

              <div className="space-y-6">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] text-center">Exemples (例句)</h4>
                {word.examples.map((ex, idx) => (
                  <div key={idx} className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 space-y-3">
                     <p className="text-slate-900 font-black text-xl leading-tight">{ex.fr}</p>
                     <p className="text-slate-500 font-bold">{ex.cn}</p>
                     <TTSButton text={ex.fr} size="sm" label="发音" />
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4 py-2">
           <button 
              onClick={prevCard}
              disabled={!hasPrev}
              className="w-16 h-16 bg-white border border-slate-200 text-slate-400 rounded-[24px] flex items-center justify-center disabled:opacity-20 hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
            >
              <ChevronLeft size={32} strokeWidth={3} />
            </button>

           <div className="flex-1 flex gap-3">
             <button 
               onClick={() => toggleFavorite(word.id)}
               className={clsx(
                 "flex-1 h-16 rounded-[24px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md",
                 isFavorite 
                  ? "bg-[#E53935] text-white" 
                  : "bg-white border-2 border-slate-200 text-slate-400 hover:border-[#E53935] hover:text-[#E53935]"
               )}
             >
               <Flame size={20} fill={isFavorite ? "white" : "none"} />
               <span>{isFavorite ? "已收藏" : "加强记忆"}</span>
             </button>
             
             <button 
               onClick={nextCard}
               className="flex-1 h-16 bg-slate-900 text-white rounded-[24px] font-black flex items-center justify-center gap-2 active:scale-95 shadow-lg"
             >
               <CheckCircle2 size={20} />
               <span>已掌握</span>
             </button>
           </div>

            <button 
              onClick={nextCard}
              disabled={!hasNext}
              className="w-16 h-16 bg-white border border-slate-200 text-slate-400 rounded-[24px] flex items-center justify-center disabled:opacity-20 hover:bg-slate-50 active:scale-90 transition-all shadow-sm"
            >
              <ChevronRight size={32} strokeWidth={3} />
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">核心词汇库</h1>
          <p className="text-slate-500 font-bold">精选必背词汇 (A1-C1)</p>
        </div>
        <div className="bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 text-brand-600 font-black">
          <Book size={18} />
          {filteredWords.length} 单词
        </div>
      </header>

      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
        {LEVELS.map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={clsx(
              "px-8 py-3 rounded-full font-black transition-all whitespace-nowrap border-2",
              selectedLevel === lvl 
                ? "bg-slate-900 text-white border-slate-900 shadow-xl" 
                : "bg-white text-slate-400 border-slate-100 hover:border-brand-200"
            )}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredWords.map((word, index) => {
          const isFav = progress.favorites.includes(word.id);
          return (
            <div 
              key={word.id} 
              onClick={() => enterFlashCard(index)}
              className="bg-white p-6 rounded-[28px] border border-slate-100 hover:border-brand-400 hover:shadow-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-5 overflow-hidden">
                <div className={clsx(
                  "w-3 h-3 rounded-full shrink-0 shadow-sm",
                  isFav ? "bg-[#E53935]" : "bg-slate-200"
                )} />
                <div className="overflow-hidden">
                  <p className="font-black text-2xl text-slate-900 truncate group-hover:text-brand-600">{word.fr}</p>
                  <p className="text-slate-400 font-bold text-sm truncate">{word.cn}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-brand-500 transition-colors shrink-0" size={24} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
