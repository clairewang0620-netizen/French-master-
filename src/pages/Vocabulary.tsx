import React, { useState } from 'react';
import { vocabularyData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, ChevronLeft, Flame, CheckCircle2 } from 'lucide-react';
import { CEFRLevel } from '../types';
import clsx from 'clsx';

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

  const handleMemoryBoost = (wordId: string) => {
    // Add to favorites if not already there
    if (!progress.favorites.includes(wordId)) {
      toggleFavorite(wordId);
    }
    // UX Logic: Immediately move to next card for high efficiency
    nextCard();
  };

  if (flashCardIndex !== null) {
    const word = filteredWords[flashCardIndex];

    return (
      <div className="flex flex-col h-[calc(100vh-100px)] space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={exitFlashCard} className="text-slate-400 p-2 active:scale-90 transition-transform"><ArrowLeft size={20} /></button>
          <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((flashCardIndex + 1) / filteredWords.length) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-card shadow-lg p-6 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{word.fr}</h2>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-slate-400 font-mono">{word.ipa}</p>
            <TTSButton text={word.fr} audioUrl={word.audio} size="md" />
          </div>
          <p className="text-xl text-slate-700 font-bold mt-4">{word.cn}</p>

          <div className="w-full mt-8 space-y-3 text-left overflow-y-auto max-h-48 px-2">
            <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">例句 (Exemples)</p>
            {word.examples.map((ex, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl flex items-start gap-3 border border-slate-100">
                <TTSButton text={ex.fr} audioUrl={ex.audio} size="sm" />
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{ex.fr}</p>
                  <p className="text-[11px] text-slate-500 mt-1">{ex.cn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 py-4">
           <button 
             onClick={prevCard} 
             disabled={flashCardIndex === 0} 
             className="h-12 bg-slate-100 text-slate-400 rounded-btn flex items-center justify-center disabled:opacity-20 active:bg-slate-200 transition-colors"
           >
             <ChevronLeft size={24} />
           </button>
           
           <button 
             onClick={() => handleMemoryBoost(word.id)}
             className="col-span-1 h-12 bg-danger text-white rounded-btn flex items-center justify-center shadow-lg active:scale-95 transition-transform"
             title="加强记忆"
           >
             <Flame size={20} fill="white" />
           </button>

           <button 
             onClick={nextCard} 
             className="col-span-2 h-12 bg-slate-900 text-white rounded-btn font-black flex items-center justify-center gap-2 active:scale-95 transition-transform"
           >
             <CheckCircle2 size={18} /> 下一个
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h1 className="text-xl font-black text-slate-900">核心词汇</h1>
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {['A1', 'A2', 'B1', 'B2', 'C1'].map(lvl => (
          <button 
            key={lvl} 
            onClick={() => setSelectedLevel(lvl as CEFRLevel)}
            className={clsx(
              "px-5 py-2 rounded-full font-black text-xs border transition-all", 
              selectedLevel === lvl ? "bg-slate-900 text-white border-slate-900 shadow-sm" : "bg-white text-slate-400 border-slate-100"
            )}
          >
            {lvl}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {filteredWords.map((word, i) => (
          <button 
            key={word.id} 
            onClick={() => enterFlashCard(i)} 
            className="bg-white p-4 rounded-xl border border-slate-50 shadow-soft flex items-center justify-between active:scale-98 transition-transform group"
          >
            <div className="text-left">
              <p className="font-bold text-slate-800 group-hover:text-brand-500 transition-colors">{word.fr}</p>
              <p className="text-xs text-slate-400">{word.cn}</p>
            </div>
            <div className="flex items-center gap-3">
              <TTSButton text={word.fr} audioUrl={word.audio} size="sm" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
