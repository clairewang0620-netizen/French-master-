import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { tts, speakFrench } from '../lib/tts';
import { clsx } from 'clsx';

interface TTSButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({ text, size = 'md', className }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    // Explicit unlock on user gesture
    tts.unlock();
    
    setIsPlaying(true);
    await speakFrench(text);
    
    // Animation/Feedback duration
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 24
  };

  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  return (
    <button 
      onClick={handlePlay} 
      className={clsx(
        "flex items-center justify-center text-white transition-all active:scale-90 shadow-md",
        "bg-[#7ED957] hover:bg-[#6ec948] rounded-full shrink-0",
        dimensions[size],
        isPlaying && "ring-4 ring-[#7ED957]/30 scale-110",
        className
      )}
      aria-label="播放读音"
    >
      <Volume2 size={iconSizes[size]} fill="white" />
    </button>
  );
};
