import React, { useState } from 'react';
import { 
  Hammer, 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  Sparkles,
  Award,
  Layers,
  Camera,
  Coins
} from 'lucide-react';
import { BuilderInfo, ChopperStyle, FrameType } from '../types';
import { VERIFIED_BUILDERS, CHOPPER_STYLE_OPTIONS, ENGINE_BASE_OPTIONS } from '../data/mockData';

interface CustomBuildOrderViewProps {
  preselectedBuilderId?: string;
  onSubmitOrder: (orderData: any) => void;
  onNavigateToEscrow: () => void;
}

export const CustomBuildOrderView: React.FC<CustomBuildOrderViewProps> = ({
  preselectedBuilderId,
  onSubmitOrder,
  onNavigateToEscrow,
}) => {
  // Wizard state
  const [selectedStyle, setSelectedStyle] = useState<ChopperStyle>('traditional_chopper');
  const [selectedEngine, setSelectedEngine] = useState<string>('Kawasaki Binter Merzy KZ200');
  const [engineSource, setEngineSource] = useState<'provided_by_client' | 'sourced_by_builder'>('sourced_by_builder');
  const [selectedFrame, setSelectedFrame] = useState<FrameType>('rigid_frame');
  const [selectedBuilderId, setSelectedBuilderId] = useState<string>(preselectedBuilderId || VERIFIED_BUILDERS[0].id);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState<number>(45000000);
  const [conceptNotes, setConceptNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Selected engine details
  const currentEngineObj = ENGINE_BASE_OPTIONS.find(e => e.name === selectedEngine) || ENGINE_BASE_OPTIONS[2];
  const selectedBuilder = VERIFIED_BUILDERS.find(b => b.id === selectedBuilderId) || VERIFIED_BUILDERS[0];

  // Milestone Calculations
  const milestone1Amount = Math.round(estimatedBudget * 0.30);
  const milestone2Amount = Math.round(estimatedBudget * 0.40);
  const milestone3Amount = Math.round(estimatedBudget * 0.30);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    onSubmitOrder({
      style: selectedStyle,
      engine: selectedEngine,
      engineSource,
      frame: selectedFrame,
      builder: selectedBuilder,
      budget: estimatedBudget,
      name: clientName,
      phone: clientPhone,
      city: clientCity,
      notes: conceptNotes,
    });
  };

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs font-mono text-[#EC0618] font-bold tracking-widest uppercase mb-3">
            Custom Build Order
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tight">
            Bangun Chopper Impian Dari Nol <br />
            <span className="text-zinc-400 font-normal">Bersama Builder Berpengalaman</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
            Wujudkan karya kustom murni dengan skema pembayaran bertahap (Milestone Payment). Dana Anda dicairkan secara bertahap hanya setelah setiap progres fisik selesai dan disetujui.
          </p>
        </div>

        {/* Milestone Payment Explanation Banner (Sistem Pembayaran Bertahap Sesuai Spesifikasi) */}
        <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#121316] border border-zinc-800 relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
            <div className="p-2.5 rounded-xl bg-[#EC0618]/15 text-[#EC0618] border border-[#EC0618]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Sistem Pembayaran Bertahap (Milestone Payment 30% - 40% - 30%)
              </h3>
              <p className="text-xs text-zinc-400">
                Uang muka tidak langsung diserahkan seluruhnya ke bengkel, melainkan ditampung di Rekber Escrow ChopperRide.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Milestone 1 */}
            <div className="p-5 rounded-2xl bg-[#18191c] border border-zinc-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs font-bold">
                  Tahap 1 (30%)
                </span>
                <span className="text-xs font-mono font-bold text-[#EC0618]">
                  {formatPrice(milestone1Amount)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                Perakitan Sasis & Kaki-Kaki
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pembuatan sasis rigid/softail di jig presisi, fitting stang, pemasangan springer fork, dan tromol/pelek.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#EC0618]" />
                <span>Bukti foto & video jig laser</span>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="p-5 rounded-2xl bg-[#18191c] border border-zinc-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs font-bold">
                  Tahap 2 (40%)
                </span>
                <span className="text-xs font-mono font-bold text-[#EC0618]">
                  {formatPrice(milestone2Amount)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                Naik Mesin & Bodywork Cat
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pemasangan mesin ke sasis, pembuatan tangki kustom plat galvanis, spatbor belakang, serta proses pengecatan pinstripe.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#EC0618]" />
                <span>Bukti visual hasil cat & clear coat</span>
              </div>
            </div>

            {/* Milestone 3 */}
            <div className="p-5 rounded-2xl bg-[#18191c] border border-zinc-800 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs font-bold">
                  Tahap 3 (30%)
                </span>
                <span className="text-xs font-mono font-bold text-[#EC0618]">
                  {formatPrice(milestone3Amount)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">
                Kelistrikan, Uji Jalan & Serah Terima
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Wiring kabel tersembunyi, video cold start pertama, test ride 50km, lalu pengiriman unit via towing khusus.
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Garansi 2x24 jam setelah unit tiba</span>
              </div>
            </div>

          </div>
        </div>

        {/* Order Form & Live Configuration */}
        {isSubmitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#121316] border border-emerald-500/40 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-2xl font-bold text-white">Pesanan Rakit Berhasil Didaftarkan!</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Konsep rakit chopper untuk <strong>{clientName || 'Pelanggan'}</strong> telah diteruskan ke bengkel <strong>{selectedBuilder.workshopName}</strong>. Tim escrow akan menghubungi Anda untuk penandatanganan SPK digital dan deposit Tahap 1.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#18191c] border border-zinc-800 max-w-lg mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nomor Registrasi Order:</span>
                <span className="font-mono text-white font-bold">#CR-ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estimasi Total Bujet:</span>
                <span className="font-mono text-[#EC0618] font-bold">{formatPrice(estimatedBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Deposit Rekber Tahap 1 (30%):</span>
                <span className="font-mono text-white font-bold">{formatPrice(milestone1Amount)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={onNavigateToEscrow}
                className="px-6 py-3 rounded-full bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-xs transition-all shadow-lg shadow-[#EC0618]/25 cursor-pointer"
              >
                Lihat Simulasi Alur Rekber Escrow
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 rounded-full bg-[#212325] text-zinc-300 hover:text-white text-xs font-semibold"
              >
                Kirim Konsep Lain
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 7 Columns: Form Input */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Aliran Chopper */}
              <div className="p-6 rounded-3xl bg-[#121316] border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EC0618] text-white flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Pilih Aliran Chopper Yang Diinginkan
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {CHOPPER_STYLE_OPTIONS.map((style) => (
                    <label
                      key={style.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedStyle === style.id
                          ? 'bg-[#212325] border-[#EC0618] text-white'
                          : 'bg-[#18191c] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="chopperStyle"
                        checked={selectedStyle === style.id}
                        onChange={() => setSelectedStyle(style.id as ChopperStyle)}
                        className="mt-1 accent-[#EC0618]"
                      />
                      <div>
                        <span className="font-bold text-xs text-white block">
                          {style.label}
                        </span>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {style.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Step 2: Basis Mesin & Sumber Pengadaan Mesin */}
              <div className="p-6 rounded-3xl bg-[#121316] border border-zinc-800 space-y-5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EC0618] text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Basis Mesin & Sumber Pengadaan (Sesuai Syarat)
                  </h3>
                </div>

                {/* Sumber Mesin Toggle: Disediakan Sendiri vs Dicarikan Builder */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-semibold block">
                    Apakah bahan mesin disediakan sendiri atau dicarikan builder?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEngineSource('sourced_by_builder')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        engineSource === 'sourced_by_builder'
                          ? 'bg-[#212325] border-[#EC0618] text-white'
                          : 'bg-[#18191c] border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">Dicarikan oleh Builder</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Bengkel mencarikan mesin sehat berdokumen lengkap
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEngineSource('provided_by_client')}
                      className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                        engineSource === 'provided_by_client'
                          ? 'bg-[#212325] border-[#EC0618] text-white'
                          : 'bg-[#18191c] border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="text-xs font-bold block">Bahan Disediakan Sendiri</span>
                      <span className="text-[10px] text-zinc-400 block mt-0.5">
                        Anda mengirimkan motor/gelondongan mesin ke bengkel
                      </span>
                    </button>
                  </div>
                </div>

                {/* Engine Base Selector */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-semibold block">
                    Pilih Basis Mesin:
                  </label>
                  <select
                    value={selectedEngine}
                    onChange={(e) => setSelectedEngine(e.target.value)}
                    className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#EC0618] cursor-pointer"
                  >
                    {ENGINE_BASE_OPTIONS.map((engine) => (
                      <option key={engine.name} value={engine.name}>
                        {engine.name} ({engine.capacityRange})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-zinc-400 italic">
                    Karakter: {currentEngineObj.character}
                  </p>
                </div>

                {/* Tipe Rangka */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-semibold block">
                    Pilihan Tipe Rangka (Frame):
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'rigid_frame', label: 'Rigid Hardtail' },
                      { id: 'softail', label: 'Softail (Hidden Shock)' },
                      { id: 'gooseneck', label: 'Gooseneck Leher Angsa' },
                      { id: 'drop_seat', label: 'Drop Seat Ceper' },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFrame(f.id as FrameType)}
                        className={`py-2 px-3 rounded-xl text-left border transition-all cursor-pointer ${
                          selectedFrame === f.id
                            ? 'bg-[#EC0618] border-[#EC0618] text-white font-bold'
                            : 'bg-[#18191c] border-zinc-800 text-zinc-400'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Step 3: Pilih Bengkel Rekanan & Kontak Pemesan */}
              <div className="p-6 rounded-3xl bg-[#121316] border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#EC0618] text-white flex items-center justify-center text-xs font-black">
                    3
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Pilih Bengkel Builder & Data Pemesan
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-zinc-400 font-semibold block">
                    Pilih Bengkel Rekanan:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {VERIFIED_BUILDERS.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBuilderId(b.id)}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          selectedBuilderId === b.id
                            ? 'bg-[#212325] border-[#EC0618] text-white'
                            : 'bg-[#18191c] border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <img
                          src={b.avatar}
                          alt={b.workshopName}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-white block truncate">
                            {b.workshopName}
                          </span>
                          <span className="text-[10px] text-zinc-400 block truncate">
                            {b.city} • ★ {b.rating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Input Data Pemesan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                      Nama Lengkap Anda:
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Contoh: Rian Pratama"
                      className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                      Nomor WhatsApp:
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                    Kota Domisili (Tujuan Pengiriman):
                  </label>
                  <input
                    type="text"
                    required
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan"
                    className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                    Catatan Konsep Tambahan (Warna Cat, Stang, Sissy Bar):
                  </label>
                  <textarea
                    rows={3}
                    value={conceptNotes}
                    onChange={(e) => setConceptNotes(e.target.value)}
                    placeholder="Contoh: Ingin warna cat candy apple red dengan pinstripe emas, stang rabbit ear tinggi 25cm, knalpot fishtail upswept..."
                    className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  />
                </div>

              </div>

            </div>

            {/* Right 5 Columns: Budget Slider & Milestone Contract Preview */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="sticky top-28 p-6 sm:p-7 rounded-3xl bg-[#18191c] border border-zinc-800 shadow-2xl space-y-6">
                
                <div>
                  <span className="text-xs uppercase font-mono text-zinc-400 block mb-1">
                    Estimasi Rencana Bujet
                  </span>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                    {formatPrice(estimatedBudget)}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Sesuaikan bujet kustom Anda untuk disinkronkan dengan SPK perakitan bengkel.
                  </p>
                </div>

                {/* Range Slider for Budget */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min={25000000}
                    max={200000000}
                    step={2500000}
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                    className="w-full accent-[#EC0618] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>Rp 25 Juta</span>
                    <span>Rp 100 Juta</span>
                    <span>Rp 200 Juta</span>
                  </div>
                </div>

                {/* Live Milestone Breakdown */}
                <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3">
                  <span className="text-xs font-mono uppercase text-zinc-400 font-bold block pb-1 border-b border-zinc-800">
                    Pembagian Termin Rekber Escrow:
                  </span>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-semibold block">Tahap 1 (30%):</span>
                      <span className="text-[11px] text-zinc-400">Rangka & Kaki-kaki</span>
                    </div>
                    <span className="font-mono text-zinc-200 font-bold">
                      {formatPrice(milestone1Amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-semibold block">Tahap 2 (40%):</span>
                      <span className="text-[11px] text-zinc-400">Naik Mesin & Cat Tangki</span>
                    </div>
                    <span className="font-mono text-zinc-200 font-bold">
                      {formatPrice(milestone2Amount)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="text-white font-semibold block">Tahap 3 (30%):</span>
                      <span className="text-[11px] text-zinc-400">Wiring, Test Ride & Towing</span>
                    </div>
                    <span className="font-mono text-zinc-200 font-bold">
                      {formatPrice(milestone3Amount)}
                    </span>
                  </div>
                </div>

                {/* Selected Builder Summary */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#212325] border border-zinc-700/60">
                  <img
                    src={selectedBuilder.avatar}
                    alt={selectedBuilder.workshopName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[10px] text-zinc-400 block uppercase font-mono">Bengkel Rekanan:</span>
                    <span className="text-xs font-bold text-white block">{selectedBuilder.workshopName}</span>
                    <span className="text-[10px] text-emerald-400">Status: Slot Rakit Tersedia</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-sm shadow-xl shadow-[#EC0618]/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
                >
                  <Hammer className="w-4 h-4" />
                  <span>Kirim Formulir Pemesanan</span>
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-mono font-black">
                    &gt;&gt;&gt;
                  </span>
                </button>

                <p className="text-[11px] text-zinc-500 text-center leading-relaxed">
                  Pengiriman formulir tidak memotong saldo apapun. Kontrak kerja sama akan diterbitkan setelah negosiasi detail selesai.
                </p>

              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
