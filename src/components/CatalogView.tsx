import React, { useState, useMemo } from 'react';
import { ChopperMotor, LegalStatus, FrameType, EngineConfiguration, EngineCapacity, ChopperStyle } from '../types';
import { MotorCard } from './MotorCard';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  SlidersHorizontal, 
  ShieldCheck, 
  Flame, 
  X,
  ArrowUpDown,
  Check
} from 'lucide-react';

interface CatalogViewProps {
  motors: ChopperMotor[];
  onSelectMotor: (motor: ChopperMotor) => void;
  initialFilters?: {
    engineBase?: string;
    frameType?: string;
    budget?: string;
  };
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  motors,
  onSelectMotor,
  initialFilters,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLegalStatus, setSelectedLegalStatus] = useState<string>('');
  const [selectedFrameType, setSelectedFrameType] = useState<string>(initialFilters?.frameType || '');
  const [selectedEngineConfig, setSelectedEngineConfig] = useState<string>('');
  const [selectedEngineCapacity, setSelectedEngineCapacity] = useState<string>('');
  const [selectedChopperStyle, setSelectedChopperStyle] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'engine_size'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // If initialFilters had engineBase, pre-fill search query
  React.useEffect(() => {
    if (initialFilters?.engineBase) {
      setSearchQuery(initialFilters.engineBase);
    }
  }, [initialFilters]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLegalStatus('');
    setSelectedFrameType('');
    setSelectedEngineConfig('');
    setSelectedEngineCapacity('');
    setSelectedChopperStyle('');
    setSelectedLocation('');
    setSortBy('featured');
  };

  const activeFilterCount = [
    selectedLegalStatus,
    selectedFrameType,
    selectedEngineConfig,
    selectedEngineCapacity,
    selectedChopperStyle,
    selectedLocation,
  ].filter(Boolean).length;

  // Filtered and Sorted motors
  const filteredMotors = useMemo(() => {
    return motors.filter((motor) => {
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = motor.title.toLowerCase().includes(q);
        const matchEngine = motor.buildSheet.engineBase.toLowerCase().includes(q);
        const matchBuilder = motor.builder.workshopName.toLowerCase().includes(q);
        const matchLocation = motor.location.toLowerCase().includes(q);
        if (!matchTitle && !matchEngine && !matchBuilder && !matchLocation) return false;
      }

      // Legal Status
      if (selectedLegalStatus && motor.legalStatus !== selectedLegalStatus) {
        return false;
      }

      // Frame Type
      if (selectedFrameType && motor.frameType !== selectedFrameType) {
        return false;
      }

      // Engine Configuration
      if (selectedEngineConfig && motor.engineConfig !== selectedEngineConfig) {
        return false;
      }

      // Engine Capacity
      if (selectedEngineCapacity && motor.engineCapacity !== selectedEngineCapacity) {
        return false;
      }

      // Chopper Style
      if (selectedChopperStyle && motor.chopperStyle !== selectedChopperStyle) {
        return false;
      }

      // Location
      if (selectedLocation && !motor.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Budget filter if set from initial
      if (initialFilters?.budget) {
        if (initialFilters.budget === 'under_30m' && motor.price >= 30000000) return false;
        if (initialFilters.budget === '30m_75m' && (motor.price < 30000000 || motor.price > 75000000)) return false;
        if (initialFilters.budget === 'over_75m' && motor.price <= 75000000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.price - b.price;
      if (sortBy === 'price_high') return b.price - a.price;
      if (sortBy === 'engine_size') return b.buildSheet.displacementCc - a.buildSheet.displacementCc;
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    motors,
    searchQuery,
    selectedLegalStatus,
    selectedFrameType,
    selectedEngineConfig,
    selectedEngineCapacity,
    selectedChopperStyle,
    selectedLocation,
    sortBy,
    initialFilters,
  ]);

  const SidebarContent = (
    <div className="space-y-6">
      
      {/* Header Filter & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#EC0618]" />
          <span className="text-sm font-display font-bold uppercase tracking-wider text-white">
            Filter Khusus Kustom
          </span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="text-xs text-[#EC0618] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ({activeFilterCount})</span>
          </button>
        )}
      </div>

      {/* 1. Status Legalitas Dokumen */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-mono uppercase text-zinc-300 block">
          Legalitas & Dokumen
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { id: '', label: 'Semua Status Dokumen' },
            { id: 'bpkb_stnk_akur', label: 'BPKB & STNK Lengkap (Akur)' },
            { id: 'pajak_hidup', label: 'Pajak Hidup / On' },
            { id: 'pajak_mati', label: 'Pajak Mati (Ada Surat)' },
            { id: 'display_only_no_paper', label: 'Display Only / No Paper' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                selectedLegalStatus === item.id 
                  ? 'bg-[#212325] text-white font-semibold border border-zinc-700' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <input
                type="radio"
                name="legalStatus"
                checked={selectedLegalStatus === item.id}
                onChange={() => setSelectedLegalStatus(item.id)}
                className="accent-[#EC0618]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Tipe Rangka (Frame) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-mono uppercase text-zinc-300 block">
          Tipe Rangka (Frame)
        </label>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          {[
            { id: '', label: 'Semua Tipe Rangka' },
            { id: 'rigid_frame', label: 'Rigid Frame (Hardtail)' },
            { id: 'softail', label: 'Softail (Hidden Shock)' },
            { id: 'gooseneck', label: 'Gooseneck (Leher Angsa)' },
            { id: 'drop_seat', label: 'Drop Seat (Ceper Nyaman)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedFrameType(item.id)}
              className={`text-left px-3 py-2 rounded-xl transition-all cursor-pointer ${
                selectedFrameType === item.id
                  ? 'bg-[#EC0618] text-white font-bold shadow-sm'
                  : 'bg-[#18191c] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Basis Mesin & Konfigurasi Silinder */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-mono uppercase text-zinc-300 block">
          Konfigurasi Mesin
        </label>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          {[
            { id: '', label: 'Semua Konfigurasi' },
            { id: 'v_twin', label: 'V-Twin (Harley-Davidson / Shovel)' },
            { id: 'parallel_twin', label: 'Parallel Twin (Yamaha XS650)' },
            { id: 'single_cylinder', label: 'Single Cylinder (Merzy / Tiger / SR)' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors ${
                selectedEngineConfig === item.id 
                  ? 'bg-[#212325] text-white font-semibold border border-zinc-700' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <input
                type="radio"
                name="engineConfig"
                checked={selectedEngineConfig === item.id}
                onChange={() => setSelectedEngineConfig(item.id)}
                className="accent-[#EC0618]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Kapasitas Mesin (cc) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-mono uppercase text-zinc-300 block">
          Kapasitas Silinder
        </label>
        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {[
            { id: '', label: 'Semua' },
            { id: '<250cc', label: '< 250cc' },
            { id: '250cc-650cc', label: '250-650cc' },
            { id: '>1000cc', label: '> 1000cc' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedEngineCapacity(item.id)}
              className={`py-1.5 px-2 rounded-lg text-center font-mono font-bold transition-all cursor-pointer ${
                selectedEngineCapacity === item.id
                  ? 'bg-[#EC0618] text-white'
                  : 'bg-[#18191c] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Aliran Chopper */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-mono uppercase text-zinc-300 block">
          Aliran Chopper
        </label>
        <div className="space-y-1 text-xs">
          {[
            { id: '', label: 'Semua Aliran' },
            { id: 'traditional_chopper', label: 'Traditional Chopper' },
            { id: 'frisco_style', label: 'Frisco Style (High Tank)' },
            { id: 'bobber_chopper', label: 'Bobber-Chopper (Ban Donat)' },
            { id: 'digger', label: 'Digger (Prism Gooseneck)' },
            { id: 'japanese_narrow', label: 'Japanese Narrow' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedChopperStyle(item.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedChopperStyle === item.id
                  ? 'bg-[#212325] text-[#EC0618] font-bold border-l-2 border-[#EC0618]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Lokasi Unit (Untuk Cek Fisik & Tarif Towing) */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold font-mono uppercase text-zinc-300 block">
          Lokasi Unit (Towing & Cek Fisik)
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#EC0618] cursor-pointer"
        >
          <option value="">Semua Kota / Provinsi</option>
          <option value="Jakarta">DKI Jakarta & Sekitarnya</option>
          <option value="Bandung">Bandung, Jawa Barat</option>
          <option value="Yogyakarta">D.I. Yogyakarta</option>
          <option value="Bali">Denpasar, Bali</option>
          <option value="Surabaya">Surabaya, Jawa Timur</option>
        </select>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC0618]/15 border border-[#EC0618]/30 text-[#EC0618] text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Katalog Resmi ChopperRide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
            Eksplorasi Motor Chopper & Kustom
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Temukan chopper idaman Anda dengan filter spesifik kustom kultur, status nomor akur, dan jaminan keamanan transaksi rekening bersama.
          </p>
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-[#121316] border border-zinc-800">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari basis mesin (XS650, Merzy, Shovel), builder, atau tipe rangka..."
              className="w-full bg-[#18191c] border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#EC0618] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#212325] border border-zinc-700 text-sm font-semibold text-white"
            >
              <Filter className="w-4 h-4 text-[#EC0618]" />
              <span>Filter ({activeFilterCount})</span>
            </button>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-zinc-400 hidden sm:inline" />
              <select
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#18191c] border border-zinc-700/80 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-zinc-200 font-medium focus:outline-none focus:border-[#EC0618] cursor-pointer"
              >
                <option value="featured">Rekomendasi Kurator</option>
                <option value="price_low">Harga: Terendah</option>
                <option value="price_high">Harga: Tertinggi</option>
                <option value="engine_size">Kapasitas Mesin (CC)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Grid with Sidebar Filter */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar Filter (Sidebar Filter Khusus Otomotif Kustom) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28 p-5 rounded-2xl bg-[#121316] border border-zinc-800">
              {SidebarContent}
            </div>
          </div>

          {/* Motors Listing Area */}
          <div className="lg:col-span-3">
            
            {/* Active Query Status */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs font-mono text-zinc-400">
                Menampilkan <strong className="text-white">{filteredMotors.length}</strong> unit chopper terkurasi
              </span>
            </div>

            {/* If No Motors Found */}
            {filteredMotors.length === 0 ? (
              <div className="p-12 rounded-3xl bg-[#121316] border border-zinc-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800 mx-auto flex items-center justify-center text-zinc-500">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Tidak ada chopper yang cocok dengan filter</h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Coba ubah kriteria basis mesin, rentang kapasitas silinder, atau atur ulang filter Anda.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-[#EC0618] text-white text-xs font-bold"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredMotors.map((motor) => (
                  <MotorCard
                    key={motor.id}
                    motor={motor}
                    onSelect={onSelectMotor}
                  />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm h-full bg-[#121316] p-6 overflow-y-auto border-l border-zinc-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white">Filter Otomotif Kustom</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {SidebarContent}

            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-[#EC0618] text-white font-bold text-sm"
              >
                Terapkan Filter ({filteredMotors.length} Unit)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
