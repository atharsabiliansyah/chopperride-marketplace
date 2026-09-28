import React from 'react';
import { Bike, ChevronRight } from 'lucide-react';

interface ScreenOnboardingProps {
  onGetStarted: () => void;
}

export const ScreenOnboarding: React.FC<ScreenOnboardingProps> = ({ onGetStarted }) => {
  return (
    <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#010101] text-white overflow-hidden">
      
      {/* Top Visual with Moody Chopper Photo & Giant Typography Backdrop */}
      <div className="relative -mx-6 -mt-10 h-[430px] overflow-hidden">
        
        {/* Background Image: Moody forest / misty road with custom chopper */}
        <img
          src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1000&auto=format&fit=crop&q=85"
          alt="Custom Chopper"
          className="w-full h-full object-cover object-center brightness-90 contrast-110"
        />

        {/* Ambient Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-[#010101]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#010101]/70 via-transparent to-transparent" />

        {/* Giant Vertical / Condensed Background Typography (Matching "911" in reference) */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none select-none z-10">
          <span 
            className="text-[96px] font-black tracking-tighter leading-none text-white/85 font-display drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            style={{ letterSpacing: '-0.06em' }}
          >
            CHOP
          </span>
        </div>

        {/* Subtle Red Light Bleed */}
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-[#EC0618]/25 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Bottom Content Area */}
      <div className="relative z-20 flex flex-col pt-2 pb-4">
        
        {/* Headline (Matching "Find the / Nearest Car" typography & hierarchy) */}
        <div className="mb-3">
          <h1 className="text-3xl sm:text-[34px] font-display font-extrabold text-white tracking-tight leading-[1.12]">
            Find the <br />
            <span className="text-white">Nearest Chopper</span>
          </h1>
          
          <p className="text-xs sm:text-[13px] text-zinc-400 font-normal leading-relaxed mt-2.5 max-w-[280px]">
            Curated custom choppers, verified VIN & engine, and instant escrow delivery anywhere in Indonesia.
          </p>
        </div>

        {/* Bottom Action Button (Exact replica of the pill bar with circular red button + Get Started + >>>) */}
        <button
          onClick={onGetStarted}
          className="w-full mt-4 flex items-center justify-between p-2 pl-2 pr-5 rounded-full bg-[#212325] hover:bg-[#2b2e31] border border-zinc-800 text-white transition-all shadow-xl hover:scale-[1.01] active:scale-[0.98] group cursor-pointer"
        >
          {/* Circular Red Button with Bike Icon */}
          <div className="w-12 h-12 rounded-full bg-[#EC0618] flex items-center justify-center shadow-lg shadow-[#EC0618]/40 group-hover:scale-105 transition-transform">
            <Bike className="w-5 h-5 text-white" />
          </div>

          {/* Center Text */}
          <span className="text-sm font-bold text-white tracking-wide">
            Get Started
          </span>

          {/* Right Chevron Arrows >>> */}
          <div className="flex items-center text-zinc-400 group-hover:text-white transition-colors">
            <span className="font-mono text-sm font-black tracking-tighter text-[#EC0618]">
              &gt;&gt;&gt;
            </span>
          </div>
        </button>

      </div>

    </div>
  );
};
