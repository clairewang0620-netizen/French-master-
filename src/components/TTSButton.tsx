import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakFrench } from '../lib/tts';
import { clsx } from 'clsx';

interface TTSButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({ text, size = 'md', className, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    setIsPlaying(true);
    await speakFrench(text);
    
    // Safety timeout to reset state
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 22
  };

  const heights = {
    sm: 'h-9 px-3',
    md: 'h-11 px-5', // Reached approx 44px
    lg: 'h-12 px-6'
  };

  return (
    <button 
      onClick={handlePlay} 
      className={clsx(
        "flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-95 shadow-soft",
        "bg-[#7ED957] hover:bg-[#6ec948] rounded-btn shrink-0",
        heights[size],
        isPlaying && "ring-4 ring-[#7ED957]/20",
        className
      )}
      aria-label="Play pronunciation"
    >
      <Volume2 size={iconSizes[size]} fill="white" />
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
};