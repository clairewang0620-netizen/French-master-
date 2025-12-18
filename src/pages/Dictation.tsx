import React, { useState, useEffect } from 'react';
import { vocabularyData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { TTSButton } from '../components/TTSButton';
import { Check, X, ArrowRight, RotateCcw, ChevronLeft, LayoutGrid, Trophy } from 'lucide-react';
import clsx from 'clsx';

const WORDS_PER_GROUP = 10;
const TOTAL_GROUPS = Math.ceil(vocabularyData.length / WORDS_PER_GROUP);

export default function Dictation() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [sessionQueue, setSessionQueue] = useState<typeof vocabularyData>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [sessionFinished, setSessionFinished] = useState(false);
  
  const { addDictationError, removeDictationError } = useUserProgress();

  const startGroup = (groupIndex: number) => {
    const start = groupIndex * WORDS_PER_GROUP;
    const end = start + WORDS_PER_GROUP;
    const groupWords = vocabularyData.slice(start, end);
    
    setSelectedGroup(groupIndex);
    setSessionQueue(groupWords);
    setCurrentIndex(0);
    setInput('');
    setStatus('idle');
    setSessionFinished(false);
  };

  const handleNext = () => {
    if (currentIndex < sessionQueue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setInput('');
      setStatus('idle');
    } else {
      setSessionFinished(true);
    }
  };

  const checkAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== 'idle') return;

    const normalizedInput = input.trim().toLowerCase().replace(/[.,!?;]/g, "");
    const normalizedTarget = sessionQueue[currentIndex].fr.toLowerCase().replace(/[.,!?;]/g, "");

    if (normalizedInput === normalizedTarget) {
      setStatus('correct');
      removeDictationError(sessionQueue[currentIndex].id);
    } else {
      setStatus('incorrect');
      addDictationError(sessionQueue[currentIndex].id);
    }
  };

  // --- Group Selection View ---
  if (selectedGroup === null) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">听写实验室 (Dictée)</h1>
          <p className="text-slate-500 font-medium">覆盖 A1-C1 全词库，共 300 词，按组突破。</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Array.from({ length: TOTAL_GROUPS }).map((_, i) => (
            <button
              key={i}
              onClick={() => startGroup(i)}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-brand-500 hover:shadow-lg transition-all text-center group"
            >
              <div className="text-slate-400 text-xs font-bold uppercase mb-2 group-hover:text-brand-500">Groupe</div>
              <div className="text-2xl font-black text-slate-800">{i + 1}</div>
              <div className="mt-2 text-[10px] text-slate-400 font-medium">
                {vocabularyData[i * WORDS_PER_GROUP].fr}...
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Finished View ---
  if (sessionFinished) {
    return (
      <div className="max-w-xl mx-auto text-center pt-10 animate-in zoom-in duration-300">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
           <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Trophy size={48} />
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-4">Génial ! 第 {selectedGroup + 1} 组完成</h2>
           <p className="text-slate-500 mb-10 text-lg">您已完成本组听写，错误单词已自动存入错题本。</p>
           <div className="flex flex-col gap-4">
             <button 
               onClick={() => startGroup(selectedGroup)} 
               className="bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
             >
               <RotateCcw size={20} /> 再练一遍
             </button>
             <button 
               onClick={() => setSelectedGroup(null)} 
               className="bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
             >
               <LayoutGrid size={20} /> 返回选择分组
             </button>
           </div>
        </div>
      </div>
    );
  }

  const currentWord = sessionQueue[currentIndex];

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-10">
      <header className="flex justify-between items-center">
        <button 
          onClick={() => setSelectedGroup(null)} 
          className="p-2 bg-white rounded-full border border-slate-200 text-slate-400 hover:text-brand-600 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
           <h1 className="text-xl font-black text-slate-900">第 {selectedGroup + 1} 组</h1>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dictée Lab</p>
        </div>
        <div className="bg-brand-500 text-white px-3 py-1 rounded-full font-black text-xs shadow-sm">
           {currentIndex + 1} / {sessionQueue.length}
        </div>
      </header>

      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 text-center relative overflow-hidden">
         {/* Progress Bar */}
         <div className="h-1.5 bg-slate-50 w-full absolute top-0 left-0">
            <div className="h-full bg-brand-500 transition-all duration-700" style={{ width: `${((currentIndex + 1) / sessionQueue.length) * 100}%` }}></div>
         </div>

         <div className="mb-14 mt-6">
           <div className="flex justify-center mb-10">
             {/* Fix: removed variant prop which is not defined in TTSButtonProps interface */}
             <TTSButton 
               text={currentWord.fr} 
               size="lg" 
               className="w-24 h-24 shadow-2xl shadow-brand-200 bg-brand-600 hover:bg-brand-500" 
             />
           </div>
           <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-3">提示 (Indication)</p>
           <h2 className="text-3xl font-bold text-slate-700">{currentWord.cn}</h2>
         </div>

         <form onSubmit={checkAnswer} className="space-y-6">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             disabled={status !== 'idle'}
             autoFocus
             placeholder="在此键入法语单词..."
             className={clsx(
               "w-full text-center text-3xl p-6 rounded-2xl border-2 outline-none transition-all font-black shadow-inner",
               status === 'idle' && "border-slate-100 bg-slate-50 focus:border-brand-500 focus:bg-white",
               status === 'correct' && "border-green-500 bg-green-50 text-green-700",
               status === 'incorrect' && "border-red-500 bg-red-50 text-red-700"
             )}
             autoCapitalize="none"
             autoComplete="off"
             spellCheck={false}
           />

           {status === 'idle' && (
             <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl">
               确认拼写 (Valider)
             </button>
           )}
         </form>

         {status !== 'idle' && (
           <div className="mt-10 animate-in slide-in-from-bottom-6 duration-500">
             {status === 'correct' ? (
               <div className="bg-green-500 text-white p-6 rounded-3xl shadow-lg flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={28} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-xl">正确 !</p>
                      <p className="text-green-100 text-sm font-medium">Bien joué.</p>
                    </div>
                 </div>
                 <button onClick={handleNext} className="bg-white text-green-600 px-8 py-3 rounded-xl font-black shadow-sm">
                    下一步
                 </button>
               </div>
             ) : (
               <div className="space-y-4">
                  <div className="bg-red-50 border border-red-100 p-8 rounded-[2rem] text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <X size={28} />
                    </div>
                    <p className="text-slate-400 text-sm font-bold uppercase mb-2">拼写错误，正确应为：</p>
                    <p className="text-4xl font-black text-brand-600">{currentWord.fr}</p>
                    <p className="text-slate-400 font-mono text-sm mt-3">{currentWord.ipa}</p>
                  </div>
                  <button 
                    onClick={handleNext} 
                    className="w-full bg-brand-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-2 hover:bg-brand-700 shadow-xl"
                  >
                    继续前进 <ArrowRight size={20} />
                  </button>
               </div>
             )}
           </div>
         )}
      </div>
    </div>
  );
}
