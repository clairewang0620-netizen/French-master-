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
        <h1 className="text-3xl font-bold text-slate-900">Mon Profil</h1>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white p-6 rounded-2xl shadow-lg">
          <Trophy className="mb-4 opacity-80" size={32} />
          <h3 className="text-3xl font-bold">{Object.values(progress.examScores).reduce((a: number, b: number) => a + b, 0)} pts</h3>
          <p className="text-brand-100">Score Total</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <BookHeart className="mb-4 text-pink-500" size={32} />
          <h3 className="text-3xl font-bold text-slate-800">{progress.favorites.length}</h3>
          <p className="text-slate-500">Mots favoris</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <AlertCircle className="mb-4 text-orange-500" size={32} />
          <h3 className="text-3xl font-bold text-slate-800">{progress.dictationErrors.length}</h3>
          <p className="text-slate-500">Mots à réviser</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookHeart size={20} className="text-pink-500" /> 
            Mes Mots Favoris
          </h2>
          <div className="space-y-2">
            {favoriteWords.length === 0 ? (
              <p className="text-slate-400 text-sm italic">Pas encore de favoris.</p>
            ) : (
              favoriteWords.map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TTSButton text={w.fr} size="sm" />
                    <span className="font-bold text-slate-800">{w.fr}</span>
                  </div>
                  <span className="text-slate-500 text-sm">{w.cn}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle size={20} className="text-orange-500" /> 
            Carnet d'Erreurs (Dictée)
          </h2>
          <div className="space-y-2">
            {difficultWords.length === 0 ? (
              <p className="text-slate-400 text-sm italic">Bravo ! Aucune erreur enregistrée.</p>
            ) : (
              difficultWords.map(w => (
                <div key={w.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TTSButton text={w.fr} size="sm" />
                    <span className="font-bold text-red-900">{w.fr}</span>
                  </div>
                  <span className="text-red-700 text-sm">{w.cn}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}