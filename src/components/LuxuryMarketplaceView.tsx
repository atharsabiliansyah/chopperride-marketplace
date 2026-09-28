import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChopperMotor, EscrowTransaction } from '../types';
import { 
  Search, 
  Heart, 
  MapPin, 
  Star, 
  ArrowRight, 
  SlidersHorizontal, 
  Plus, 
  Check, 
  ChevronLeft,
  ArrowLeft,
  X,
  Home,
  Briefcase,
  ShieldAlert,
  HeartHandshake,
  Truck,
  Play,
  ExternalLink,
  User
} from 'lucide-react';
import { MotorCard } from './MotorCard';
import { SlideToBookButton } from './SlideToBookButton';
import { chopperAudio } from '../utils/soundSynthesizer';
import { useAuth } from '../context/AuthContext';

interface LuxuryMarketplaceViewProps {
  motors: ChopperMotor[];
  activeEscrowTx: EscrowTransaction;
  onSelectMotor: (motor: ChopperMotor) => void;
  onBookNow: (motor: ChopperMotor) => void;
  onOpenSell: () => void;
  onOpenEscrow: () => void;
  onOpenBmc: () => void;
  onOpenClaim: () => void;
  onOpenConsultation: () => void;
  onOpenProfile?: () => void;
  resetCatalogSignal?: number;
  onDetailChange?: (isOpen: boolean) => void;
}

