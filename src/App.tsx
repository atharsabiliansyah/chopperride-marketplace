import React, { useState, useEffect } from 'react';
import { 
  ChopperMotor, 
  BuilderInfo, 
  EscrowTransaction, 
  ChopperFilterState 
} from './types';
import { 
  CHOPPER_DATASET, 
  VERIFIED_BUILDERS, 
  INITIAL_ESCROW_TRANSACTION 
} from './data/mockData';
import { LuxuryMarketplaceView } from './components/LuxuryMarketplaceView';
import { EscrowTrackingView } from './components/EscrowTrackingView';
import { EscrowEducationSection } from './components/EscrowEducationSection';
import { SellerDashboardView } from './components/SellerDashboardView';
import { ChatModal } from './components/ChatModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SearchModal } from './components/SearchModal';
import { BusinessModelCanvasModal } from './components/BusinessModelCanvasModal';
import { CompensationClaimModal } from './components/CompensationClaimModal';
import { ConsultationSolutionModal } from './components/ConsultationSolutionModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthProvider } from './context/AuthContext';
import { motion } from 'motion/react';
import { ArrowLeft, Home, Plus, ShieldCheck, HeartHandshake } from 'lucide-react';

function AppContent() {
  const [currentView, setCurrentView] = useState<'marketplace' | 'escrow' | 'seller'>('marketplace');
  const [resetCatalogSignal, setResetCatalogSignal] = useState(0);
  
  // Persistent Motors State (Loads from localStorage or initial dataset)
  const [motors, setMotors] = useState<ChopperMotor[]>(() => {
    try {
      const saved = localStorage.getItem('chopperride_motors_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Gagal membaca saved motors dari localStorage:', e);
    }
    return CHOPPER_DATASET;
  });

  // Keep localStorage synced whenever motors update
  useEffect(() => {
    try {
      localStorage.setItem('chopperride_motors_v2', JSON.stringify(motors));
    } catch (e) {
      console.warn('Gagal menyimpan motors ke localStorage:', e);
    }
  }, [motors]);

  const [selectedMotor, setSelectedMotor] = useState<ChopperMotor>(motors[0] || CHOPPER_DATASET[0]);
  const [activeEscrowTx, setActiveEscrowTx] = useState<EscrowTransaction>(INITIAL_ESCROW_TRANSACTION);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeChatBuilder, setActiveChatBuilder] = useState<BuilderInfo>(VERIFIED_BUILDERS[0]);
  const [activeChatTitle, setActiveChatTitle] = useState<string>('');
  
  // Assignment & Service Modals (Sesuai Tugas Presentasi & Slide)
  const [isBmcOpen, setIsBmcOpen] = useState(false);
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutOptions, setCheckoutOptions] = useState<{ addInspection: boolean; addTowingInsurance: boolean }>({
    addInspection: true,
    addTowingInsurance: true,
  });

  const handleSelectMotor = (motor: ChopperMotor) => {
    setSelectedMotor(motor);
  };

  const handleBookNow = (motor: ChopperMotor) => {
    setSelectedMotor(motor);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSuccess = (newTx: EscrowTransaction) => {
    setIsCheckoutOpen(false);
    setActiveEscrowTx(newTx);
    setCurrentView('escrow');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddNewListing = (newMotor: ChopperMotor) => {
    setMotors((prev) => [newMotor, ...prev]);
    setSelectedMotor(newMotor);
  };

  const handleDeleteListing = (motorId: string) => {
    setMotors((prev) => prev.filter((m) => m.id !== motorId));
  };

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 flex flex-col selection:bg-[#EC0618] selection:text-white font-sans antialiased">
      
      {/* 1. SELLER DASHBOARD VIEW */}
      {currentView === 'seller' ? (
        <div className="min-h-screen flex flex-col bg-[#010101] pb-28 md:pb-0">
          <div className="bg-[#121316] border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('marketplace')}
              className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#EC0618]" />
              <span>Kembali ke Marketplace</span>
            </button>
          </div>
          <SellerDashboardView
            myMotors={motors.filter(m => m.id.startsWith('cr-user-') || (m as any).isUserListing)}
            onAddNewListing={(listing) => {
              handleAddNewListing(listing);
            }}
            onDeleteListing={(motorId) => {
              handleDeleteListing(motorId);
            }}
            onViewInMarketplace={(motor) => {
              setSelectedMotor(motor);
              setCurrentView('marketplace');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      ) : currentView === 'escrow' ? (
        /* 2. ESCROW REKBER STATUS VIEW */
        <div className="min-h-screen flex flex-col bg-[#010101] pb-28 md:pb-0">
          <div className="bg-[#121316] border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentView('marketplace')}
              className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#EC0618]" />
              <span>Kembali ke Marketplace</span>
            </button>
          </div>

          <EscrowEducationSection
            onLearnMoreClick={() => {}}
            onViewLiveEscrow={() => {
              const el = document.getElementById('tracking-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          <div id="tracking-section" className="py-8">
            <EscrowTrackingView
              currentTransaction={activeEscrowTx}
              onConfirmSuccess={() => {
                setActiveEscrowTx((prev) => ({ ...prev, currentStep: 5 }));
              }}
            />
          </div>
        </div>
      ) : (
        /* 3. PRIMARY LUXURY MARKETPLACE (NO PHONE BEZELS - EXACT DESIGN FROM REFERENCE) */
        <LuxuryMarketplaceView
          motors={motors}
          activeEscrowTx={activeEscrowTx}
          onSelectMotor={handleSelectMotor}
          onBookNow={handleBookNow}
          onOpenSell={() => {
            setIsDetailViewOpen(false);
            setCurrentView('seller');
          }}
          onOpenEscrow={() => {
            setIsDetailViewOpen(false);
            setCurrentView('escrow');
          }}
          onOpenBmc={() => setIsBmcOpen(true)}
          onOpenClaim={() => setIsClaimOpen(true)}
          onOpenConsultation={() => setIsConsultationOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          resetCatalogSignal={resetCatalogSignal}
          onDetailChange={setIsDetailViewOpen}
        />
      )}

      {/* Interactive Modals */}
      {isSearchOpen && (
        <SearchModal
          motors={motors}
          onSelectMotor={(m) => {
            setSelectedMotor(m);
            setIsSearchOpen(false);
          }}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* User Security & Google Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {isChatOpen && (
        <ChatModal
          builder={activeChatBuilder}
          motorTitle={activeChatTitle}
          onClose={() => setIsChatOpen(false)}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          motor={selectedMotor}
          options={checkoutOptions}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* 9 Elements BMC & Rancangan Usaha Modal */}
      {isBmcOpen && (
        <BusinessModelCanvasModal
          onClose={() => setIsBmcOpen(false)}
          onOpenCODInfo={() => {
            setIsBmcOpen(false);
            handleBookNow(selectedMotor);
          }}
          onOpenClaimInfo={() => {
            setIsBmcOpen(false);
            setIsClaimOpen(true);
          }}
          onOpenConsultation={() => {
            setIsBmcOpen(false);
            setIsConsultationOpen(true);
          }}
        />
      )}

      {/* Layanan Ganti Rugi Modal (Standar Layanan #5) */}
      {isClaimOpen && (
        <CompensationClaimModal
          onClose={() => setIsClaimOpen(false)}
          defaultInvoice={activeEscrowTx.invoiceNumber}
        />
      )}

      {/* Layanan Konsultasi & Solusi Cepat Modal (Standar Layanan #1, #2, #3) */}
      {isConsultationOpen && (
        <ConsultationSolutionModal
          motors={motors}
          onClose={() => setIsConsultationOpen(false)}
          onSelectMotor={(m) => {
            setSelectedMotor(m);
            setIsConsultationOpen(false);
          }}
        />
      )}

      {/* Mobile Floating Bottom Navigation Dock (< md) with Smooth Sliding Active Bubble */}
      {!isDetailViewOpen && !isCheckoutOpen && !isClaimOpen && !isBmcOpen && !isSearchOpen && !isProfileOpen && !isChatOpen && (
        <nav 
          id="mobile-bottom-dock"
          className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#121316]/95 backdrop-blur-2xl border border-zinc-700/70 rounded-full p-1.5 flex items-center gap-2 shadow-2xl shadow-black/90 ring-1 ring-white/10"
          aria-label="Navigasi Utama Mobile"
        >
          {[
            { id: 'home' as const, label: 'Beranda Katalog', icon: Home },
            { id: 'sell' as const, label: 'Pasang Iklan Chopper', icon: Plus },
            { id: 'escrow' as const, label: 'Rekber Escrow', icon: ShieldCheck },
            { id: 'consultation' as const, label: 'Konsultasi & CS', icon: HeartHandshake },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = (
              isConsultationOpen 
                ? tab.id === 'consultation' 
                : currentView === 'seller' 
                ? tab.id === 'sell' 
                : currentView === 'escrow' 
                ? tab.id === 'escrow' 
                : tab.id === 'home'
            );

            return (
              <button
                key={tab.id}
                id={`dock-tab-${tab.id}`}
                onClick={() => {
                  if (tab.id === 'home') {
                    setIsDetailViewOpen(false);
                    setIsConsultationOpen(false);
                    setCurrentView('marketplace');
                    setResetCatalogSignal((prev) => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (tab.id === 'sell') {
                    setIsDetailViewOpen(false);
                    setIsConsultationOpen(false);
                    setCurrentView('seller');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (tab.id === 'escrow') {
                    setIsDetailViewOpen(false);
                    setIsConsultationOpen(false);
                    setCurrentView('escrow');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (tab.id === 'consultation') {
                    setIsConsultationOpen(true);
                  }
                }}
                className="relative w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-90 select-none"
                aria-label={tab.label}
                title={tab.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeDockBubble"
                    className="absolute inset-0 rounded-full bg-[#EC0618] shadow-lg shadow-[#EC0618]/50"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
                <Icon 
                  className={`w-4 h-4 relative z-10 transition-colors duration-200 ${
                    isActive ? 'text-white stroke-[2.5]' : 'text-zinc-400 hover:text-white'
                  }`} 
                />
              </button>
            );
          })}
        </nav>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
