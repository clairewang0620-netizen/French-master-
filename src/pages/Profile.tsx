import React from 'react';
import { useUserProgress } from '../lib/store';
import { vocabularyData } from '../data/mockData';
import { TTSButton } from '../components/TTSButton';
import { Trophy, AlertCircle, BookHeart } from 'lucide-react';

export default function Profile() {
  const { progress } = useUserProgress();

  const favoriteWords = vocabularyData.filter(w => progress.favorites.includes(w.id));
  const difficultWords = vocabularyData.filter(w => progress.dictationErrors.includes(w.id));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black text-slate-900">我的</h1>
      </header>

      <div className="grid grid-cols-1 gap-3">
        <div className="bg-brand-500 text-white p-5 rounded-card shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] text-white/80 font-bold uppercase tracking-widest">总积分</p>
            <h3 className="text-3xl font-black">{Object.values(progress.examScores).reduce((a: number, b: number) => a + b, 0)} pts</h3>
          </div>
          <Trophy className="opacity-40" size={48} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-card border border-slate-100 shadow-soft">
            <BookHeart className="mb-2 text-rose-500" size={24} />
            <h3 className="text-xl font-black text-slate-800">{progress.favorites.length}</h3>
            <p className="text-[10px] text-slate-400 font-bold">收藏词汇</p>
          </div>
          <div className="bg-white p-4 rounded-card border border-slate-100 shadow-soft">
            <AlertCircle className="mb-2 text-orange-500" size={24} />
            <h3 className="text-xl font-black text-slate-800">{progress.dictationErrors.length}</h3>
            <p className="text-[10px] text-slate-400 font-bold">待复习</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <BookHeart size={18} className="text-rose-500" /> 
            加强记忆词库
          </h2>
          <div className="space-y-2">
            {favoriteWords.length === 0 ? (
              <p className="text-slate-400 text-xs italic bg-slate-50 p-4 rounded-xl text-center">暂无收藏单词。</p>
            ) : (
              favoriteWords.map(w => (
                <div key={w.id} className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-xl shadow-soft">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Fix: Added missing audioUrl prop */}
                    <TTSButton text={w.fr} audioUrl={w.audio} size="sm" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-800 truncate">{w.fr}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{w.cn}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-slate-300 ml-2">{w.level}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
            <AlertCircle size={18} className="text-orange-500" /> 
            听写错题本
          </h2>
          <div className="space-y-2">
            {difficultWords.length === 0 ? (
              <p className="text-slate-400 text-xs italic bg-slate-50 p-4 rounded-xl text-center">太棒了！暂无错题。</p>
            ) : (
              difficultWords.map(w => (
                <div key={w.id} className="flex items-center justify-between p-3.5 bg-red-50/50 border border-red-100 rounded-xl shadow-soft">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Fix: Added missing audioUrl prop */}
                    <TTSButton text={w.fr} audioUrl={w.audio} size="sm" />
                    <div className="overflow-hidden">
                      <p className="font-bold text-red-900 truncate">{w.fr}</p>
                      <p className="text-[10px] text-red-700/60 font-medium truncate">{w.cn}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase text-red-200 ml-2">{w.level}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}