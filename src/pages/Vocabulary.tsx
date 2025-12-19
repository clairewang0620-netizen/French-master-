import React, { useState } from 'react';
import { vocabularyData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, ChevronRight, ChevronLeft, Flame, CheckCircle2, Bookmark } from 'lucide-react';
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
  const nextCard = () => flashCardIndex !== null && flashCardIndex < filteredWords.length - 1 && setFlashCardIndex(flashCardIndex + 1);

  if (flashCardIndex !== null) {
    const word = filteredWords[flashCardIndex];
    if (!word) { exitFlashCard(); return null; }

    const isFavorite = progress.favorites.includes(word.id);
    const progressPercent = ((flashCardIndex + 1) / filteredWords.length) * 100;

    return (
      <div className="flex flex-col h-[calc(100vh-80px)] space-y-4 animate-in slide-in-from-right-4">
        <div className="flex items-center justify-between">
          <button onClick={exitFlashCard} className="text-slate-400 hover:text-slate-600 p-1">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-brand-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400">{flashCardIndex + 1}/{filteredWords.length}</span>
        </div>

        <div className="flex-1 bg-white rounded-card shadow-soft border border-slate-100 flex flex-col p-6 text-center">
          <div className="pt-8 space-y-4">
            <h2 className="text-4xl font-black text-slate-900 leading-tight">{word.fr}</h2>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-mono text-slate-400 font-bold">{word.ipa}</p>
              <TTSButton text={word.fr} size="md" label="发音" />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center mt-6">
            <p className="text-xl text-slate-700 font-bold">{word.cn}</p>
            <div className="mt-8 space-y-3 text-left">
              {word.examples.slice(0, 2).map((ex, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-slate-800 font-bold text-sm leading-snug">{ex.fr}</p>
                  <p className="text-slate-500 text-xs mt-1">{ex.cn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 pb-6">
           <button onClick={prevCard} disabled={flashCardIndex === 0} className="h-12 bg-slate-100 text-slate-400 rounded-btn flex items-center justify-center disabled:opacity-20 active:scale-90 transition-all">
             <ChevronLeft size={24} />
           </button>
           <button 
             onClick={() => toggleFavorite(word.id)}
             className={clsx(
               "col-span-1 h-12 rounded-btn flex items-center justify-center transition-all active:scale-95",
               isFavorite ? "bg-[#E53935] text-white shadow-md shadow-red-100" : "bg-slate-100 text-slate-400"
             )}
           >
             <Flame size={20} fill={isFavorite ? "currentColor" : "none"} />
           </button>
           <button onClick={nextCard} className="col-span-2 h-12 bg-slate-900 text-white rounded-btn font-black text-sm flex items-center justify-center gap-2 active:scale-95 shadow-lg">
             掌握并继续
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-black text-slate-800">核心词汇库</h1>
        <div className="text-[10px] text-brand-500 bg-brand-50 px-3 py-1 rounded-full font-black uppercase">
          {filteredWords.length} Words
        </div>
      </header>

      {/* Level Tabs - More Compact */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {LEVELS.map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={clsx(
              "px-5 py-2 rounded-full font-black text-xs transition-all border",
              selectedLevel === lvl 
                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                : "bg-white text-slate-400 border-slate-100"
            )}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Compact List View */}
      <div className="space-y-2">
        {filteredWords.map((word, index) => {
          const isFav = progress.favorites.includes(word.id);
          return (
            <div 
              key={word.id} 
              onClick={() => enterFlashCard(index)}
              className="bg-white p-4 rounded-card border border-slate-50 shadow-soft active:bg-slate-50 flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  isFav ? "bg-[#E53935]" : "bg-slate-200"
                )} />
                <div>
                  <p className="font-black text-base text-slate-800">{word.fr}</p>
                  <p className="text-slate-400 font-bold text-[11px] mt-0.5">{word.cn}</p>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-brand-500" size={18} />
            </div>
          );
        })}
      </div>
    </div>
  );
}