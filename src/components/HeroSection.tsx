import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Volume2, 
  FileCheck2, 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  Sparkles,
  Award,
  ChevronRight,
  Flame
} from 'lucide-react';

interface HeroSectionProps {
  onQuickFilter: (filters: { engineBase?: string; frameType?: string; budget?: string }) => void;
  onExploreClick: () => void;
  onCustomOrderClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onQuickFilter,
  onExploreClick,
  onCustomOrderClick,
}) => {
  const [selectedEngine, setSelectedEngine] = useState<string>('');
  const [selectedFrame, setSelectedFrame] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  const handleApplySearch = () => {
    onQuickFilter({
      engineBase: selectedEngine || undefined,
      frameType: selectedFrame || undefined,
      budget: selectedBudget || undefined,
    });
  };

  return (
    <section className="relative overflow-hidden bg-[#010101] border-b border-zinc-800/80 pt-10 pb-20">
      {/* Cinematic Background Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-20">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#EC0618] rounded-full blur-[140px]" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-zinc-700 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Headline & Description */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-xs font-mono text-[#EC0618] font-bold tracking-widest uppercase mb-3">
            Garansi Escrow & Inspeksi Fisik
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight text-white uppercase leading-[1.08] mb-4">
            Pusat Jual-Beli Motor <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-[#EC0618]">
              Chopper & Kustom
            </span> <br />
            Terkurasi di Indonesia
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto">
            Kurasi motor kustom dengan inspeksi fisik nomor rangka & mesin, audio cold start, dan transaksi terlindungi rekening bersama.
          </p>
        </div>

        {/* Hero Visual Banner (Matching reference image dark industrial tone) */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 bg-[#121316] mb-10 shadow-2xl shadow-black/80 group">
          {/* Main Visual Image */}
          <div className="relative h-[340px] sm:h-[440px] w-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=1600&auto=format&fit=crop&q=90" 
              alt="Custom Chopper Indonesia"
              className="w-full h-full object-cover object-center brightness-75 contrast-110 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#010101] via-[#010101]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#010101]/90 via-transparent to-[#010101]/60" />

            {/* Floating Watermark / Large Typography Overlay (like "911" in reference image) */}
            <div className="absolute bottom-16 right-8 sm:right-16 text-right pointer-events-none select-none opacity-20 hidden md:block">
              <span className="text-8xl sm:text-9xl font-display font-black tracking-tighter text-white">
                CHOP
              </span>
            </div>

            {/* Left Overlay Info in Banner */}
            <div className="absolute bottom-8 left-6 sm:left-10 max-w-md space-y-2">
              <p className="text-xs font-mono text-[#EC0618] font-bold uppercase tracking-wider">
                Featured Masterpiece
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                Binter Merzy 200cc Frisco Chopper
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                Karya Queenlekha Choppers. Sasis Rigid Laser Jig, Surat Akur 100%, Siap Rolling Thunder.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="font-mono text-xl sm:text-2xl font-black text-white">
                  Rp 38.500.000
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  · Surat Hidup
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar (Kolom Filter Cepat - sesuai spesifikasi user) */}
        <div className="relative -mt-6 sm:-mt-10 z-10 max-w-5xl mx-auto p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[#18191c] border border-zinc-800 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Filter 1: Basis Mesin */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EC0618]" />
                Basis Mesin
              </label>
              <select
                id="hero-filter-engine"
                value={selectedEngine}
                onChange={(e) => setSelectedEngine(e.target.value)}
                className="w-full bg-[#212325] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-[#EC0618] transition-colors cursor-pointer"
              >
                <option value="">Semua Basis Mesin</option>
                <option value="Harley-Davidson">Harley-Davidson (Sportster / Shovel)</option>
                <option value="Yamaha XS650">Yamaha XS650 (Parallel Twin)</option>
                <option value="Binter Merzy">Kawasaki Binter Merzy (KZ200)</option>
                <option value="Honda">Honda GL / Tiger / Megapro 200cc</option>
                <option value="Yamaha SR">Yamaha SR400 Single Thumper</option>
              </select>
            </div>

            {/* Filter 2: Tipe Rangka */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EC0618]" />
                Tipe Rangka (Frame)
              </label>
              <select
                id="hero-filter-frame"
                value={selectedFrame}
                onChange={(e) => setSelectedFrame(e.target.value)}
                className="w-full bg-[#212325] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-[#EC0618] transition-colors cursor-pointer"
              >
                <option value="">Semua Tipe Rangka</option>
                <option value="rigid_frame">Rigid Frame (Hardtail Murni)</option>
                <option value="softail">Softail (Hidden Shock)</option>
                <option value="gooseneck">Gooseneck Frame (Leher Angsa)</option>
                <option value="drop_seat">Drop Seat Frame (Ceper Nyaman)</option>
              </select>
            </div>

            {/* Filter 3: Rentang Bujet */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EC0618]" />
                Rentang Bujet
              </label>
              <select
                id="hero-filter-budget"
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full bg-[#212325] border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-[#EC0618] transition-colors cursor-pointer"
              >
                <option value="">Semua Rentang Harga</option>
                <option value="under_30m">&lt; Rp 30 Juta (Entry Level Chopper)</option>
                <option value="30m_75m">Rp 30 - 75 Juta (Midrange Custom)</option>
                <option value="over_75m">&gt; Rp 75 Juta (V-Twin & Masterpiece)</option>
              </select>
            </div>

            {/* Filter Action Button (Matching the red circular pill button with >>> from reference UI) */}
            <div className="flex items-end">
              <button
                id="hero-btn-submit-filter"
                onClick={handleApplySearch}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-sm shadow-lg shadow-[#EC0618]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Cari Chopper</span>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                  &gt;&gt;&gt;
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* Inline Trust Guarantee Bar (Clean & Professional) */}
        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-zinc-400">
          <span>Surat Akur Terverifikasi</span>
          <span className="text-zinc-700 select-none">/</span>
          <span>Rekber Escrow 2x24 Jam</span>
          <span className="text-zinc-700 select-none">/</span>
          <span>Audio Cold Start Teruji</span>
          <span className="text-zinc-700 select-none">/</span>
          <span>Flatbed Towing Berasuransi</span>
        </div>

      </div>
    </section>
  );
};
