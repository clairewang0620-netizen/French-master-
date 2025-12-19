
import React from 'react';
import { Volume2 } from 'lucide-react';
import { playAudio } from '../lib/tts';
import { clsx } from 'clsx';

interface TTSButtonProps {
  text: string;
  audioUrl: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string; // 支持特定颜色覆盖 (如加强记忆的红色)
}

export const TTSButton: React.FC<TTSButtonProps> = ({ 
  text, 
  audioUrl, 
  size = 'md', 
  className, 
  color 
}) => {
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playAudio({ text, audioUrl });
  };

  const iconSizes = { sm: 14, md: 18, lg: 24 };
  const dimensions = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-14 h-14' };

  return (
    <button 
      onClick={handlePlay} 
      className={clsx(
        "flex items-center justify-center text-white transition-all active:scale-90 shadow-sm",
        color ? color : "bg-[#7CFC00] hover:bg-[#6ed900]", // 法语生机绿
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
