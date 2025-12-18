import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

const STORAGE_KEY = 'lumiere_french_progress_v1';

const defaultProgress: UserProgress = {
  favorites: [],
  dictationErrors: [],
  examErrors: [],
  completedReadings: [],
  examScores: {}
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(() => {
    if (typeof window === 'undefined') return defaultProgress;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProgress;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const toggleFavorite = (id: string) => {
    setProgress(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id) 
        ? prev.favorites.filter(fid => fid !== id)
        : [...prev.favorites, id]
    }));
  };

  const addDictationError = (id: string) => {
    if (!progress.dictationErrors.includes(id)) {
      setProgress(prev => ({ ...prev, dictationErrors: [...prev.dictationErrors, id] }));
    }
  };

  const removeDictationError = (id: string) => {
    setProgress(prev => ({ ...prev, dictationErrors: prev.dictationErrors.filter(eid => eid !== id) }));
  };
  
  const addExamError = (id: string) => {
     if (!progress.examErrors.includes(id)) {
      setProgress(prev => ({ ...prev, examErrors: [...prev.examErrors, id] }));
    }
  };

  const saveExamScore = (examId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      examScores: { ...prev.examScores, [examId]: score }
    }));
  };

  return { 
    progress, 
    toggleFavorite, 
    addDictationError, 
    removeDictationError,
    addExamError,
    saveExamScore
  };
}
