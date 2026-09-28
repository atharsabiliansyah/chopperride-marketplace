import React, { useState } from 'react';
import { ChopperMotor, EscrowTransaction } from '../../types';
import { PhoneFrame } from './PhoneFrame';
import { ScreenOnboarding } from './ScreenOnboarding';
import { ScreenHome } from './ScreenHome';
import { ScreenDetails } from './ScreenDetails';
import { ScreenEscrow } from './ScreenEscrow';
import { CheckoutModal } from '../CheckoutModal';
import { 
  Smartphone, 
  Columns, 
  RotateCcw, 
  Volume2, 
  ShieldCheck, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface MobileMarketplaceViewProps {
  motors: ChopperMotor[];
  activeEscrowTx: EscrowTransaction;
  onOpenSellModal: () => void;
  onUpdateEscrowTx: (tx: EscrowTransaction) => void;
}

export const MobileMarketplaceView: React.FC<MobileMarketplaceViewProps> = ({
  motors,
  activeEscrowTx,
  onOpenSellModal,
  onUpdateEscrowTx,
}) => {
  // Screens: 'onboarding' | 'home' | 'details' | 'escrow'
  const [activeScreen, setActiveScreen] = useState<'onboarding' | 'home' | 'details' | 'escrow'>('home');
  const [selectedMotor, setSelectedMotor] = useState<ChopperMotor>(motors[0] || {} as ChopperMotor);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'history' | 'settings'>('home');
  
  // View mode for desktop: 'triple' (like reference image with 3 phones) vs 'single'
  const [viewMode, setViewMode] = useState<'triple' | 'single'>('triple');

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleSelectMotor = (motor: ChopperMotor) => {
    setSelectedMotor(motor);
    setActiveScreen('details');
  };

  const handleBookNow = (motor: ChopperMotor) => {
    setSelectedMotor(motor);
    setIsCheckoutOpen(true);
  };

  const handleOpenEscrow = () => {
    setActiveNavTab('history');
    setActiveScreen('escrow');
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white flex flex-col justify-between py-6 px-4 select-none relative overflow-x-hidden">
      
      {/* Background Decorative Ambient Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EC0618]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-800/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar: Brand & View Mode Switcher */}
      <header className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 z-20">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EC0618] flex items-center justify-center shadow-lg shadow-[#EC0618]/30">
            <span className="font-display font-extrabold text-white text-xl">CR</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-white text-lg tracking-tight uppercase">
                CHOPPER<span className="text-[#EC0618]">RIDE</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#212325] border border-zinc-800 text-[10px] font-mono text-zinc-400">
                v2.0 Mobile UI
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Desain UI/UX Marketplace Kustom Sesuai Referensi
            </p>
          </div>
        </div>

        {/* View Mode Controls (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-[#212325] p-1 rounded-full border border-zinc-800">
          <button
            onClick={() => setViewMode('triple')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'triple'
                ? 'bg-[#EC0618] text-white shadow-md shadow-[#EC0618]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>3 Layar Sekaligus (Sesuai Gambar)</span>
          </button>

          <button
            onClick={() => setViewMode('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'single'
                ? 'bg-[#EC0618] text-white shadow-md shadow-[#EC0618]/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mode HP Interaktif</span>
          </button>
        </div>

        {/* Interactive screen quick switcher for mobile / single view */}
        <div className="flex lg:hidden items-center gap-1 bg-[#212325] p-1 rounded-full border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveScreen('onboarding')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              activeScreen === 'onboarding' ? 'bg-[#EC0618] text-white' : 'text-zinc-400'
            }`}
          >
            Welcome
          </button>
          <button
            onClick={() => setActiveScreen('home')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              activeScreen === 'home' ? 'bg-[#EC0618] text-white' : 'text-zinc-400'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveScreen('details')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all ${
              activeScreen === 'details' ? 'bg-[#EC0618] text-white' : 'text-zinc-400'
            }`}
          >
            Detail
          </button>
        </div>

      </header>

      {/* Main Phones Showcase Area */}
      <main className="flex-1 flex items-center justify-center my-4 z-10 w-full overflow-x-auto no-scrollbar">
        
        {/* TRIPLE VIEW (Displays all 3 screens side-by-side matching the uploaded reference image) */}
        {viewMode === 'triple' ? (
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8 items-start justify-center max-w-[1240px] mx-auto w-full px-2">
            
            {/* Phone 1: Onboarding / Welcome Screen */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                1. Onboarding Screen
              </span>
              <PhoneFrame>
                <ScreenOnboarding 
                  onGetStarted={() => {
                    setViewMode('single');
                    setActiveScreen('home');
                  }} 
                />
              </PhoneFrame>
            </div>

            {/* Phone 2: Home / Marketplace Screen */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold text-[#EC0618]">
                2. Marketplace Screen (Live)
              </span>
              <PhoneFrame>
                <ScreenHome
                  motors={motors}
                  onSelectMotor={(m) => {
                    setSelectedMotor(m);
                  }}
                  onOpenEscrow={handleOpenEscrow}
                  onOpenSell={onOpenSellModal}
                  activeNavTab="home"
                  onNavTabChange={(tab) => {
                    if (tab === 'history') handleOpenEscrow();
                    if (tab === 'settings') onOpenSellModal();
                  }}
                />
              </PhoneFrame>
            </div>

            {/* Phone 3: Details Screen */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-2 font-bold">
                3. Detail Unit Screen
              </span>
              <PhoneFrame>
                <ScreenDetails
                  motor={selectedMotor}
                  onBack={() => {
                    setActiveScreen('home');
                  }}
                  onBookNow={handleBookNow}
                />
              </PhoneFrame>
            </div>

          </div>
        ) : null}

        {/* SINGLE PHONE VIEW (Active on mobile or when Single mode is chosen) */}
        <div className={`w-full flex justify-center ${viewMode === 'triple' ? 'lg:hidden' : 'flex'}`}>
          <PhoneFrame>
            {activeScreen === 'onboarding' && (
              <ScreenOnboarding onGetStarted={() => setActiveScreen('home')} />
            )}

            {activeScreen === 'home' && (
              <ScreenHome
                motors={motors}
                onSelectMotor={handleSelectMotor}
                onOpenEscrow={handleOpenEscrow}
                onOpenSell={onOpenSellModal}
                activeNavTab={activeNavTab}
                onNavTabChange={(tab) => {
                  setActiveNavTab(tab);
                  if (tab === 'home') setActiveScreen('home');
                  if (tab === 'history') setActiveScreen('escrow');
                  if (tab === 'settings') onOpenSellModal();
                }}
              />
            )}

            {activeScreen === 'details' && (
              <ScreenDetails
                motor={selectedMotor}
                onBack={() => setActiveScreen('home')}
                onBookNow={handleBookNow}
              />
            )}

            {activeScreen === 'escrow' && (
              <ScreenEscrow
                transaction={activeEscrowTx}
                onBack={() => setActiveScreen('home')}
                onConfirmSuccess={() => {
                  onUpdateEscrowTx({
                    ...activeEscrowTx,
                    currentStep: 5,
                  });
                }}
              />
            )}
          </PhoneFrame>
        </div>

      </main>

      {/* Bottom Color Palette Showcase (Identical to COLORSELECT.T.ME in reference image) */}
      <footer className="max-w-md mx-auto w-full pt-8 pb-4 flex flex-col items-center justify-center z-20">
        
        <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-zinc-400 mb-3 uppercase">
          COLORSELECT.T.ME
        </span>

        {/* 3 Color Circles matching reference image */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          
          {/* Circle 1: Red #EC0618 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EC0618] flex items-center justify-center shadow-lg shadow-[#EC0618]/30 border border-white/10 hover:scale-105 transition-transform">
              <span className="text-[13px] font-mono font-black text-white">
                #EC0618
              </span>
            </div>
          </div>

          {/* Circle 2: Dark Gray #212325 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#212325] flex items-center justify-center shadow-lg shadow-black/60 border border-zinc-700/60 hover:scale-105 transition-transform">
              <span className="text-[13px] font-mono font-black text-white">
                #212325
              </span>
            </div>
          </div>

          {/* Circle 3: Pitch Black #010101 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#010101] flex items-center justify-center shadow-lg shadow-black/80 border border-zinc-800 ring-1 ring-zinc-700 hover:scale-105 transition-transform">
              <span className="text-[13px] font-mono font-black text-white">
                #010101
              </span>
            </div>
          </div>

        </div>

        <p className="text-[11px] text-zinc-500 font-mono mt-4 text-center">
          Pusat Jual-Beli Motor Chopper & Kustom Kultur Terkurasi dengan Garansi Rekber
        </p>

      </footer>

      {/* Checkout Modal when "Book now" is tapped */}
      {isCheckoutOpen && (
        <CheckoutModal
          motor={selectedMotor}
          options={{ addInspection: true, addTowingInsurance: true }}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={(tx) => {
            onUpdateEscrowTx(tx);
            setIsCheckoutOpen(false);
            setActiveScreen('escrow');
          }}
        />
      )}

    </div>
  );
};
