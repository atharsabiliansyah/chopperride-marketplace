import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Truck, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Banknote, 
  ExternalLink,
  Phone,
  HelpCircle,
  X,
  Send,
  AlertOctagon
} from 'lucide-react';
import { EscrowTransaction, EscrowStep } from '../types';
import { INITIAL_ESCROW_TRANSACTION } from '../data/mockData';

interface EscrowTrackingViewProps {
  currentTransaction?: EscrowTransaction;
  onConfirmSuccess?: () => void;
}

export const EscrowTrackingView: React.FC<EscrowTrackingViewProps> = ({
  currentTransaction = INITIAL_ESCROW_TRANSACTION,
  onConfirmSuccess,
}) => {
  const [tx, setTx] = useState<EscrowTransaction>(currentTransaction);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('Nomor mesin (Nosin) ada selisih karakter dengan BPKB');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirmReceived = () => {
    setTx((prev) => ({
      ...prev,
      currentStep: 5,
    }));
    onConfirmSuccess?.();
  };

  const handleRaiseDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setTx((prev) => ({
      ...prev,
      isDisputed: true,
      disputeReason: `${disputeReason}: ${disputeNotes}`,
    }));
    setDisputeSubmitted(true);
    setTimeout(() => {
      setIsDisputeModalOpen(false);
    }, 2000);
  };

  const stepsList: { step: EscrowStep; title: string; subtitle: string; desc: string }[] = [
    {
      step: 1,
      title: 'Pembeli Menyetor Dana ke Rekber',
      subtitle: 'Dana Diterima & Diamankan',
      desc: 'Dana senilai total pembayaran telah didepositkan dan terkunci di rekening bersama ChopperRide.',
    },
    {
      step: 2,
      title: 'Penjual Menyiapkan Motor & Dokumen',
      subtitle: 'Inspeksi & Berkas STNK/BPKB',
      desc: 'Penjual mengemas dokumen asli, cek final kondisi mesin, dan mencetak surat jalan resmi ChopperRide.',
    },
    {
      step: 3,
      title: 'Penjemputan Towing Kargo Khusus',
      subtitle: 'Flatbed Rekanan Berasuransi',
      desc: `Armada ${tx.towingCourier} menjemput motor dengan resi ${tx.trackingNumber}.`,
    },
    {
      step: 4,
      title: 'Motor Tiba & Garansi Uji 2x24 Jam',
      subtitle: 'Masa Inspeksi Mandiri di Garasi',
      desc: 'Pembeli memiliki waktu 48 jam untuk mencoba menyalakan motor dari kondisi dingin dan cek fisik surat.',
    },
    {
      step: 5,
      title: 'Konfirmasi Sesuai & Dana Diteruskan',
      subtitle: 'Transaksi Sukses & Selesai',
      desc: 'Pembeli puas dengan kondisi motor. Rekber meneruskan dana hasil penjualan ke rekening bank penjual.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC0618]/15 border border-[#EC0618]/30 text-[#EC0618] text-xs font-bold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>ChopperRide Escrow Protection</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight break-words">
              Status Transaksi & Rekening Bersama
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Invoice: <strong className="text-zinc-200 font-mono">{tx.invoiceNumber}</strong>
            </p>
          </div>

          {/* Active Vault Badge */}
          <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">Status Dana Escrow</span>
              <span className="text-xs font-bold text-emerald-400 break-words block">
                {tx.isDisputed ? 'DANA DITAHAN (MEDIASI)' : (tx.currentStep === 5 ? 'DANA DITERUSKAN KE PENJUAL' : 'TERKUNCI DI ESCROW VAULT')}
              </span>
            </div>
          </div>
        </div>

        {/* Dispute Warning Banner if Disputed */}
        {tx.isDisputed && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
            <AlertOctagon className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white">
                Pencairan Dana Berhasil Ditahan (Sedang Dalam Investigasi)
              </h4>
              <p className="text-xs text-zinc-300 mt-1">
                Alasan: {tx.disputeReason}. Tim kurator independen dan mediasi ChopperRide sedang memeriksa bukti video cold start dan foto serah terima towing.
              </p>
            </div>
          </div>
        )}

        {/* Motor Brief Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#121316] border border-zinc-800 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <img
              src={tx.motorImage}
              alt={tx.motorTitle}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-zinc-700"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Unit Terkait</span>
              <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-sm">
                {tx.motorTitle}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Penjual: <strong className="text-zinc-300">{tx.sellerName}</strong> → Pembeli: <strong className="text-zinc-300">{tx.buyerName} ({tx.buyerCity})</strong>
              </p>
              <div className="text-xs font-poppins font-bold text-[#EC0618] mt-1">
                Total Nilai: {formatPrice(tx.totalAmount)}
              </div>
            </div>
          </div>

          <div className="text-right w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-800 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
            <span className="text-xs text-zinc-400">Jasa Towing:</span>
            <span className="text-xs font-bold text-white font-mono">{tx.towingCourier}</span>
            <span className="text-[11px] font-mono text-zinc-500">Resi: {tx.trackingNumber}</span>
          </div>
        </div>

        {/* STEPPER PROGRES TRANSAKSI (Sesuai Syarat Spesifikasi 5 Tahap) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#18191c] border border-zinc-800 mb-8 shadow-2xl space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#EC0618]" />
              <span>Pelacak Progres Transaksi Escrow</span>
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              Tahap {tx.currentStep} dari 5
            </span>
          </div>

          {/* Stepper Flow */}
          <div className="space-y-6">
            {stepsList.map((item, index) => {
              const isPassed = tx.currentStep > item.step;
              const isCurrent = tx.currentStep === item.step;
              const isFuture = tx.currentStep < item.step;

              return (
                <div key={item.step} className="relative flex items-start gap-4 sm:gap-6">
                  {/* Step Connector Vertical Line */}
                  {index < stepsList.length - 1 && (
                    <div 
                      className={`absolute left-5 sm:left-6 top-10 bottom-0 w-0.5 -ml-[1px] transition-colors ${
                        isPassed ? 'bg-emerald-500' : (isCurrent ? 'bg-[#EC0618]' : 'bg-zinc-800')
                      }`} 
                    />
                  )}

                  {/* Step Circle Badge */}
                  <div className={`relative z-10 w-10 sm:w-12 h-10 sm:h-12 rounded-2xl flex items-center justify-center font-mono font-black text-sm shrink-0 transition-all ${
                    isPassed 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                      : (isCurrent 
                          ? 'bg-[#EC0618] text-white ring-4 ring-[#EC0618]/20 shadow-lg shadow-[#EC0618]/40 animate-pulse' 
                          : 'bg-[#212325] text-zinc-500 border border-zinc-700/60')
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : `0${item.step}`}
                  </div>

                  {/* Step Info Content */}
                  <div className={`flex-1 p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCurrent 
                      ? 'bg-[#212325] border-[#EC0618]/50 text-white' 
                      : (isPassed ? 'bg-[#121316] border-zinc-800 text-zinc-300' : 'bg-[#121316]/50 border-zinc-800/60 text-zinc-600')
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4 className={`text-sm sm:text-base font-bold ${isCurrent ? 'text-white' : (isPassed ? 'text-zinc-200' : 'text-zinc-500')}`}>
                        {item.title}
                      </h4>
                      <span className={`text-[11px] font-mono font-bold uppercase ${isCurrent ? 'text-[#EC0618]' : 'text-zinc-500'}`}>
                        {item.subtitle}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>

                    {/* Additional Sub-Widget for Step 4 (Garansi Inspeksi 2x24 Jam Countdown) */}
                    {item.step === 4 && isCurrent && (
                      <div className="mt-4 p-4 rounded-xl bg-[#18191c] border border-zinc-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                            <span className="text-xs font-bold text-amber-300">
                              Masa Garansi Uji Mesin Berjalan:
                            </span>
                          </div>
                          <span className="font-mono text-base font-black text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                            {tx.inspectionHoursLeft} Jam : 42 Menit Tersisa
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Nyalakan mesin dari kondisi dingin, periksa kecocokan nomor rangka/mesin fisik dengan berkas BPKB/STNK yang Anda terima dari kurir towing.
                        </p>

                        {/* Action Buttons for Step 4 */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                          <button
                            onClick={handleConfirmReceived}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Konfirmasi Sesuai (Lepaskan Dana ke Penjual)</span>
                          </button>

                          <button
                            onClick={() => setIsDisputeModalOpen(true)}
                            className="py-2.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <AlertTriangle className="w-4 h-4" />
                            <span>Tahan Pencairan Dana / Komplain</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 5 Success Message */}
                    {item.step === 5 && tx.currentStep === 5 && (
                      <div className="mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Transaksi Berhasil Diselesaikan! Dana telah diteruskan ke rekening penjual. Terima kasih telah menjaga ekosistem kustom yang jujur.</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bantuan & Pusat Komplain Info Box */}
        <div className="p-6 rounded-3xl bg-[#121316] border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-zinc-800 text-zinc-300">
              <HelpCircle className="w-6 h-6 text-[#EC0618]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Butuh Bantuan Mediasi Langsung?</h4>
              <p className="text-xs text-zinc-400">
                Customer Support Rekber ChopperRide siap membantu verifikasi dokumen dan pengaduan towing 24 jam.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDisputeModalOpen(true)}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700 cursor-pointer"
          >
            Pusat Bantuan & Komplain
          </button>
        </div>

      </div>

      {/* DISPUTE MODAL (Pusat Bantuan & Komplain: Tahan Pencairan Dana Sesuai Permintaan) */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#18191c] border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-red-500 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Tahan Pencairan Dana Escrow</span>
              </div>
              <button
                onClick={() => setIsDisputeModalOpen(false)}
                className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {disputeSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Pencairan Dana Resmi Ditahan</h4>
                <p className="text-xs text-zinc-400">
                  Tim mediasi ChopperRide telah membekukan transaksi ini. Tim kami akan menghubungi penjual dalam 1x24 jam untuk klarifikasi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRaiseDispute} className="space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Jika nomor mesin tidak cocok dengan BPKB atau kondisi fisik motor berbeda signifikan dengan video cold start, Anda berhak menahan dana escrow.
                </p>

                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                    Pilih Alasan Komplain:
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  >
                    <option value="Nomor mesin (Nosin) ada selisih karakter dengan BPKB">
                      Nomor mesin (Nosin) ada selisih karakter dengan BPKB
                    </option>
                    <option value="Nomor rangka (Noka) terindikasi ketokan / tidak akur">
                      Nomor rangka (Noka) terindikasi ketokan / tidak akur
                    </option>
                    <option value="Mesin mati / tidak bisa hidup berbeda dengan video cold start">
                      Mesin mati / tidak bisa hidup berbeda dengan video cold start
                    </option>
                    <option value="Terdapat keretakan pada sasis atau kebocoran oli parah">
                      Terdapat keretakan pada sasis atau kebocoran oli parah
                    </option>
                    <option value="Kerusakan fisik akibat pengangkutan towing">
                      Kerusakan fisik akibat pengangkutan towing
                    </option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                    Jelaskan Detail Temuan Anda:
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={disputeNotes}
                    onChange={(e) => setDisputeNotes(e.target.value)}
                    placeholder="Contoh: Saat dicek nomor mesin fisik tertera KZ200-8499 sedangkan di BPKB tertulis KZ200-8492. Mohon bantuan klarifikasi ke penjual."
                    className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400">
                  <span className="font-bold text-zinc-200 block mb-0.5">Konsekuensi:</span>
                  Dana escrow sebesar <strong>{formatPrice(tx.totalAmount)}</strong> akan langsung dibekukan dan tidak dapat ditarik oleh penjual sampai ada kesepakatan tertulis atau retur unit.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white text-xs font-bold transition-all"
                  >
                    Konfirmasi Tahan Dana
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
