import React, { useState, useEffect } from 'react';
import { 
  ChopperMotor, 
  BuilderInfo 
} from '../types';
import { 
  ShieldCheck, 
  Volume2, 
  VolumeX,
  Play, 
  Square, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck2, 
  Wrench, 
  Truck, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Gauge,
  Thermometer,
  Lock,
  ArrowRight,
  Star,
  Clock,
  Share2,
  Heart,
  ZoomIn
} from 'lucide-react';
import { chopperAudio } from '../utils/soundSynthesizer';

interface ProductDetailViewProps {
  motor: ChopperMotor;
  onBack: () => void;
  onOpenChat: (builder: BuilderInfo, motorTitle: string) => void;
  onBuyViaRekber: (motor: ChopperMotor, options: { addInspection: boolean; addTowingInsurance: boolean }) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  motor,
  onBack,
  onOpenChat,
  onBuyViaRekber,
}) => {
  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Sound test player state
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [currentRpm, setCurrentRpm] = useState(0);
  const [soundPhase, setSoundPhase] = useState<'idle_stopped' | 'cranking' | 'running'>('idle_stopped');

  // Sticky Action Box add-on states
  const [addInspection, setAddInspection] = useState(true);
  const [addTowingInsurance, setAddTowingInsurance] = useState(true);

  const INSPECTION_FEE = 450000;
  const TOWING_INSURANCE_FEE = 750000;

  const totalCalculated = 
    motor.price + 
    (addInspection ? INSPECTION_FEE : 0) + 
    (addTowingInsurance ? TOWING_INSURANCE_FEE : 0);

  // Sound engine subscription
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
      setSoundPhase('idle_stopped');
    } else {
      setIsPlayingSound(true);
      setSoundPhase('cranking');
      chopperAudio.playColdStart(motor.soundTest.audioSimType, () => {
        setSoundPhase('running');
      });
    }
  };

  const handleRevThrottle = () => {
    if (!isPlayingSound) {
      handleToggleSound();
    } else {
      chopperAudio.revThrottle();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const activeMedia = motor.gallery[activeImageIndex] || {
    id: 'main',
    title: motor.title,
    description: 'Foto utama chopper',
    url: motor.mainImage,
  };

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <ChevronLeft className="w-4 h-4 text-[#EC0618]" />
            <span>Kembali ke Katalog Chopper</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">ID: {motor.id}</span>
          </div>
        </div>

        {/* Main Product Layout: Left Content, Right Sticky Action Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LEFT 8 COLUMNS: Gallery, Sound Test, Verified Documents, Build Sheet, Builder */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Title & Metadata (Clean & Professional) */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white leading-tight">
                {motor.title}
              </h1>
              <p className="text-sm text-zinc-400 mt-2 flex flex-wrap items-center gap-2">
                <span>Karya <strong className="text-zinc-200 font-semibold">{motor.builder.workshopName}</strong></span>
                <span className="text-zinc-600">•</span>
                <span>{motor.location}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300 font-mono text-xs">{motor.buildSheet.engineBase}</span>
              </p>
            </div>

            {/* 1. GALERI MEDIA INTERAKTIF */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
                  <ZoomIn className="w-4 h-4 text-[#EC0618]" />
                  <span>Galeri Foto</span>
                </h3>
                <span className="text-xs text-zinc-500 font-mono">
                  {activeImageIndex + 1} / {motor.gallery.length} Foto
                </span>
              </div>

              {/* Main Featured Photo Display */}
              <div className="relative rounded-3xl overflow-hidden bg-black border border-zinc-800 h-[380px] sm:h-[480px] group">
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-102"
                />
                
                {/* Image Details Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-6 pt-12">
                  <span className="text-xs font-mono font-bold text-[#EC0618] uppercase tracking-wider block mb-1">
                    {activeMedia.title}
                  </span>
                  <p className="text-sm text-zinc-200 leading-relaxed max-w-xl">
                    {activeMedia.description}
                  </p>
                </div>

                {/* Left/Right Arrows */}
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : motor.gallery.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#EC0618] text-white border border-zinc-700 transition-all cursor-pointer"
                  title="Foto sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev < motor.gallery.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-[#EC0618] text-white border border-zinc-700 transition-all cursor-pointer"
                  title="Foto berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail Selector Tabs */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {motor.gallery.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative rounded-xl overflow-hidden h-20 bg-zinc-900 border transition-all cursor-pointer ${
                      activeImageIndex === index
                        ? 'border-[#EC0618] ring-2 ring-[#EC0618]/40 scale-[1.03]'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <span className="absolute bottom-1 left-1 right-1 text-[9px] font-mono text-white truncate bg-black/70 px-1 py-0.5 rounded">
                      {img.title.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. PEMUTAR VIDEO & AUDIO "COLD START & SOUND TEST" */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121316] border border-zinc-800 relative overflow-hidden shadow-2xl">
              {/* Background ambient red glow when playing */}
              {isPlayingSound && (
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#EC0618]/15 rounded-full blur-[100px] pointer-events-none animate-pulse" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC0618]/15 text-[#EC0618] text-xs font-bold uppercase tracking-wider mb-2">
                    <Volume2 className="w-4 h-4" />
                    <span>Cold Start & Audio Telemetry</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Uji Putaran Mesin (Idle) & Knalpot
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Direkam saat mesin dinyalakan dari kondisi dingin ({motor.soundTest.coldStartRecordedAt}).
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 bg-[#18191c] px-3.5 py-2 rounded-xl border border-zinc-700/60">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPlayingSound ? 'bg-[#EC0618] animate-ping' : 'bg-zinc-600'}`} />
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {isPlayingSound ? (soundPhase === 'cranking' ? 'STARTER CRANK...' : 'MESIN AKTIF') : 'STANDBY'}
                  </span>
                </div>
              </div>

              {/* Interactive Player Console */}
              <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                
                {/* Live Tachometer / RPM Dial */}
                <div className="p-4 rounded-2xl bg-[#18191c] border border-zinc-800 flex flex-col items-center justify-center text-center">
                  <Gauge className="w-8 h-8 text-[#EC0618] mb-1" />
                  <span className="text-3xl font-mono font-black text-white">
                    {currentRpm}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                    RPM Mesin
                  </span>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 via-amber-500 to-[#EC0618] h-full transition-all duration-150"
                      style={{ width: `${Math.min(100, (currentRpm / 3500) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Decibel & Engine Character */}
                <div className="p-4 rounded-2xl bg-[#18191c] border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Desibel Idle:</span>
                    <strong className="text-white font-mono">{motor.soundTest.decibelIdle} dB</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Desibel Rev:</span>
                    <strong className="text-[#EC0618] font-mono">{motor.soundTest.decibelRev} dB</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Karakter:</span>
                    <span className="text-xs text-zinc-200 font-medium truncate max-w-[140px]" title={motor.soundTest.engineNote}>
                      {motor.soundTest.engineNote}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Langsam stabil & kompresi padat</span>
                  </div>
                </div>

                {/* Interactive Action Controls */}
                <div className="flex flex-col gap-3">
                  <button
                    id="btn-cold-start-player"
                    onClick={handleToggleSound}
                    className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer ${
                      isPlayingSound
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-600'
                        : 'bg-[#EC0618] hover:bg-[#ff1e2e] text-white shadow-[#EC0618]/30'
                    }`}
                  >
                    {isPlayingSound ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>Hentikan Audio</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Putar Audio Cold Start</span>
                      </>
                    )}
                  </button>

                  <button
                    id="btn-rev-throttle"
                    onClick={handleRevThrottle}
                    disabled={!isPlayingSound}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                      isPlayingSound
                        ? 'bg-[#212325] hover:bg-[#EC0618] text-white border-zinc-700 hover:border-[#EC0618]'
                        : 'bg-zinc-900/50 text-zinc-600 border-zinc-800 cursor-not-allowed'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Throttle Rev (3.000 RPM)</span>
                  </button>
                </div>

              </div>

              {/* Inspection Footnote */}
              <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-2">
                <span>Rekaman audio mikrofon studio resmi ChopperRide.</span>
                <span className="text-zinc-400 font-mono">Status: Lolos Uji Karburasi & Kompresi</span>
              </div>
            </div>

            {/* 3. PANEL VERIFIKASI SURAT & DOKUMEN FISIK */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121316] border border-zinc-800 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Verifikasi Dokumen & Fisik
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Pemeriksaan nomor rangka, nomor mesin, dan keabsahan surat kendaraan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Noka & Nosin Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#18191c] border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">Nomor Rangka (Noka):</span>
                    <span className="text-xs font-mono text-zinc-400">
                      Akur Fisik & STNK
                    </span>
                  </div>
                  <div className="font-mono text-base font-bold text-white tracking-wider">
                    {motor.verification.nokaMasked}
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Disamarkan 3 digit untuk privasi pemilik
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#18191c] border border-zinc-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-zinc-400">Nomor Mesin (Nosin):</span>
                    <span className="text-xs font-mono text-zinc-400">
                      Akur Fisik & BPKB
                    </span>
                  </div>
                  <div className="font-mono text-base font-bold text-white tracking-wider">
                    {motor.verification.nosinMasked}
                  </div>
                  <span className="text-[11px] text-zinc-500 mt-1 block">
                    Nomor mesin orisinal bawaan pabrik
                  </span>
                </div>
              </div>

              {/* Diagnostic Parameters (Clean & Integrated, No Cluttered Mini Cards) */}
              <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-0.5">Kompresi Silinder</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {motor.verification.compressionPsi} PSI
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-0.5">Status Pajak</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {motor.verification.taxStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-0.5">Presisi Sasis</span>
                  <span className="text-sm font-bold text-white font-mono">
                    Laser Aligned
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-zinc-500 uppercase block mb-0.5">Kelistrikan</span>
                  <span className="text-sm font-bold text-white font-mono">
                    12V Prima
                  </span>
                </div>
              </div>

              {/* Curator Notes */}
              <div className="p-4 rounded-xl bg-[#18191c] border border-zinc-800/80">
                <span className="text-xs font-bold text-zinc-300 block mb-1">
                  Catatan Kurator:
                </span>
                <p className="text-xs text-zinc-400 italic leading-relaxed">
                  "{motor.verification.curatorNotes}"
                </p>
                <div className="mt-2 text-[11px] text-zinc-500 font-mono">
                  Inspektor: {motor.verification.inspectorName} • {motor.verification.inspectedAt}
                </div>
              </div>
            </div>

            {/* 4. TABEL SPESIFIKASI TEKNIS (BUILD SHEET) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121316] border border-zinc-800 space-y-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#EC0618]/15 text-[#EC0618] border border-[#EC0618]/30">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Lembar Spesifikasi Teknis (Build Sheet)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Rincian komponen mekanis, pengapian, dan part kustom terpasang.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-zinc-800/80 text-xs">
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Basis Mesin & Tahun:</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.engineBase} ({motor.buildSheet.manufactureYear})
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Kapasitas & Silinder:</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.displacementCc}cc • {motor.buildSheet.cylinderCount}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Tipe Pengapian:</span>
                  <span className="font-semibold text-[#EC0618] font-mono">
                    {motor.buildSheet.ignitionType}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Sistem Kelistrikan:</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.electricalSystem}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Suspensi Depan:</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.frontSuspension}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Suspensi Belakang:</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.rearSuspension}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Roda & Ban Depan:</span>
                  <span className="font-semibold text-white font-mono text-right max-w-xs">
                    {motor.buildSheet.frontWheel}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Roda & Ban Belakang:</span>
                  <span className="font-semibold text-white font-mono text-right max-w-xs">
                    {motor.buildSheet.rearWheel}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Sistem Pengereman:</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.brakeSystem}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Tipe Transmisi:</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.transmission}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Knalpot (Exhaust):</span>
                  <span className="font-semibold text-white font-mono">
                    {motor.buildSheet.exhaustSystem}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-zinc-400">Finishing Cat:</span>
                  <span className="font-semibold text-zinc-300 font-mono text-right max-w-xs">
                    {motor.buildSheet.paintFinishing}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. PROFIL PENJUAL / BUILDER */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#121316] border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <img
                  src={motor.builder.avatar}
                  alt={motor.builder.workshopName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#EC0618]"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">
                    {motor.builder.workshopName}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Karya oleh: {motor.builder.name} • {motor.builder.city}</p>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-2">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{motor.builder.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{motor.builder.totalBuilds} motor kustom telah dibangun</span>
                  </div>
                </div>
              </div>

              <button
                id="btn-tanya-builder"
                onClick={() => onOpenChat(motor.builder, motor.title)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#212325] hover:bg-[#EC0618] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Tanya Builder via Obrolan</span>
              </button>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: KOTAK TRANSAKSI (STICKY ACTION BOX) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 p-6 sm:p-7 rounded-3xl bg-[#18191c] border border-zinc-800 shadow-2xl space-y-6">
              
              {/* Header Box */}
              <div>
                <span className="text-xs uppercase font-mono text-zinc-500 block mb-1">
                  Harga Unit
                </span>
                <div className="text-2xl sm:text-3xl font-poppins font-bold text-white tracking-tight">
                  {formatPrice(motor.price)}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Proteksi Rekber Escrow ChopperRide
                </p>
              </div>

              {/* OPSI TAMBAHAN */}
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <span className="text-xs font-mono uppercase text-zinc-400 font-bold block">
                  Layanan Tambahan
                </span>

                {/* Opsi 1: Tambah Layanan Inspeksi Mekanik Independen */}
                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  addInspection 
                    ? 'bg-[#212325] border-[#EC0618]/60 text-white' 
                    : 'bg-[#121316] border-zinc-800 text-zinc-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={addInspection}
                    onChange={(e) => setAddInspection(e.target.checked)}
                    className="mt-1 accent-[#EC0618] rounded"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Inspeksi Fisik Mandiri</span>
                      <span className="font-poppins font-semibold text-zinc-200">+Rp 450.000</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Pemeriksaan ulang fisik, kompresi, dan presisi sasis sebelum pengiriman.
                    </p>
                  </div>
                </label>

                {/* Opsi 2: Asuransi Pengiriman Towing Khusus */}
                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  addTowingInsurance 
                    ? 'bg-[#212325] border-[#EC0618]/60 text-white' 
                    : 'bg-[#121316] border-zinc-800 text-zinc-400'
                }`}>
                  <input
                    type="checkbox"
                    checked={addTowingInsurance}
                    onChange={(e) => setAddTowingInsurance(e.target.checked)}
                    className="mt-1 accent-[#EC0618] rounded"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>Asuransi Towing Flatbed</span>
                      <span className="font-poppins font-semibold text-zinc-200">+Rp 750.000</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Flatbed tertutup khusus motor kustom dengan proteksi insiden penuh.
                    </p>
                  </div>
                </label>
              </div>

              {/* Rincian Total Perhitungan */}
              <div className="pt-4 border-t border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Unit Motor:</span>
                  <span className="font-poppins font-semibold text-white">{formatPrice(motor.price)}</span>
                </div>
                {addInspection && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Inspeksi Mekanik:</span>
                    <span className="font-poppins font-semibold text-white">{formatPrice(INSPECTION_FEE)}</span>
                  </div>
                )}
                {addTowingInsurance && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Asuransi Towing Flatbed:</span>
                    <span className="font-poppins font-semibold text-white">{formatPrice(TOWING_INSURANCE_FEE)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-zinc-700/60 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-white">Total:</span>
                  <span className="font-poppins text-xl font-bold text-[#EC0618]">
                    {formatPrice(totalCalculated)}
                  </span>
                </div>
              </div>

              {/* TOMBOL UTAMA: BELI VIA REKBER CHOPPERRIDE */}
              <button
                id="btn-beli-rekber"
                onClick={() => onBuyViaRekber(motor, { addInspection, addTowingInsurance })}
                className="w-full py-4 px-6 rounded-2xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-sm shadow-xl shadow-[#EC0618]/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Beli via Rekber ChopperRide</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-mono font-black">
                  &gt;&gt;&gt;
                </span>
              </button>

              {/* Safety Badges Footer inside Sticky Box */}
              <div className="p-3.5 rounded-2xl bg-[#121316] border border-zinc-800/80 space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Uji jalan mandiri 2x24 jam sebelum dana diteruskan</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Jaminan uang kembali jika noka/nosin tidak akur</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Pengiriman tertutup flatbed towing aman</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
