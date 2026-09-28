import React, { useState } from 'react';
import { ChopperMotor } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  MapPin, 
  Star, 
  ArrowRight,
  Home,
  Clock,
  Settings,
  Plus,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ScreenHomeProps {
  motors: ChopperMotor[];
  onSelectMotor: (motor: ChopperMotor) => void;
  onOpenEscrow: () => void;
  onOpenSell: () => void;
  activeNavTab?: 'home' | 'history' | 'settings';
  onNavTabChange?: (tab: 'home' | 'history' | 'settings') => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  motors,
  onSelectMotor,
  onOpenEscrow,
  onOpenSell,
  activeNavTab = 'home',
  onNavTabChange,
}) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'chp-01': true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [filterEngine, setFilterEngine] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const topTrends = motors.slice(0, 3);
  
  const filteredMotors = motors.filter((m) => {
    if (filterEngine !== 'all') {
      if (filterEngine === 'merzy' && !m.title.toLowerCase().includes('merzy')) return false;
      if (filterEngine === 'xs650' && !m.title.toLowerCase().includes('xs650')) return false;
      if (filterEngine === 'harley' && !m.title.toLowerCase().includes('harley')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q) || m.buildSheet.engineBase.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="relative flex-1 flex flex-col bg-[#010101] text-white pb-24 overflow-y-auto no-scrollbar">
      
      {/* Top Header Row: User Avatar & Search Button */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        {/* User Profile Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt="User Avatar"
              className="w-11 h-11 rounded-full object-cover border-2 border-[#212325] ring-2 ring-[#EC0618]/30"
            />
            {user && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#010101]" />
            )}
          </div>
        </div>

        {/* Circular Search Icon Button */}
        <button
          onClick={() => setIsSearchActive(!isSearchActive)}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
            isSearchActive 
              ? 'bg-[#EC0618] text-white shadow-lg shadow-[#EC0618]/30' 
              : 'bg-[#212325] text-zinc-300 hover:text-white border border-zinc-800'
          }`}
          aria-label="Cari Chopper"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Greeting Title */}
      <div className="px-5 pt-2 pb-4">
        <h2 className="text-2xl font-display font-extrabold text-white tracking-tight">
          Hello, {user ? (user.displayName?.split(' ')[0] || 'Rider') : 'Rider'}
        </h2>
        <p className="text-xs text-zinc-400 font-normal mt-0.5">
          Start your timeless adventure
        </p>

        {/* Expandable Search Input */}
        {isSearchActive && (
          <div className="mt-3 relative">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chopper by model or city..."
              className="w-full bg-[#212325] border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0618]"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>

      {/* Section 1: "Top trends" with "See all >" */}
      <div className="pt-1 pb-4">
        <div className="flex items-center justify-between px-5 mb-3">
          <h3 className="text-base font-bold text-white tracking-tight">
            Top trends
          </h3>
          <button 
            onClick={() => {
              setFilterEngine('all');
              setSearchQuery('');
            }}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors flex items-center gap-0.5"
          >
            <span>See all</span>
            <span>&gt;</span>
          </button>
        </div>

        {/* Horizontal Carousel (Exact matches to Card in reference) */}
        <div className="flex items-stretch gap-3.5 px-5 overflow-x-auto no-scrollbar scroll-smooth">
          {topTrends.map((motor) => {
            const isFav = !!favorites[motor.id];
            return (
              <div
                key={motor.id}
                onClick={() => onSelectMotor(motor)}
                className="min-w-[195px] max-w-[195px] bg-[#212325] rounded-[24px] p-3 border border-zinc-800/80 flex flex-col justify-between shrink-0 hover:border-zinc-700 transition-all cursor-pointer group shadow-xl"
              >
                {/* Top Image Box with Heart Button */}
                <div className="relative w-full h-28 rounded-[18px] overflow-hidden bg-black/40 mb-2.5">
                  <img
                    src={motor.mainImage}
                    alt={motor.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Heart Favorite Button (Top Right) */}
                  <button
                    onClick={(e) => toggleFavorite(motor.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:text-[#EC0618] transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#EC0618] text-[#EC0618]' : 'text-white'}`} />
                  </button>
                </div>

                {/* Info Text */}
                <div className="px-0.5">
                  <h4 className="text-xs font-bold text-white truncate leading-tight">
                    {motor.title.replace('Frisco Chopper - Rigid Frame', 'Frisco').slice(0, 22)}
                  </h4>

                  {/* Location with Pin */}
                  <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-1">
                    <MapPin className="w-2.5 h-2.5 text-zinc-500 shrink-0" />
                    <span className="truncate">{motor.location.split(',')[0]}</span>
                  </div>

                  {/* Rating & Price Row */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60">
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>4.9</span>
                      <span className="text-zinc-500 text-[9px]">(24)</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white">
                        Rp {(motor.price / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: "Choose a chopper" with Filter Icon */}
      <div className="px-5 pt-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-white tracking-tight">
            Choose a chopper
          </h3>
          
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isFilterOpen || filterEngine !== 'all'
                ? 'bg-[#EC0618] text-white'
                : 'bg-[#212325] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Pills Dropdown */}
        {isFilterOpen && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-1">
            {[
              { id: 'all', label: 'All Engines' },
              { id: 'merzy', label: 'Binter Merzy' },
              { id: 'xs650', label: 'Yamaha XS650' },
              { id: 'harley', label: 'Harley-Davidson' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterEngine(f.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                  filterEngine === f.id
                    ? 'bg-[#EC0618] text-white'
                    : 'bg-[#212325] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Wide Chopper Cards (Exact match to "Choose a car" cards in reference) */}
        <div className="space-y-3.5">
          {filteredMotors.map((motor) => {
            return (
              <div
                key={motor.id}
                onClick={() => onSelectMotor(motor)}
                className="relative bg-[#212325] rounded-[26px] p-4 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group shadow-xl overflow-hidden"
              >
                {/* Top Row: Title/Subtitle on Left, Rating/Price on Right */}
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {motor.title.split(' ')[0]} {motor.title.split(' ')[1] || ''}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-medium mt-0.5">
                      {motor.buildSheet.engineBase} • {motor.frameTypeLabel}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-[11px] font-semibold text-amber-400">
                      <Star className="w-3 h-3 fill-current" />
                      <span>4.9</span>
                    </div>
                    <div className="text-sm font-mono font-bold text-white mt-0.5">
                      Rp {(motor.price / 1000000).toFixed(1)} Jt
                    </div>
                  </div>
                </div>

                {/* Center Side-Profile Chopper Photo */}
                <div className="relative -mx-2 my-1 h-32 flex items-center justify-center overflow-hidden">
                  <img
                    src={motor.mainImage}
                    alt={motor.title}
                    className="w-full h-full object-cover object-center rounded-xl brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle fade overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#212325]/50 via-transparent to-[#212325]/40" />
                </div>

                {/* Bottom Left: Red Circular Button with White Arrow -> (Signature element from reference UI) */}
                <div className="relative z-10 flex items-center justify-between pt-1">
                  <div className="w-9 h-9 rounded-full bg-[#EC0618] flex items-center justify-center text-white shadow-md shadow-[#EC0618]/30 group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] text-zinc-400 font-mono">
                    {motor.legalStatusLabel.replace(' (Review Selesai)', '')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Navigation Bar (Docked Pill Bar matching reference image) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-5 px-5 py-2.5 rounded-full bg-black/90 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black ring-1 ring-white/10">
          
          {/* Home Tab (Active with Red Circle) */}
          <button
            onClick={() => onNavTabChange?.('home')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              activeNavTab === 'home'
                ? 'bg-[#EC0618] text-white shadow-md shadow-[#EC0618]/40 scale-105'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
          </button>

          {/* History / Rekber Tab */}
          <button
            onClick={onOpenEscrow}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              activeNavTab === 'history'
                ? 'bg-[#EC0618] text-white shadow-md shadow-[#EC0618]/40 scale-105'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Escrow Rekber Status"
            title="Status Rekber Escrow"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Settings / Sell Tab */}
          <button
            onClick={onOpenSell}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              activeNavTab === 'settings'
                ? 'bg-[#EC0618] text-white shadow-md shadow-[#EC0618]/40 scale-105'
                : 'text-zinc-400 hover:text-white'
            }`}
            aria-label="Jual Motor"
            title="Pasang Iklan Motor"
          >
            <Plus className="w-4 h-4" />
          </button>

        </div>
      </div>

    </div>
  );
};
