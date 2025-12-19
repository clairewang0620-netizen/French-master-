import React, { useState } from 'react';
import { examData } from '../data/mockData';
import { useUserProgress } from '../lib/store';
import { CEFRLevel } from '../types';
import clsx from 'clsx';
// Added missing ChevronRight import
import { CheckCircle, XCircle, Trophy, ArrowRight, RotateCcw, Target, AlertCircle, ChevronRight } from 'lucide-react';

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function Exam() {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const { addExamError, saveExamScore } = useUserProgress();

  const filteredQuestions = selectedLevel ? examData.filter(q => q.level === selectedLevel).slice(0, 10) : [];

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
    if (selectedOption === filteredQuestions[currentQuestionIdx].correctAnswer) {
      setScore(prev => prev + 1);
    } else {
      addExamError(filteredQuestions[currentQuestionIdx].id);
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

  if (!selectedLevel) {
    return (
      <div className="space-y-6 animate-in fade-in">
        <header>
          <h1 className="text-lg font-black text-slate-800">等级考试</h1>
          <p className="text-xs text-slate-400 font-medium">全方位评测 · 每个级别 10 题</p>
        </header>

        <div className="grid gap-3">
          {LEVELS.map(lvl => (
            <button
              key={lvl}
              onClick={() => handleStartExam(lvl)}
              className="bg-white p-5 rounded-card border border-slate-100 shadow-soft flex items-center justify-between active:scale-95 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg font-black text-brand-500 shadow-inner">
                  {lvl}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-slate-800">Niveau {lvl} 实战测试</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">语法与词汇综合</p>
                </div>
              </div>
              <ChevronRight className="text-slate-200 group-hover:text-brand-500" size={18} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    return (
      <div className="max-w-xl mx-auto py-8 animate-in zoom-in text-center space-y-8">
        <div className="bg-white p-8 rounded-card shadow-soft border border-slate-50">
          <div className="w-16 h-16 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-800">测试完成 !</h2>
          <div className="text-5xl font-black text-slate-900 my-6">
            {score}<span className="text-lg text-slate-300">/10</span>
          </div>
          <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden mb-8">
            <div className="h-full bg-brand-500" style={{ width: `${percentage}%` }}></div>
          </div>
          <div className="flex flex-col gap-3">
             <button onClick={() => handleStartExam(selectedLevel)} className="h-12 bg-slate-900 text-white rounded-btn font-black text-sm flex items-center justify-center gap-2 active:scale-95">
               <RotateCcw size={18} /> 重新测试
             </button>
             <button onClick={() => setSelectedLevel(null)} className="h-12 bg-slate-100 text-slate-500 rounded-btn font-black text-sm active:bg-slate-200">
               返回等级选择
             </button>
          </div>
        </div>
      </div>
    );
  }

  const question = filteredQuestions[currentQuestionIdx];

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-50 shadow-soft">
        <span className="text-xs font-black text-slate-400">Question {currentQuestionIdx + 1}/10</span>
        <span className="text-[10px] font-black uppercase text-brand-500 px-3 py-1 bg-brand-50 rounded-full">Niveau {selectedLevel}</span>
      </div>

      <div className="bg-white p-6 rounded-card shadow-soft border border-slate-50 space-y-6">
        <h2 className="text-lg font-black text-slate-800 leading-snug">{question.question}</h2>

        <div className="space-y-2.5">
          {question.options?.map((option) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === question.correctAnswer;
            
            let btnClass = "border-slate-50 bg-slate-50 active:bg-slate-100";
            let icon = null;

            if (isSubmitted) {
              if (isCorrect) {
                 btnClass = "bg-green-500 border-green-500 text-white";
                 icon = <CheckCircle size={18} />;
              } else if (isSelected && !isCorrect) {
                 btnClass = "bg-red-500 border-red-500 text-white";
                 icon = <XCircle size={18} />;
              } else {
                 btnClass = "opacity-20 grayscale cursor-not-allowed";
              }
            } else if (isSelected) {
              btnClass = "border-brand-500 bg-brand-50 text-brand-700 shadow-inner";
            }

            return (
              <button
                key={option}
                onClick={() => !isSubmitted && setSelectedOption(option)}
                className={clsx("w-full text-left p-4 rounded-xl border-2 transition-all font-bold text-sm flex justify-between items-center", btnClass)}
                disabled={isSubmitted}
              >
                {option}
                {icon}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className={clsx("p-4 rounded-xl text-[12px] font-medium leading-relaxed animate-in slide-in-from-top-2", selectedOption === question.correctAnswer ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
            <p className="font-black mb-1 flex items-center gap-1.5">
              {selectedOption === question.correctAnswer ? <Target size={14} /> : <AlertCircle size={14} />}
              {selectedOption === question.correctAnswer ? "Correct !" : "Oups !"}
            </p>
            {question.explanation}
          </div>
        )}
      </div>

      <button 
        onClick={isSubmitted ? handleNext : handleSubmit}
        disabled={!selectedOption}
        className="w-full bg-slate-900 text-white h-12 rounded-btn font-black text-sm disabled:opacity-30 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2"
      >
        {isSubmitted ? (currentQuestionIdx === 9 ? "查看结果" : "下一题") : "确认选择"} 
        <ArrowRight size={18} />
      </button>
    </div>
  );
}