export const LuxuryMarketplaceView: React.FC<LuxuryMarketplaceViewProps> = ({
  motors,
  activeEscrowTx,
  onSelectMotor,
  onBookNow,
  onOpenSell,
  onOpenEscrow,
  onOpenBmc,
  onOpenClaim,
  onOpenConsultation,
  onOpenProfile,
  resetCatalogSignal,
  onDetailChange,
}) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({ 'chp-01': true });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEngineFilter, setSelectedEngineFilter] = useState<string>('all');
  const [detailMotor, setDetailMotor] = useState<ChopperMotor | null>(null);
  const [detailImageIndex, setDetailImageIndex] = useState<number>(0);

  const handleSetDetailMotor = (motor: ChopperMotor | null) => {
    setDetailMotor(motor);
    setDetailImageIndex(0);
    onDetailChange?.(!!motor);
    if (motor) {
      onSelectMotor(motor);
    }
  };

  // Up to 4 distinct images for detail motor gallery
  const detailImages = useMemo(() => {
    if (!detailMotor) return [];
    const list: string[] = [];
    if (detailMotor.mainImage) list.push(detailMotor.mainImage);
    if (detailMotor.gallery) {
      for (const g of detailMotor.gallery) {
        if (g.url && !list.includes(g.url) && list.length < 4) {
          list.push(g.url);
        }
      }
    }
    if (list.length < 4 && detailMotor.gallery) {
      for (const g of detailMotor.gallery) {
        if (g.url && list.length < 4) {
          list.push(g.url);
        }
      }
    }
    return list.slice(0, 4);
  }, [detailMotor]);

  // Auto-switch image with animation every 3.5 seconds
  useEffect(() => {
    if (!detailMotor || detailImages.length <= 1) return;
    const interval = setInterval(() => {
      setDetailImageIndex((prev) => (prev + 1) % detailImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [detailMotor, detailImages.length]);

  useEffect(() => {
    if (resetCatalogSignal) {
      setDetailMotor(null);
      onDetailChange?.(false);
    }
  }, [resetCatalogSignal, onDetailChange]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Video Highlight state for YouTube showcase section
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    return () => {
      chopperAudio.stop();
    };
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const engineFilters = [
    { id: 'all', label: 'Semua Mesin' },
    { id: 'merzy', label: 'Binter Merzy 200' },
    { id: 'xs650', label: 'Yamaha XS650' },
    { id: 'harley', label: 'Harley-Davidson' },
    { id: 'honda', label: 'Honda GL / Tiger' },
  ];

  const filteredMotors = motors.filter((m) => {
    if (selectedEngineFilter !== 'all') {
      if (selectedEngineFilter === 'merzy' && !m.title.toLowerCase().includes('merzy')) return false;
      if (selectedEngineFilter === 'xs650' && !m.title.toLowerCase().includes('xs650')) return false;
      if (selectedEngineFilter === 'harley' && !m.title.toLowerCase().includes('harley')) return false;
      if (selectedEngineFilter === 'honda' && !m.title.toLowerCase().includes('gl') && !m.title.toLowerCase().includes('tiger')) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q) || m.buildSheet.engineBase.toLowerCase().includes(q);
    }
    return true;
  });

  const topTrends = motors.slice(0, 4);

  const highlightVideos = [
    {
      motorId: motors[0]?.id || 'chp-01',
      title: 'Binter Merzy 200cc Frisco Chopper',
      subtitle: 'Tes Suara Knalpot & Rolling Run Khas Binter Merzy Single Thumper',
      channel: 'Derry Erlangga Chopper ID',
      youtubeId: 'hKmXvb55vEg',
      duration: '1:15',
      durationSeconds: 75,
      resolution: 'YouTube 1080p',
      views: '19.8K tayang',
      motor: motors[0],
    },
    {
      motorId: motors[1]?.id || 'chp-02',
      title: 'Yamaha XS650 Traditional Bobber Chopper',
      subtitle: 'Twin Cylinder Parallel Exhaust Sound & Street Cruise',
      channel: 'Megy ROCKERS MOTORCYCLE',
      youtubeId: '20lMDeHbi68',
      duration: '2:40',
      durationSeconds: 160,
      resolution: 'YouTube HD',
      views: '34.2K tayang',
      motor: motors[1],
    },
    {
      motorId: motors[2]?.id || 'chp-03',
      title: 'Harley-Davidson Shovelhead Low & Slow Chopper',
      subtitle: 'Suara Potato Potato Idle Khas Shovelhead & Rolling Highway Run',
      channel: 'Torq Chop Official',
      youtubeId: 'wC7yVUSuqf0',
      duration: '3:10',
      durationSeconds: 190,
      resolution: 'YouTube 4K',
      views: '58.1K tayang',
      motor: motors[2],
    },
    {
      motorId: motors[3]?.id || 'chp-04',
      title: 'Honda Tiger 200cc Custom Panhead Style Chopper',
      subtitle: 'Pure Exhaust Sound & Kickstart Test Solo Highway Ride',
      channel: 'Hippie Chopper Corner',
      youtubeId: 'cM1OHLTP98I',
      duration: '1:50',
      durationSeconds: 110,
      resolution: 'YouTube HD',
      views: '22.7K tayang',
      motor: motors[3],
    },
  ];

  const currentHighlight = highlightVideos[activeVideoIndex] || highlightVideos[0];

  // Auto-advance video highlight saat durasi video habis atau event YouTube ended diterima
  useEffect(() => {
    // 1. Tangkap event postMessage dari iframe YouTube (saat video tamat / ended state = 0)
    const handleYouTubeMessage = (event: MessageEvent) => {
      try {
        let data = event.data;
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch {
            return;
          }
        }
        if (
          (data?.event === 'onStateChange' && (data?.info === 0 || data?.info === 'ENDED')) ||
          (data?.event === 'infoDelivery' && data?.info?.playerState === 0)
        ) {
          setActiveVideoIndex((prev) => (prev + 1) % highlightVideos.length);
        }
      } catch {}
    };

    window.addEventListener('message', handleYouTubeMessage);

    // 2. Timer otomatis sesuai durasi video (+1 detik buffer) untuk transisi mulus tanpa klik manual
    const durSec = currentHighlight.durationSeconds || 90;
    const timer = setTimeout(() => {
      setActiveVideoIndex((prev) => (prev + 1) % highlightVideos.length);
    }, (durSec + 1) * 1000);

    return () => {
      window.removeEventListener('message', handleYouTubeMessage);
      clearTimeout(timer);
    };
  }, [activeVideoIndex, currentHighlight.durationSeconds, highlightVideos.length]);

  // If viewing details of a specific chopper
  if (detailMotor) {
    const isFav = !!favorites[detailMotor.id];
    return (
      <div className="w-full min-h-screen bg-[#010101] text-white pb-36 md:pb-12">
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#010101]/95 backdrop-blur-md border-b border-zinc-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
            <button
              onClick={() => {
                chopperAudio.stop();
                handleSetDetailMotor(null);
              }}
              className="w-10 h-10 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
              aria-label="Kembali"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-300" />
            </button>

              <span className="text-sm font-bold tracking-tight text-white uppercase font-display">
                Spesifikasi Chopper
              </span>

              <button
                onClick={(e) => toggleFavorite(detailMotor.id, e)}
                className="w-10 h-10 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
                aria-label="Simpan Favorit"
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-[#EC0618] text-[#EC0618]' : 'text-zinc-300'}`} />
              </button>
            </div>
          </div>

        {/* Detail Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Left Column: Big Studio Image & Cold Start Audio Test */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Main Photo Card with Auto-Slide & Animation */}
              <div className="relative w-full h-[300px] sm:h-[460px] rounded-[32px] overflow-hidden bg-gradient-to-b from-[#18191c] to-[#0a0b0d] border border-zinc-800/80 flex items-center justify-center shadow-2xl group select-none">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={detailImageIndex}
                    src={detailImages[detailImageIndex] || detailMotor.mainImage}
                    alt={`${detailMotor.title} - Foto ${detailImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                {/* Modern Indicator Bars / Dots */}
                {detailImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {detailImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setDetailImageIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === detailImageIndex
                            ? 'w-6 bg-[#EC0618]'
                            : 'w-1.5 bg-white/40 hover:bg-white/75'
                        }`}
                        aria-label={`Foto ke ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery Mini Previews (Maksimal 4 gambar interaktif) */}
              {detailImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                  {detailImages.map((url, idx) => {
                    const isActive = idx === detailImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setDetailImageIndex(idx)}
                        className={`relative h-20 sm:h-24 rounded-2xl overflow-hidden border transition-all cursor-pointer group ${
                          isActive
                            ? 'border-[#EC0618] ring-2 ring-[#EC0618]/50 scale-[1.02] shadow-lg shadow-[#EC0618]/25'
                            : 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100 bg-[#212325]'
                        }`}
                        aria-label={`Pilih foto ${idx + 1}`}
                      >
                        <img
                          src={url}
                          alt={`${detailMotor.title} foto ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isActive && (
                          <div className="absolute inset-0 bg-[#EC0618]/15 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Description */}
              <div className="bg-[#212325] rounded-[28px] p-5 sm:p-6 border border-zinc-800/80">
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2 font-display">
                  Catatan Kurator & Deskripsi Unit
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {detailMotor.description}
                </p>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex flex-wrap gap-3 text-[11px] sm:text-xs text-zinc-400 font-mono">
                  <span>No. Rangka: {detailMotor.verification?.nokaMasked || 'CHOPP***'}</span>
                  <span>No. Mesin: {detailMotor.verification?.nosinMasked || 'ENG20***'}</span>
                  <span className="text-emerald-400 font-bold">Status: {detailMotor.verification?.taxStatus || 'Pajak Hidup'}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Title, Specs 2x3 Grid, Escrow Guarantee, and Action Pill */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              
              {/* Header Box: Builder & Title */}
              <div className="bg-[#212325] rounded-[28px] p-5 sm:p-6 border border-zinc-800/80 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={detailMotor.builder?.avatar}
                    alt={detailMotor.builder?.workshopName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-zinc-700 object-cover"
                  />
                  <div>
                    <h1 className="text-lg sm:text-2xl font-poppins font-extrabold text-white leading-tight">
                      {detailMotor.title}
                    </h1>
                    <p className="text-xs text-zinc-400 font-medium mt-0.5">
                      Karya {detailMotor.builder?.workshopName} • {detailMotor.location}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xl sm:text-3xl font-poppins font-extrabold text-white tracking-tight">
                    Rp {detailMotor.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* 2x3 Grid of Feature Cards (Clean typographic specs without truncated text) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                
                {/* Frame Type */}
                <div className="bg-[#212325] rounded-[20px] p-3 sm:p-3.5 border border-zinc-800/80 flex flex-col justify-center min-h-[72px] sm:min-h-[78px]">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block font-mono">
                    Frame Type
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-white block mt-0.5 leading-snug break-words">
                    {detailMotor.frameTypeLabel}
                  </span>
                </div>

                {/* Engine Base */}
                <div className="bg-[#212325] rounded-[20px] p-3 sm:p-3.5 border border-zinc-800/80 flex flex-col justify-center min-h-[72px] sm:min-h-[78px]">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block font-mono">
                    Engine Base
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-white block mt-0.5 leading-snug break-words">
                    {detailMotor.buildSheet?.engineBase?.replace(/\s*\([^)]*\)/g, '').trim()}
                  </span>
                </div>

                {/* Legal Status */}
                <div className="bg-[#212325] rounded-[20px] p-3 sm:p-3.5 border border-zinc-800/80 flex flex-col justify-center min-h-[72px] sm:min-h-[78px]">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block font-mono">
                    Legal Status
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-white block mt-0.5 leading-snug break-words">
                    {detailMotor.legalStatusLabel.replace(/\s*\([^)]*\)/g, '').trim()}
                  </span>
                </div>

                {/* Exhaust Note */}
                <div className="bg-[#212325] rounded-[20px] p-3 sm:p-3.5 border border-zinc-800/80 flex flex-col justify-center min-h-[72px] sm:min-h-[78px]">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block font-mono">
                    Exhaust Note
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-white block mt-0.5 leading-snug break-words">
                    {detailMotor.soundTest?.engineNote
                      ? detailMotor.soundTest.engineNote.replace(/\s*\([^)]*\)/g, '').replace(/Authentic|Deep Heavy Loaf|Cadence|British Rhythm/gi, '').trim() || 'Shotgun Upsweep'
                      : 'Shotgun Upsweep'}
                  </span>
                </div>

                {/* Transmission */}
                <div className="bg-[#212325] rounded-[20px] p-3 sm:p-3.5 border border-zinc-800/80 flex flex-col justify-center min-h-[72px] sm:min-h-[78px]">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block font-mono">
                    Gear Box
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-white block mt-0.5 leading-snug break-words">
                    {detailMotor.buildSheet?.transmission?.replace(/\s*&.*$/, '').trim() || '5-Speed Manual'}
                  </span>
                </div>

                {/* Escrow Guarantee */}
                <div className="bg-[#212325] rounded-[20px] p-3 sm:p-3.5 border border-zinc-800/80 flex flex-col justify-center min-h-[72px] sm:min-h-[78px]">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold tracking-wider block font-mono">
                    Escrow Rekber
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-emerald-400 block mt-0.5 leading-snug break-words">
                    Garansi 2x24 Jam
                  </span>
                </div>

              </div>

              {/* Sticky / Floating Action Bar on Mobile (Slide to Book Right Gesture) */}
              <div className="fixed md:static bottom-0 left-0 right-0 p-4 pb-5 md:p-0 bg-[#0a0b0d]/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-zinc-800/90 md:border-none z-40">
                <div className="w-full max-w-md mx-auto">
                  <SlideToBookButton
                    price={detailMotor.price}
                    onConfirm={() => onBookNow(detailMotor)}
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    );
  }

  // MAIN CATALOG & MARKETPLACE VIEW
  return (
    <div className="w-full min-h-screen bg-[#010101] text-white pb-24 md:pb-12">
      
      {/* 1. DESKTOP NAVBAR (Hidden on mobile) */}
      <header className="hidden md:block sticky top-0 z-30 bg-[#010101]/95 backdrop-blur-md border-b border-zinc-800/80 font-poppins">
        <div className="w-full px-6 lg:px-8 xl:px-12 h-20 flex items-center justify-between gap-4 lg:gap-6 font-poppins">
          
          {/* Brand & User Profile (Left) */}
          <div className="flex items-center gap-4 shrink-0 font-poppins">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EC0618] flex items-center justify-center shadow-lg shadow-[#EC0618]/30 shrink-0">
                <span className="font-display font-extrabold text-white text-xl">CR</span>
              </div>
              <span className="font-display font-black text-white text-xl tracking-tight uppercase whitespace-nowrap">
                CHOPPER<span className="text-[#EC0618]">RIDE</span>
              </span>
            </div>

            <div className="h-6 w-px bg-zinc-800 shrink-0" />

            {user ? (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition-opacity cursor-pointer group font-poppins"
                title="Buka Profil & Pengaturan Keamanan"
              >
                <div className="relative shrink-0">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={user.displayName || 'Rider Avatar'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#212325] ring-2 ring-[#EC0618]/30 group-hover:ring-[#EC0618]"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#010101]" />
                </div>
                <div className="whitespace-nowrap font-poppins">
                  <p className="text-xs font-bold text-white leading-none font-poppins">
                    Hello, {user.displayName?.split(' ')[0] || 'Rider'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-none font-poppins">Profil Saya</p>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#161719] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all cursor-pointer shrink-0 group font-poppins"
                title="Buka Profil & Masuk Akun"
              >
                <div className="relative w-8 h-8 rounded-full bg-[#212325] border border-zinc-700/80 group-hover:border-[#EC0618]/60 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all">
                  <User className="w-4 h-4" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-zinc-600 border border-[#010101]" />
                </div>
                <div className="text-left pr-1 whitespace-nowrap font-poppins">
                  <p className="text-xs font-bold text-white leading-none font-poppins">Profil Rider</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 leading-none font-poppins">Ketuk untuk Masuk</p>
                </div>
              </button>
            )}
          </div>

          {/* Search Bar with Integrated Filter (Center) */}
          <div className="flex-1 max-w-md xl:max-w-lg min-w-[200px] relative mx-2 font-poppins">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari chopper (Binter, Yamaha XS650, Harley)..."
              className="w-full bg-[#18191c] border border-zinc-800 rounded-full pl-10 pr-24 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0618] transition-colors font-poppins"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 font-poppins">
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="w-5 h-5 flex items-center justify-center text-xs text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
                  aria-label="Hapus pencarian"
                >
                  ✕
                </button>
              )}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25272c] hover:bg-zinc-700 text-[11px] font-bold text-zinc-200 hover:text-white transition-all cursor-pointer whitespace-nowrap font-poppins"
              >
                <SlidersHorizontal className="w-3 h-3 text-zinc-400" />
                <span className="font-poppins">Filter</span>
              </button>
            </div>
          </div>

          {/* Action Links & Buttons (Right) */}
          <div className="flex items-center gap-1 lg:gap-2 shrink-0 font-poppins">
            <button
              onClick={onOpenBmc}
              className="px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap font-poppins"
              title="Perancangan Bisnis & 9 Elemen Usaha"
            >
              Perancangan
            </button>

            <button
              onClick={onOpenClaim}
              className="px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap font-poppins"
              title="Layanan Garansi Ganti Rugi jika ada kesalahan/kerusakan"
            >
              Ganti Rugi
            </button>

            <button
              onClick={onOpenConsultation}
              className="px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap font-poppins"
              title="Konsultasi & Solusi Cepat Customer"
            >
              Solusi & CS
            </button>

            <div className="h-4 w-px bg-zinc-800 shrink-0 mx-1.5" />

            <button
              onClick={onOpenEscrow}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer whitespace-nowrap shrink-0 font-poppins"
            >
              Status Rekber
            </button>

            <button
              onClick={onOpenSell}
              className="px-4 py-1.5 rounded-lg bg-[#EC0618] hover:bg-[#ff1e2e] text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 font-poppins"
            >
              Jual Motor
            </button>
          </div>

        </div>
      </header>

      {/* 2. MOBILE TOP BAR (< md) - Clean, Uncluttered, Pure Luxury */}
      <div className="md:hidden sticky top-0 z-30 bg-[#010101]/95 backdrop-blur-md px-5 pt-4 pb-3 flex items-center justify-between border-b border-zinc-900">
        
        {/* Left: User Profile Avatar with Status Indicator */}
        {user ? (
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative shrink-0 cursor-pointer focus:outline-none"
            title="Kelola Profil & Keamanan Akun"
          >
            <img
              src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.displayName || 'Rider Avatar'}
              className="w-10 h-10 rounded-full object-cover border border-[#212325] ring-2 ring-[#EC0618]/40 hover:ring-[#EC0618] transition-all"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#010101]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenProfile}
            className="relative shrink-0 cursor-pointer focus:outline-none group"
            title="Profil Anonim / Masuk Akun"
            aria-label="Profil Anonim / Masuk Akun"
          >
            <div className="w-10 h-10 rounded-full bg-[#18191c] hover:bg-zinc-800 border border-zinc-800 ring-2 ring-zinc-700/60 group-hover:ring-[#EC0618]/70 flex items-center justify-center text-zinc-400 group-hover:text-white transition-all shadow-md">
              <User className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-zinc-600 border-2 border-[#010101]" />
          </button>
        )}

        {/* Center: Subtle Brand Mark */}
        <div className="flex items-center gap-1.5">
          <span className="font-display font-black text-white text-base tracking-tight uppercase">
            CHOPPER<span className="text-[#EC0618]">RIDE</span>
          </span>
        </div>

        {/* Right: Circular Search Button */}
        <button
          onClick={() => setIsMobileSearchOpen(true)}
          className="w-10 h-10 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer shadow-md"
          aria-label="Cari Chopper"
        >
          <Search className="w-4 h-4" />
        </button>

      </div>

      {/* 3. MOBILE GREETING (< md) */}
      <div className="md:hidden px-5 pt-3 pb-2">
        <div 
          className="cursor-pointer group inline-block"
          onClick={onOpenProfile}
          title="Kelola Profil & Keamanan Akun"
        >
          <h1 className="text-2xl font-display font-black text-white tracking-tight group-hover:text-zinc-200 transition-colors">
            Hello, {user ? (user.displayName?.split(' ')[0] || 'Rider') : 'Rider'}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Start your timeless adventure
          </p>
        </div>

        {/* Filter Chip Indicator (if active) */}
        {selectedEngineFilter !== 'all' && (
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-mono">Filter:</span>
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EC0618] text-white text-[11px] font-bold">
              <span>{engineFilters.find((f) => f.id === selectedEngineFilter)?.label}</span>
              <button onClick={() => setSelectedEngineFilter('all')} className="ml-1 text-white">✕</button>
            </div>
          </div>
        )}
      </div>

      {/* 4. MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-32 sm:pt-6 sm:pb-16 space-y-8 sm:space-y-10">
        
        {/* BANNER WITH CHOPPER MOTORCYCLE */}
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#0a0b0d] border border-zinc-800/80 p-6 sm:p-10 md:p-12 shadow-2xl">
          {/* Chopper Motorcycle Background Image */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <img
              src="https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?w=1600&auto=format&fit=crop&q=85"
              alt="Custom Chopper Motorcycle"
              className="absolute right-0 top-0 bottom-0 h-full w-full md:w-[75%] lg:w-[65%] object-cover object-[70%_center] md:object-right opacity-70 md:opacity-85 filter brightness-95 contrast-110"
            />
            {/* Dark gradient fade across text to guarantee crystal clear contrast and readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0d] via-[#0a0b0d]/90 via-50% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0d] via-transparent to-transparent md:hidden" />
            
            {/* Ambient Red Studio Spotlight Glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EC0618]/20 rounded-full blur-[140px]" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-[1.1] drop-shadow-md">
              Find the <br className="hidden sm:inline" />
              <span className="text-white">Nearest Chopper</span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 mt-3 sm:mt-4 leading-relaxed font-sans drop-shadow max-w-xl">
              Motor chopper kustom kurasi, surat akur 100%, cek fisik nomor rangka & mesin, serta pengiriman flatbed towing bergaransi rekber 2x24 jam.
            </p>
          </div>
        </div>

        {/* SECTION 1: HIGHLIGHT VIDEO MOTOR CHOPPER */}
        <div className="space-y-3 sm:space-y-4">
          {/* Main Cinematic YouTube Video Showcase Player */}
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 shadow-2xl">
            {/* 16:9 YouTube Video Embed */}
            <div className="relative w-full aspect-video max-h-[520px] bg-black">
              <iframe
                key={currentHighlight.youtubeId}
                src={`https://www.youtube-nocookie.com/embed/${currentHighlight.youtubeId}?autoplay=1&enablejsapi=1&rel=0&modestbranding=1`}
                title={currentHighlight.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Video Detail & Action Bar Below the Player */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#18191c] to-[#121316] border-t border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <h3 className="text-base sm:text-xl font-bold font-display text-white leading-tight">
                  {currentHighlight.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400">
                  {currentHighlight.subtitle}
                </p>
              </div>

              {/* Action Buttons: Cek Detail Unit & Tonton di YouTube */}
              <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
                <div className="text-left md:text-right hidden sm:block">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Harga Unit</span>
                  <span className="text-base sm:text-lg font-poppins font-bold text-white tracking-tight">
                    Rp {currentHighlight.motor?.price ? currentHighlight.motor.price.toLocaleString('id-ID') : '-'}
                  </span>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${currentHighlight.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Buka di YouTube"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Buka YouTube</span>
                </a>

                <button
                  onClick={() => {
                    if (currentHighlight.motor) {
                      handleSetDetailMotor(currentHighlight.motor);
                    }
                  }}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#EC0618]/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Cek Detail Unit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: KOLEKSI MOTOR CHOPPER (Card biasa menggunakan MotorCard) */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3 px-1 sm:px-0">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-display font-extrabold text-white tracking-tight leading-snug">
                Pilihan Chopper Kustom
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                Semua unit terinspeksi siap gas, surat lengkap, dan bergaransi rekber
              </p>
            </div>
            
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="shrink-0 whitespace-nowrap px-3.5 py-2 rounded-xl bg-[#161719] hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 flex items-center gap-1.5 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer font-poppins mt-0.5"
              aria-label="Filter Spesifikasi"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#EC0618]" />
              <span className="font-poppins">Filter Spek</span>
              {selectedEngineFilter !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-[#EC0618]" />
              )}
            </button>
          </div>

          {/* Cards Grid: Card Biasa Standar (MotorCard) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredMotors.map((motor) => (
              <MotorCard
                key={motor.id}
                motor={motor}
                onSelect={handleSetDetailMotor}
              />
            ))}
          </div>
        </div>

      </main>

      {/* 6. MOBILE SEARCH MODAL */}
      {isMobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <span className="text-sm font-bold text-white uppercase font-display">Cari Chopper</span>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="w-8 h-8 rounded-full bg-[#212325] flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="relative mt-4">
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik Binter Merzy, XS650, Harley, dll..."
              className="w-full bg-[#212325] border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0618]"
            />
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

          <div className="mt-4">
            <span className="text-xs font-mono text-zinc-400 uppercase">Pilihan Cepat Basis:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {engineFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedEngineFilter(f.id);
                    setIsMobileSearchOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedEngineFilter === f.id
                      ? 'bg-[#EC0618] text-white'
                      : 'bg-[#212325] text-zinc-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto space-y-2">
            <span className="text-xs font-mono text-zinc-400 uppercase">Hasil ({filteredMotors.length}):</span>
            {filteredMotors.slice(0, 5).map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  handleSetDetailMotor(m);
                  setIsMobileSearchOpen(false);
                }}
                className="p-3 rounded-2xl bg-[#212325] flex items-center gap-3 cursor-pointer"
              >
                <img src={m.mainImage} alt={m.title} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{m.title}</h4>
                  <p className="text-[11px] text-[#EC0618] font-mono font-bold mt-0.5">
                    Rp {m.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 7. ENGINE FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#212325] rounded-[32px] p-6 border border-zinc-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                Filter Basis Mesin
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {engineFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedEngineFilter(f.id);
                    setIsFilterModalOpen(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-full text-xs font-bold text-left flex items-center justify-between transition-colors ${
                    selectedEngineFilter === f.id
                      ? 'bg-[#EC0618] text-white shadow-md shadow-[#EC0618]/30'
                      : 'bg-[#18191c] text-zinc-300 hover:text-white'
                  }`}
                >
                  <span>{f.label}</span>
                  {selectedEngineFilter === f.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

