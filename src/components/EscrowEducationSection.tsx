import React from 'react';
import { 
  SearchCheck, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  AlertOctagon, 
  Lock, 
  Clock, 
  Banknote
} from 'lucide-react';

interface EscrowEducationSectionProps {
  onLearnMoreClick?: () => void;
  onViewLiveEscrow?: () => void;
}

export const EscrowEducationSection: React.FC<EscrowEducationSectionProps> = ({
  onLearnMoreClick,
  onViewLiveEscrow,
}) => {
  const steps = [
    {
      number: '01',
      title: 'Pembeli Setor ke Rekber',
      subtitle: 'Escrow Vault Terisolasi',
      description: 'Dana Anda aman disimpan di rekening bersama ChopperRide. Penjual tidak dapat mengakses uang sebelum motor Anda terima dan periksa.',
      icon: Lock,
      highlight: 'Uang 100% Aman',
    },
    {
      number: '02',
      title: 'Inspeksi Fisik & Surat',
      subtitle: 'Kurator Independen ChopperRide',
      description: 'Tim kami mendatangi lokasi motor untuk mencocokkan Nomor Rangka (Noka) dan Nomor Mesin (Nosin) dengan BPKB & STNK serta cek kompresi mesin.',
      icon: SearchCheck,
      highlight: 'Bebas Motor Bodong',
    },
    {
      number: '03',
      title: 'Towing Kargo Khusus',
      subtitle: 'Armada Flatbed Berasuransi',
      description: 'Motor kustom diangkut menggunakan pengikat khusus suspensi springer/rigid agar tidak baret atau lecet selama perjalanan antar kota.',
      icon: Truck,
      highlight: 'Tracking GPS Real-time',
    },
    {
      number: '04',
      title: 'Garansi Uji 2x24 Jam',
      subtitle: 'Coba Nyalakan di Garasi Anda',
      description: 'Setelah motor tiba, Anda memiliki waktu 48 jam untuk mencoba cold start dan cek fungsi. Jika sesuai, klik konfirmasi dan dana dicairkan ke penjual.',
      icon: CheckCircle2,
      highlight: 'Bisa Tahan Pencairan',
    },
  ];

  return (
    <section className="py-20 bg-[#08090b] border-b border-zinc-800/80 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#EC0618]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="max-w-2xl min-w-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-white uppercase tracking-tight break-words">
              Cara Kerja Rekber ChopperRide
            </h2>
            <p className="text-zinc-400 font-poppins text-xs sm:text-sm mt-2 leading-relaxed">
              Transaksi Motor Kustom Bebas Was-Was &bull; Garansi Uang Aman 100%
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onViewLiveEscrow}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shadow-md"
            >
              <Clock className="w-4 h-4 text-[#EC0618] shrink-0" />
              <span>Lihat Simulasi Live Escrow</span>
            </button>
          </div>
        </div>

        {/* Edu Callout: Penjelasan Apa itu Rekber / Escrow */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-[#121316] border border-zinc-800/90 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#EC0618]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#EC0618]/15 border border-[#EC0618]/30 flex items-center justify-center text-[#EC0618] shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-white font-poppins">
                  Apa itu Rekber / Escrow?
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold uppercase tracking-wider">
                  Penengah Transaksi Aman
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-poppins">
                <strong className="text-white">Escrow</strong> (sering disebut <strong className="text-white">Rekening Bersama / Rekber</strong>) adalah layanan penengah independen resmi. Dalam transaksi di ChopperRide, <strong>uang Anda tidak langsung ditransfer ke penjual</strong>, melainkan disimpan dan dikunci di rekening penampung aman kami (<em>Escrow Vault</em>).
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed font-poppins pt-1 border-t border-zinc-800/60 mt-2">
                Dana baru akan diteruskan ke rekening penjual <strong>setelah motor sampai di tangan Anda dan Anda selesai melakukan uji coba fisik 2x24 jam</strong> (mengecek starter mesin, kompresi, serta keaslian surat BPKB/STNK). Jika ada ketidaksesuaian atau indikasi motor bodong, Anda bisa menahan dana dan uang dikembalikan 100%.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Steps Infographic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-[#121316] border border-zinc-800/90 p-6 flex flex-col justify-between hover:border-[#EC0618]/50 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
              >
                {/* Step Number Watermark */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#212325] border border-zinc-700/60 flex items-center justify-center text-[#EC0618] group-hover:scale-110 group-hover:bg-[#EC0618] group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-zinc-600 group-hover:text-zinc-400 transition-colors">
                    {step.number}
                  </span>
                </div>

                <div className="space-y-2 mb-6">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#EC0618] font-bold">
                    {step.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                    {step.description}
                  </p>
                </div>

                {/* Highlight Chip */}
                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-300">
                    {step.highlight}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-[#EC0618] transition-colors">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Connector Line for Desktop */}
                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-zinc-700 pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-[#18191c] border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500">
                      →
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Protection Banner against Fraud */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-[#18191c] to-[#121316] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Garansi Uang Kembali 100% Jika Terjadi Ketidaksesuaian
              </h4>
              <p className="text-xs text-zinc-400">
                Nomor mesin/rangka tidak cocok dengan BPKB? Kondisi kompresi tidak sesuai video cold start? Tombol komplain langsung menahan dana escrow seketika.
              </p>
            </div>
          </div>
          <button
            onClick={onViewLiveEscrow}
            className="shrink-0 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-all cursor-pointer"
          >
            Lihat Alur Komplain & Tahan Dana
          </button>
        </div>

      </div>
    </section>
  );
};
