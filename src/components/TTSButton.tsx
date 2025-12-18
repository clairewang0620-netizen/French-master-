
import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakFrench, tts } from '../lib/tts';
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
    
    // We don't have a reliable per-utterance callback in simple speakFrench, 
    // so we simulate the active state or just stop it if it's already playing elsewhere.
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26
  };

  const heights = {
    sm: 'h-11 px-4',
    md: 'h-12 px-6',
    lg: 'h-14 px-8'
  };

  return (
    <button 
      onClick={handlePlay} 
      className={clsx(
        "flex items-center justify-center gap-2 font-bold text-white transition-all active:scale-95 shadow-md",
        "bg-[#7ED957] hover:bg-[#6ec948] rounded-[24px]",
        heights[size],
        isPlaying && "ring-4 ring-[#7ED957]/30",
        className
      )}
      aria-label="Play pronunciation"
    >
      <Volume2 size={iconSizes[size]} fill="white" />
      {label && <span className="text-sm">{label}</span>}
    </button>
  );
};
