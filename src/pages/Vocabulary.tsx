import React, { useState } from 'react';
import { vocabularyData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { TTSButton } from '../components/TTSButton';
import { ArrowLeft, Star, ChevronRight, ChevronLeft, Book, Sparkles, CheckCircle2, Flame } from 'lucide-react';
import { CEFRLevel } from '../types';
import clsx from 'clsx';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

const MOTIVATION_TEXTS = [
  "Excellent ! Continues comme ça ! 🔥",
  "Bravo ! Ton accent est super 🇫🇷",
  "Tu progresses très vite ! 🎓",
  "C'est parfait ! ✨",
  "Lâche rien ! 💪"
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
  const exitFlashCard = () => setFlashCardIndex(null);

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

  // --- FLASH CARD MODE (Non-flipping, All Content Visible) ---
  if (flashCardIndex !== null) {
    const word = filteredWords[flashCardIndex];
    
    if (!word) {
        setFlashCardIndex(null);
        return null;
    }

    const isFavorite = progress.favorites.includes(word.id);
    const hasNext = flashCardIndex < filteredWords.length - 1;
    const hasPrev = flashCardIndex > 0;
    const progressPercent = ((flashCardIndex + 1) / filteredWords.length) * 100;

    return (
      <div className="max-w-md mx-auto h-[calc(100vh-100px)] flex flex-col">
        <button onClick={exitFlashCard} className="flex items-center text-slate-500 mb-4 hover:text-brand-600 font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" /> 退出学习
        </button>
        
        {/* Progress Bar */}
        <div className="mb-4 flex items-center gap-3">
             <div className="h-2 bg-slate-100 rounded-full flex-1 overflow-hidden">
               <div className="h-full bg-gradient-to-r from-brand-400 to-accent-500 transition-all duration-300 ease-out" style={{ width: `${progressPercent}%` }} />
             </div>
             <span className="text-xs font-bold text-slate-500 whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
               <span className={clsx(
                 "mr-1",
                 selectedLevel === 'A1' && "text-blue-500",
                 selectedLevel === 'A2' && "text-green-500",
                 selectedLevel === 'B1' && "text-yellow-500",
                 selectedLevel === 'B2' && "text-orange-500",
                 selectedLevel === 'C1' && "text-red-500",
               )}>●</span>
               {selectedLevel} · {flashCardIndex + 1} / {filteredWords.length}
             </span>
        </div>

        {/* Main Card */}
        <div className="flex-1 relative group bg-white rounded-3xl shadow-xl border border-slate-100 overflow-y-auto no-scrollbar flex flex-col">
           {/* Feedback Popup */}
           {showFeedback && (
             <div className="absolute top-4 left-0 right-0 z-50 flex justify-center animate-in fade-in slide-in-from-top-2 duration-500">
               <span className="bg-white border border-brand-100 text-brand-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                 <Sparkles size={16} className="text-amber-400" /> {MOTIVATION_TEXTS[Math.floor(Math.random() * MOTIVATION_TEXTS.length)]}
               </span>
             </div>
           )}

           {/* Word Header */}
           <div className="bg-gradient-to-br from-brand-50/80 to-white p-8 pb-6 text-center border-b border-slate-50 sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex justify-center items-center gap-2 mb-2">
                <h2 className="text-5xl font-bold text-slate-800 tracking-tight break-words">{word.fr}</h2>
                <TTSButton text={word.fr} size="lg" variant="ghost" />
              </div>
              
              <div className="flex justify-center items-center gap-3">
                <span className="text-slate-400 font-mono text-lg bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">{word.ipa}</span>
              </div>
           </div>

           {/* Content Body */}
           <div className="p-6 md:p-8 space-y-8">
              {/* Meaning */}
              <div className="text-center">
                <p className="text-2xl text-slate-700 font-medium">{word.cn}</p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px bg-slate-100 flex-1"></div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Exemples</span>
                <div className="h-px bg-slate-100 flex-1"></div>
              </div>

              {/* Examples */}
              <div className="space-y-4">
                {word.examples.map((ex, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-colors group cursor-pointer"
                  >
                     <div className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <TTSButton text={ex.fr} size="sm" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-bold text-lg leading-snug group-hover:text-brand-800 transition-colors">{ex.fr}</p>
                          {ex.ipa && <p className="text-slate-400 font-mono text-xs mt-0.5">{ex.ipa}</p>}
                          <p className="text-slate-500 text-sm mt-1">{ex.cn}</p>
                        </div>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4">
           <button 
              onClick={prevCard}
              disabled={!hasPrev}
              className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 active:scale-95 transition-all"
            >
              <ChevronLeft size={24} />
            </button>

           <div className="flex-1 flex gap-3">
             <button 
               onClick={() => toggleFavorite(word.id)}
               className={clsx(
                 "flex-1 py-3 rounded-xl font-bold border-2 flex items-center justify-center gap-2 transition-all active:scale-95 text-sm md:text-base",
                 isFavorite 
                  ? "border-orange-200 bg-orange-50 text-orange-600 shadow-sm" 
                  : "border-slate-200 text-slate-500 hover:border-orange-200 hover:text-orange-500"
               )}
             >
               <Flame size={18} fill={isFavorite ? "currentColor" : "none"} />
               <span className="hidden sm:inline">{isFavorite ? "需复习" : "加强记忆"}</span>
             </button>
             
             {/* Mastered Button */}
             <button 
               onClick={nextCard}
               className="flex-1 bg-green-500 text-white border-2 border-green-500 rounded-xl font-bold hover:bg-green-600 shadow-md shadow-green-100 flex items-center justify-center gap-2 active:scale-95 transition-all text-sm md:text-base"
             >
               <CheckCircle2 size={18} />
               <span className="hidden sm:inline">已掌握</span>
               <span className="sm:hidden">Next</span>
             </button>
           </div>

            <button 
              onClick={nextCard}
              disabled={!hasNext}
              className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-slate-200 active:scale-95 transition-all"
            >
              <ChevronRight size={24} />
            </button>
        </div>
      </div>
    );
  }

  // --- LIST VIEW (Minimalist) ---
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">词汇表</h1>
          <p className="text-slate-500 mt-1">从 A1 到 C1 的必修词库</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-brand-600 font-bold bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          <Book size={16} />
          {filteredWords.length} 词
        </div>
      </header>

      {/* Level Selector */}
      <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar">
        {LEVELS.map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={clsx(
              "px-6 py-2 rounded-full font-bold transition-all whitespace-nowrap border relative",
              selectedLevel === lvl 
                ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredWords.map((word, index) => {
          const isFav = progress.favorites.includes(word.id);
          
          return (
            <div 
              key={word.id} 
              onClick={() => enterFlashCard(index)}
              className="group flex items-center justify-between p-4 bg-white border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                 <div className="w-6 flex justify-center flex-shrink-0">
                    {isFav ? <Star size={16} className="text-amber-400 fill-amber-400" /> : <span className="text-slate-300 text-xs">●</span>}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-4 flex-1 min-w-0">
                   <div className="flex items-center gap-2">
                     <span className="font-bold text-slate-900 text-lg truncate">{word.fr}</span>
                     <TTSButton text={word.fr} size="sm" className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" />
                   </div>
                   <span className="text-slate-400 text-sm font-mono truncate">{word.ipa}</span>
                 </div>
              </div>
              
              <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                <span className="text-slate-500 text-sm text-right hidden sm:block max-w-[150px] truncate">{word.cn}</span>
                <ChevronRight className="text-slate-200 group-hover:text-brand-500 transition-colors" size={18} />
              </div>
            </div>
          );
        })}
        
        {filteredWords.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 flex flex-col items-center">
            <Sparkles size={48} className="mb-4 text-slate-300" />
            <p>正在加载该级别词汇...</p>
          </div>
        )}
      </div>
    </div>
  );
}