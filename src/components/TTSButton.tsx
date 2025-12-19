import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { tts, playAudio } from '../lib/tts';
import { clsx } from 'clsx';

interface TTSButtonProps {
  text: string;
  audioUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string; // Optional override for colors like the red boost
}

export const TTSButton: React.FC<TTSButtonProps> = ({ text, audioUrl, size = 'md', className, color }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    
    // Trigger unlock strategy on user gesture
    tts.unlock();
    
    setIsPlaying(true);
    await playAudio({ text, audioUrl });
    
    // Feedback duration
    setTimeout(() => setIsPlaying(false), 1500);
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
        color ? color : "bg-[#7CFC00] hover:bg-[#6ed900]", // Requested light green (#7CFC00)
        "rounded-full shrink-0",
        dimensions[size],
        isPlaying && "ring-4 ring-white/30 scale-110",
        className
      )}
      aria-label="播放读音"
    >
      <Volume2 size={iconSizes[size]} fill="white" />
    </button>
  );
};
