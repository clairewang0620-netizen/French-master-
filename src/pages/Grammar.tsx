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

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">基础语法库</h1>
        <p className="text-slate-600 mt-1">从 A1 到 C1 的完整语法解析</p>
      </header>

      {/* Level Tabs */}
      <div className="border-b border-slate-200 flex gap-4 overflow-x-auto no-scrollbar">
        {levels.map(lvl => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={clsx(
              "pb-3 px-6 font-bold text-lg transition-all border-b-4 rounded-t-lg whitespace-nowrap",
              selectedLevel === lvl 
                ? "border-brand-500 text-brand-600 bg-brand-50" 
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filteredGrammar.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={clsx("bg-white rounded-3xl border transition-all duration-300 overflow-hidden", isOpen ? "border-brand-200 shadow-xl ring-1 ring-brand-100" : "border-slate-200 shadow-sm hover:border-brand-200 hover:shadow-md")}>
              <button 
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm flex-shrink-0", isOpen ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400")}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className={clsx("text-xl font-bold transition-colors", isOpen ? "text-brand-700" : "text-slate-800")}>{item.title}</h3>
                    <p className="text-slate-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                  </div>
                </div>
                {isOpen ? <ChevronDown className="text-brand-500 flex-shrink-0" /> : <ChevronRight className="text-slate-300 flex-shrink-0" />}
              </button>
              
              {isOpen && (
                <div className="p-8 pt-0 bg-white animate-in fade-in duration-300">
                  <div className="w-full h-px bg-slate-100 mb-6" />
                  
                  {/* Tips Section if exists */}
                  {item.tips && (
                    <div className="mb-6 bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800">
                      <Lightbulb className="flex-shrink-0 text-amber-500" size={20} />
                      <p className="text-sm font-medium leading-relaxed">{item.tips}</p>
                    </div>
                  )}

                  {/* Explanation Area */}
                  <div className="mb-8 prose prose-slate max-w-none text-slate-700 leading-8">
                    {/* Render content with simple formatting preservation */}
                    {item.content.split('\n').map((line, i) => (
                      <p key={i} className={clsx("mb-2", line.startsWith('-') && "pl-4", line.startsWith('**') && "font-bold text-slate-900 mt-4")}>
                        {line.replace(/\*\*/g, '')}
                      </p>
                    ))}
                  </div>
                  
                  {/* Examples Area */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-2">
                      <span className="w-8 h-px bg-slate-200"></span> Exemples (例句)
                    </h4>
                    {item.examples.map((ex, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all group">
                        <div className="mt-1 flex-shrink-0">
                          <TTSButton text={ex.fr} size="sm" />
                        </div>
                        <div>
                          <p className="font-bold text-brand-900 text-lg group-hover:text-brand-600 transition-colors">{ex.fr}</p>
                          <p className="text-slate-500 mt-1">{ex.cn}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filteredGrammar.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
            <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 text-lg">该级别内容即将上线</p>
            <p className="text-slate-300 text-sm mt-2">Contenu bientôt disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}