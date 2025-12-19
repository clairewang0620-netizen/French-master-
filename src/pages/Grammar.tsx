import React, { useState } from 'react';
import { grammarData } from '../data/mockData';
import { TTSButton } from '../components/TTSButton';
import { ChevronDown, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { CEFRLevel } from '../types';
import clsx from 'clsx';

export default function Grammar() {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>('A1');
  const [openId, setOpenId] = useState<string | null>(null);

  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']; 
  const filteredGrammar = grammarData.filter(g => g.level === selectedLevel);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="text-lg font-black text-slate-800">基础语法库</h1>
        <p className="text-xs text-slate-400 font-medium">A1-C1 系统化学习</p>
      </header>

      {/* Compact Level Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {levels.map(lvl => (
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

      <div className="space-y-3">
        {filteredGrammar.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={clsx("bg-white rounded-card border transition-all overflow-hidden", isOpen ? "border-brand-200 shadow-md" : "border-slate-100 shadow-soft")}>
              <button 
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between p-4 text-left active:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={clsx("w-9 h-9 rounded-xl flex items-center justify-center transition-colors shadow-inner", isOpen ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-300")}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className={clsx("text-sm font-black tracking-tight", isOpen ? "text-brand-600" : "text-slate-800")}>{item.title}</h3>
                    <p className="text-slate-400 text-[10px] font-bold mt-0.5 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                {isOpen ? <ChevronDown size={18} className="text-brand-500" /> : <ChevronRight size={18} className="text-slate-200" />}
              </button>
              
              {isOpen && (
                <div className="px-4 pb-5 animate-in fade-in duration-300 space-y-4">
                  <div className="w-full h-px bg-slate-50" />
                  
                  {item.tips && (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-2 text-amber-700">
                      <Lightbulb className="shrink-0 text-amber-400" size={16} />
                      <p className="text-[11px] font-bold leading-relaxed">{item.tips}</p>
                    </div>
                  )}

                  <div className="text-[13px] text-slate-600 leading-relaxed space-y-2 font-medium">
                    {item.content.split('\n').map((line, i) => (
                      <p key={i} className={clsx(line.startsWith('-') && "pl-3", line.startsWith('**') && "font-black text-slate-800 mt-3")}>
                        {line.replace(/\*\*/g, '')}
                      </p>
                    ))}
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <h4 className="font-black text-[10px] uppercase text-slate-300 tracking-wider">例句 (Exemples)</h4>
                    {item.examples.map((ex, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-50">
                        <TTSButton text={ex.fr} size="sm" />
                        <div>
                          <p className="font-black text-slate-800 text-[13px] leading-tight">{ex.fr}</p>
                          <p className="text-slate-400 text-[11px] font-bold mt-0.5">{ex.cn}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}