import React, { useState, useEffect } from 'react';
import { ChopperMotor, BuilderInfo } from '../../types';
import { 
  ChevronLeft, 
  Search, 
  Heart, 
  Volume2, 
  Square, 
  Check, 
  Layers, 
  Zap, 
  FileCheck2, 
  Flame, 
  Sliders, 
  ShieldCheck,
  MapPin,
  Star,
  Award
} from 'lucide-react';
import { chopperAudio } from '../../utils/soundSynthesizer';

interface ScreenDetailsProps {
  motor: ChopperMotor;
  onBack: () => void;
  onBookNow: (motor: ChopperMotor) => void;
  onSearchClick?: () => void;
}

export const ScreenDetails: React.FC<ScreenDetailsProps> = ({
  motor,
  onBack,
  onBookNow,
  onSearchClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(0);

  useEffect(() => {
    chopperAudio.setRpmCallback((rpm) => {
      setCurrentRpm(rpm);
    });

    return () => {
      chopperAudio.stop();
    };
  }, []);

  const handleToggleSound = () => {
    if (isPlayingSound) {
      chopperAudio.stop();
      setIsPlayingSound(false);
    } else {
      let simType: 'vtwin' | 'parallel_twin' | 'thumper' = 'thumper';
      if (motor.engineConfig === 'v_twin') simType = 'vtwin';
      else if (motor.engineConfig === 'parallel_twin') simType = 'parallel_twin';

      chopperAudio.playColdStart(simType, () => {
        setIsPlayingSound(true);
      });
      setIsPlayingSound(true);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col justify-between bg-[#010101] text-white pb-6 overflow-y-auto no-scrollbar">
      
      {/* Top Navigation Bar: Back, "Details", Search/Favorite */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 sticky top-0 z-30 bg-[#010101]/90 backdrop-blur-md">
        
        {/* Circular Back Button */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center Title */}
        <span className="text-sm font-bold tracking-tight text-white uppercase font-display">
          Details
        </span>

        {/* Circular Search Button */}
        <button
          onClick={onSearchClick || onBack}
          className="w-10 h-10 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
          aria-label="Cari"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content Body */}
      <div className="px-5 space-y-4">
        
        {/* Hero Chopper Side View & Studio Display */}
        <div className="relative w-full h-48 rounded-[28px] overflow-hidden bg-gradient-to-b from-[#18191c] to-[#0d0e10] border border-zinc-800/80 flex items-center justify-center group shadow-2xl">
          <img
            src={motor.mainImage}
            alt={motor.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Sound Test Floating Button on Top Right */}
          <button
            onClick={handleToggleSound}
            className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer ${
              isPlayingSound
                ? 'bg-[#EC0618] text-white animate-pulse'
                : 'bg-black/75 hover:bg-[#EC0618] text-zinc-200 hover:text-white border border-zinc-700'
            }`}
          >
            {isPlayingSound ? (
              <>
                <Square className="w-3 h-3 fill-current" />
                <span>Stop Engine</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#EC0618] group-hover:text-white" />
                <span>Cold Start Sound</span>
              </>
            )}
          </button>

          {/* Live RPM counter during sound test */}
          {isPlayingSound && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 border border-[#EC0618]/50 text-[10px] font-mono font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EC0618] animate-ping" />
              <span>{currentRpm || 750} RPM</span>
            </div>
          )}
        </div>

        {/* Title, Builder & Heart Row (Matching Porsche 930 Red in reference) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            {/* Builder Emblem / Avatar */}
            <img
              src={motor.builder.avatar}
              alt={motor.builder.workshopName}
              className="w-10 h-10 rounded-full border border-zinc-700 object-cover"
            />
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {motor.title.split('-')[0].trim()}
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                {motor.builder.workshopName} • {motor.location.split(',')[0]}
              </p>
            </div>
          </div>

          {/* Favorite Heart Button in Circle */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="w-10 h-10 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
            aria-label="Simpan Favorit"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#EC0618] text-[#EC0618]' : 'text-zinc-300'}`} />
          </button>
        </div>

        {/* 2x3 Grid of Feature Cards (Exact match to Climate control, Acceleration, Electricity, Gear box in reference) */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          
          {/* Card 1: Frame Type */}
          <div className="bg-[#212325] rounded-[20px] p-3.5 border border-zinc-800/80 flex flex-col justify-between">
            <Layers className="w-4 h-4 text-zinc-400 mb-2" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">
                Frame Type
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">
                {motor.frameTypeLabel}
              </span>
            </div>
          </div>

          {/* Card 2: Engine Base */}
          <div className="bg-[#212325] rounded-[20px] p-3.5 border border-zinc-800/80 flex flex-col justify-between">
            <Zap className="w-4 h-4 text-zinc-400 mb-2" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">
                Engine Base
              </span>
              <span className="text-xs font-bold text-white block mt-0.5 truncate">
                {motor.buildSheet.engineBase}
              </span>
            </div>
          </div>

          {/* Card 3: Legal Status */}
          <div className="bg-[#212325] rounded-[20px] p-3.5 border border-zinc-800/80 flex flex-col justify-between">
            <FileCheck2 className="w-4 h-4 text-emerald-400 mb-2" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">
                Legal Status
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">
                {motor.legalStatusLabel.replace(' (Review Selesai)', '')}
              </span>
            </div>
          </div>

          {/* Card 4: Exhaust */}
          <div className="bg-[#212325] rounded-[20px] p-3.5 border border-zinc-800/80 flex flex-col justify-between">
            <Flame className="w-4 h-4 text-[#EC0618] mb-2" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">
                Exhaust Note
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">
                {motor.soundTest?.engineNote || 'Padat & Gahar'}
              </span>
            </div>
          </div>

          {/* Card 5: Transmission */}
          <div className="bg-[#212325] rounded-[20px] p-3.5 border border-zinc-800/80 flex flex-col justify-between">
            <Sliders className="w-4 h-4 text-zinc-400 mb-2" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">
                Gear Box
              </span>
              <span className="text-xs font-bold text-white block mt-0.5">
                Manual Clutch
              </span>
            </div>
          </div>

          {/* Card 6: Escrow Guarantee */}
          <div className="bg-[#212325] rounded-[20px] p-3.5 border border-zinc-800/80 flex flex-col justify-between">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-2" />
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block">
                Escrow Rekber
              </span>
              <span className="text-xs font-bold text-emerald-400 block mt-0.5">
                2x24 Jam Garansi
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Sticky Bottom Action Bar (Exact match to "Book now >>>" pill bar in reference) */}
      <div className="px-5 pt-3">
        <button
          onClick={() => onBookNow(motor)}
          className="w-full flex items-center justify-between p-2 pl-2 pr-5 rounded-full bg-[#212325] hover:bg-[#2c2f33] border border-zinc-800 text-white transition-all shadow-xl hover:scale-[1.01] active:scale-[0.98] group cursor-pointer"
        >
          {/* Circular Red Button with Checkmark icon */}
          <div className="w-12 h-12 rounded-full bg-[#EC0618] flex items-center justify-center text-white shadow-lg shadow-[#EC0618]/40 group-hover:scale-105 transition-transform">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>

          {/* Center Text with Price */}
          <div className="flex flex-col text-center">
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Book now (Rekber)
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Rp {motor.price.toLocaleString('id-ID')}
            </span>
          </div>

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
