import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  currentTime?: string;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  currentTime = '9:41',
  className = '',
}) => {
  return (
    <div className={`relative mx-auto w-full max-w-[360px] sm:max-w-[375px] h-[780px] bg-[#010101] rounded-[48px] p-3 shadow-2xl shadow-black border-[5px] border-[#212325] ring-1 ring-zinc-800 flex flex-col overflow-hidden select-none ${className}`}>
      
      {/* Outer Phone Bezel Glow / Edge */}
      <div className="absolute inset-0 rounded-[44px] pointer-events-none border border-white/5" />

      {/* Screen Container */}
      <div className="relative w-full h-full bg-[#010101] rounded-[38px] overflow-hidden flex flex-col">
        
        {/* iOS Status Bar */}
        <div className="relative z-30 flex items-center justify-between px-7 pt-3.5 pb-1 text-white text-xs font-semibold tracking-tight">
          <span className="font-mono text-[13px]">{currentTime}</span>
          
          {/* Dynamic Island / Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-24 h-5 bg-black rounded-full border border-zinc-900 flex items-center justify-end px-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800" />
          </div>

          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="text-[10px] font-mono">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Screen Content Body */}
        <div className="relative flex-1 overflow-y-auto overflow-x-hidden no-scrollbar flex flex-col">
          {children}
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="relative z-30 pt-1 pb-2 flex justify-center pointer-events-none bg-gradient-to-t from-[#010101] to-transparent">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>

      </div>

    </div>
  );
};
