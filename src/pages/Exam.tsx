
import React, { useState } from 'react';
import { examData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { CEFRLevel } from '../types';
import clsx from 'clsx';
// Added AlertCircle to the imports
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, Target, ShieldCheck, AlertCircle } from 'lucide-react';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function Exam() {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const { addExamError, saveExamScore } = useUserProgress();

  const filteredQuestions = selectedLevel 
    ? examData.filter(q => q.level === selectedLevel).slice(0, 10) 
    : [];

  const handleStartExam = (level: CEFRLevel) => {
    setSelectedLevel(level);
    setCurrentQuestionIdx(0);
    setScore(0);
    setFinished(false);
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const question = filteredQuestions[currentQuestionIdx];
    const isCorrect = selectedOption === question.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      addExamError(question.id);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < filteredQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setFinished(true);
      saveExamScore(`exam_${selectedLevel}`, score);
    }
  };

  // --- Level Selection View ---
  if (!selectedLevel) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <header className="max-w-2xl">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">等级考试 (Examens)</h1>
          <p className="text-lg text-slate-500 font-medium">全级别 50 道精选试题，每个级别 10 题。测试您的法语实战水平。</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => handleStartExam(lvl)}
              className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-brand-500 hover:shadow-2xl transition-all group relative overflow-hidden text-left"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-brand-50 transition-colors"></div>
              <div className="text-xs font-black uppercase text-slate-400 mb-2">Niveau</div>
              <div className="text-4xl font-black text-slate-900 mb-4">{lvl}</div>
              <p className="text-slate-500 text-sm mb-6">10 道语法、句法及词汇综合测试题。</p>
              <div className="flex items-center gap-2 text-brand-600 font-bold group-hover:gap-4 transition-all">
                 开始考试 <ArrowRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- Exam Results View ---
  if (finished) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    return (
      <div className="max-w-xl mx-auto pt-10 animate-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-slate-100">
          <div className="w-24 h-24 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">考试完成 !</h2>
          <p className="text-slate-500 mb-10 font-medium">Niveau {selectedLevel} · 最终成绩如下</p>
          
          <div className="text-7xl font-black text-slate-900 mb-4">
            {score} <span className="text-3xl text-slate-300">/ {filteredQuestions.length}</span>
          </div>
          
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-12 shadow-inner">
            <div className="h-full bg-brand-500" style={{ width: `${percentage}%` }}></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <button onClick={() => handleStartExam(selectedLevel)} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-slate-800 shadow-lg">
               <RotateCcw size={20} /> 重新测试
             </button>
             <button onClick={() => setSelectedLevel(null)} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-5 rounded-2xl font-bold hover:bg-slate-200">
               返回等级选择
             </button>
          </div>
        </div>
      </div>
    );
  }

  const question = filteredQuestions[currentQuestionIdx];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-500 text-white rounded-xl flex items-center justify-center font-black">
            {currentQuestionIdx + 1}
          </div>
          <span className="font-bold text-slate-400">/ {filteredQuestions.length}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-500 font-black text-sm uppercase tracking-widest border border-slate-100">
           <ShieldCheck size={18} className="text-brand-500" />
           Niveau {selectedLevel}
        </div>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-xl border border-slate-100 relative">
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-10 leading-snug">{question.question}</h2>

        <div className="space-y-4">
          {question.options?.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === question.correctAnswer;
            
            let btnClass = "border-slate-100 bg-slate-50 hover:border-brand-300 hover:bg-white";
            let indicator = null;

            if (isSubmitted) {
              if (isCorrect) {
                 btnClass = "bg-green-500 border-green-500 text-white shadow-lg shadow-green-100";
                 indicator = <CheckCircle className="text-white" size={24} />;
              } else if (isSelected && !isCorrect) {
                 btnClass = "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100";
                 indicator = <XCircle className="text-white" size={24} />;
              } else {
                 btnClass = "opacity-30 border-slate-100 grayscale";
              }
            } else if (isSelected) {
              btnClass = "border-brand-500 bg-white text-brand-600 shadow-xl shadow-brand-50 ring-2 ring-brand-500";
            }

            return (
              <button
                key={option}
                onClick={() => !isSubmitted && setSelectedOption(option)}
                className={clsx("w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-xl flex justify-between items-center group", btnClass)}
                disabled={isSubmitted}
              >
                {option}
                {indicator}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className={clsx("mt-10 p-8 rounded-[2rem] border-2 animate-in slide-in-from-top-4 duration-500", selectedOption === question.correctAnswer ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100")}>
            <div className="flex items-start gap-5">
              <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm", selectedOption === question.correctAnswer ? "bg-green-500 text-white" : "bg-red-500 text-white")}>
                {selectedOption === question.correctAnswer ? <Target size={24} /> : <AlertCircle size={24} />}
              </div>
              <div className="space-y-2">
                <p className={clsx("font-black text-xl", selectedOption === question.correctAnswer ? "text-green-800" : "text-red-800")}>
                  {selectedOption === question.correctAnswer ? "精妙绝伦 (Correct)" : "略有偏差 (Incorrect)"}
                </p>
                <p className="text-slate-600 leading-relaxed font-medium">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={isSubmitted ? handleNext : handleSubmit}
        disabled={!selectedOption}
        className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98]"
      >
        {isSubmitted ? (currentQuestionIdx === filteredQuestions.length - 1 ? "完成本级测试" : "下一题") : "确认选择 (Valider)"} 
        {isSubmitted && <ArrowRight size={24} />}
      </button>
    </div>
  );
}
