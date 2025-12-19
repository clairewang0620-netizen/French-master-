import React, { useState } from 'react';
import { vocabularyData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, ChevronRight, ChevronLeft, Flame, CheckCircle2 } from 'lucide-react';
import { CEFRLevel } from '../types';
import clsx from 'clsx';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function Vocabulary() {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [flashCardIndex, setFlashCardIndex] = useState<number | null>(null);
  const { progress, toggleFavorite } = useUserProgress();

  const filteredWords = vocabularyData.filter(w => w.level === selectedLevel);

  const enterFlashCard = (index: number) => setFlashCardIndex(index);
  const exitFlashCard = () => setFlashCardIndex(null);

  const prevCard = () => flashCardIndex !== null && flashCardIndex > 0 && setFlashCardIndex(flashCardIndex - 1);
  const nextCard = () => {
    if (flashCardIndex !== null && flashCardIndex < filteredWords.length - 1) {
      setFlashCardIndex(flashCardIndex + 1);
    } else {
      exitFlashCard();
    }
  };

  if (flashCardIndex !== null) {
    const word = filteredWords[flashCardIndex];
    if (!word) { exitFlashCard(); return null; }

    const isFavorite = progress.favorites.includes(word.id);
    const progressPercent = ((flashCardIndex + 1) / filteredWords.length) * 100;

    const handleMemoryBoost = (e: React.MouseEvent) => {
      e.preventDefault();
      if (!isFavorite) {
        toggleFavorite(word.id);
      }
      // Mandatory flow: Auto-advance after boosting memory
      nextCard();
    };

    return (
      <div className="flex flex-col h-[calc(100vh-100px)] space-y-3 animate-in slide-in-from-right-4">
        <div className="flex items-center gap-3">
          <button onClick={exitFlashCard} className="text-slate-400 p-2 active:scale-90">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400">{flashCardIndex + 1}/{filteredWords.length}</span>
        </div>

        <div className="flex-1 bg-white rounded-card shadow-card border border-slate-50 flex flex-col p-5 text-center overflow-y-auto">
          <div className="py-4">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">{word.fr}</h2>
            <div className="flex flex-col items-center gap-2 mt-2">
              <p className="text-xs font-mono text-slate-400 font-bold tracking-tight">{word.ipa}</p>
              <TTSButton text={word.fr} size="md" />
            </div>
          </div>

          <div className="mt-4 flex-1 space-y-4">
            <p className="text-lg text-slate-700 font-bold border-b border-slate-50 pb-3">{word.cn}</p>
            
            <div className="space-y-3 text-left">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Exemples</h4>
              {word.examples.map((ex, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4">
                  <TTSButton text={ex.fr} size="sm" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-slate-800 font-bold text-[14px] leading-snug">{ex.fr}</p>
                    <p className="text-slate-500 text-[12px] mt-1 font-medium">{ex.cn}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 py-2">
           <button onClick={prevCard} disabled={flashCardIndex === 0} className="h-12 bg-slate-100 text-slate-400 rounded-btn flex items-center justify-center disabled:opacity-20 active:scale-90 transition-all">
             <ChevronLeft size={24} />
           </button>
           
           <button 
             onClick={handleMemoryBoost}
             className={clsx(
               "col-span-1 h-12 rounded-btn flex items-center justify-center transition-all active:scale-95 shadow-soft border",
               "bg-[#FF4C4C] text-white border-[#FF4C4C]" // Explicit requested red (#FF4C4C)
             )}
           >
             <Flame size={20} fill="white" />
             <span className="ml-1 text-[11px] font-bold">加强</span>
           </button>

           <button onClick={nextCard} className="col-span-2 h-12 bg-slate-900 text-white rounded-btn font-black text-xs flex items-center justify-center gap-2 active:scale-95 shadow-md">
             <CheckCircle2 size={18} /> 认识
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <header className="flex items-center justify-between pb-1">
        <h1 className="text-lg font-black text-slate-900">核心词汇库</h1>
        <div className="text-[9px] text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">
          {filteredWords.length} Words
        </div>
      </header>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {LEVELS.map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={clsx(
              "px-4 py-1.5 rounded-full font-black text-[11px] transition-all border shrink-0",
              selectedLevel === lvl ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white text-slate-400 border-slate-100"
            )}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="space-y-2 pt-1">
        {filteredWords.map((word, index) => {
          const isFav = progress.favorites.includes(word.id);
          return (
            <div 
              key={word.id} 
              onClick={() => enterFlashCard(index)}
              className="bg-white p-3.5 rounded-card border border-slate-100 shadow-soft active:bg-slate-50 flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", isFav ? "bg-[#FF4C4C]" : "bg-slate-200")} />
                <div className="overflow-hidden">
                  <p className="font-bold text-[14px] text-slate-800 truncate">{word.fr}</p>
                  <p className="text-slate-400 font-medium text-[11px] truncate">{word.cn}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-brand-500 shrink-0" size={16} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
