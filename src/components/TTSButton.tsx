import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { speakFrench } from '../lib/tts';
import { clsx } from 'clsx';

interface TTSButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'ghost' | 'primary';
}

export const TTSButton: React.FC<TTSButtonProps> = ({ text, size = 'md', className, variant = 'ghost' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (isPlaying) return;
    
    setIsPlaying(true);
    await speakFrench(text);
    
    setTimeout(() => {
      setIsPlaying(false);
    }, Math.min(text.length * 100, 3000)); 
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const baseStyles = "rounded-full transition-all flex items-center justify-center cursor-pointer shadow-sm";
  const variants = {
    ghost: "text-brand-600 bg-brand-50 border border-brand-100 hover:bg-brand-100 hover:text-brand-800 active:scale-90",
    primary: "bg-brand-600 text-white border border-brand-700 hover:bg-brand-700 shadow-md p-2 active:scale-90"
  };

  return (
    <button 
      onClick={handlePlay} 
      className={clsx(baseStyles, variants[variant], className, isPlaying && "animate-pulse ring-2 ring-brand-300")}
      aria-label="Play pronunciation"
    >
      <Volume2 size={iconSizes[size]} />
    </button>
  );
};