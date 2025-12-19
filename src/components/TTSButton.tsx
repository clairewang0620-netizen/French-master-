import React from 'react';
import { Volume2 } from 'lucide-react';
import { speakFrench } from '../lib/tts';
import { clsx } from 'clsx';

interface TTSButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TTSButton: React.FC<TTSButtonProps> = ({ 
  text, 
  size = 'md', 
  className
}) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    speakFrench(text);
  };

  const iconSizes = { sm: 14, md: 18, lg: 24 };
  const dimensions = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };

  return (
    <button 
      onClick={handlePlay} 
      className={clsx(
        "flex items-center justify-center text-white transition-all active:scale-90 shadow-sm",
        "bg-success hover:bg-[#6ecb47]", 
        "rounded-full shrink-0",
        dimensions[size],
        className
      )}
      aria-label="播放法语发音"
    >
      <Volume2 size={iconSizes[size]} fill="white" />
    </button>
  );
};
