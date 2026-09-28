import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wrench, 
  Hammer, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  Menu, 
  X,
  Compass,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenSearch: () => void;
  onOpenSellModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenSellModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'catalog', label: 'Katalog Chopper', icon: Search },
    { id: 'escrow', label: 'Cara Kerja Rekber', icon: ShieldCheck },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#010101]/90 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            id="nav-logo"
            onClick={() => handleNavClick('catalog')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EC0618] to-[#99040f] flex items-center justify-center shadow-lg shadow-[#EC0618]/25 group-hover:scale-105 transition-all">
              <span className="text-white font-display font-extrabold text-xl tracking-tighter">CR</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-display font-black tracking-tight text-white group-hover:text-zinc-100">
                  CHOPPER<span className="text-[#EC0618]">RIDE</span>
                </span>
                <span className="text-[10px] bg-zinc-800 border border-zinc-700/60 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-bold tracking-wider">
                  ID
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
                Jual-Beli Motor Chopper Terkurasi
              </span>
            </div>
          </div>

          {/* Clean Desktop Navigation Links (Simplified - no confusing badges) */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'catalog' && currentView === 'home');
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'text-white bg-[#212325] border border-zinc-700/70 shadow-sm' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#EC0618]' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Jual Motor */}
          <div className="flex items-center gap-3">
            <button
              id="nav-btn-sell"
              onClick={onOpenSellModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-sm shadow-lg shadow-[#EC0618]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Jual Motor</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              id="nav-btn-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#18191c] border border-zinc-800 text-zinc-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0b0d] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-[#212325] text-white border border-[#EC0618]/40' 
                    : 'text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#EC0618]' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
          <div className="pt-3 border-t border-zinc-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSellModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#EC0618] text-white font-bold text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Pasang Iklan / Jual Motor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
