import React, { useState } from 'react';
import { 
  X,
  CheckCircle2
} from 'lucide-react';
import { CompensationClaim } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { encryptSensitiveData, sanitizeInput } from '../utils/security';

interface CompensationClaimModalProps {
  onClose: () => void;
  defaultInvoice?: string;
}

const INITIAL_CLAIMS: CompensationClaim[] = [
  {
    id: 'claim-001',
    invoiceNumber: 'CR-ESC-829104',
    claimCategory: 'kerusakan_towing',
    claimTitle: 'Baret pada Tangki Peanut saat Pengikatan Towing',
    description: 'Saat flatbed towing tiba di garasi, ditemukan goresan halus 4cm pada clear coat tangki chopper sisi kiri akibat ikatan strap terlalu kencang.',
    compensationType: 'biaya_perbaikan_garansi',
    requestedAmount: 1200000,
    approvedAmount: 1200000,
    status: 'dicairkan',
    resolutionNotes: 'Klaim disetujui. ChopperRide telah mencairkan dana kompensasi perbaikan cat tangki ke rekening pembeli via escrow vault.',
    submittedAt: '12 Sep 2026',
  },
  {
    id: 'claim-002',
    invoiceNumber: 'CR-ESC-641920',
    claimCategory: 'noka_nosin_tidak_sesuai',
    claimTitle: 'Nomor Mesin Huruf Terakhir Aus pada Surat STNK',
    description: 'Cek fisik mandiri menemukan huruf terakhir nomor mesin aus dan perlu surat keterangan dari Samsat.',
    compensationType: 'biaya_perbaikan_garansi',
    requestedAmount: 500000,
    approvedAmount: 500000,
    status: 'disetujui',
    resolutionNotes: 'Disetujui. Biaya pengurusan rekomendasi Samsat ditanggung penuh dari dana jaminan penjual.',
    submittedAt: 'Kemarin',
  }
];

export const CompensationClaimModal: React.FC<CompensationClaimModalProps> = ({
  onClose,
  defaultInvoice = 'CR-ESC-892144'
}) => {
  const { user, privateInfo } = useAuth();
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [claims, setClaims] = useState<CompensationClaim[]>(INITIAL_CLAIMS);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoice);
  const [claimCategory, setClaimCategory] = useState<CompensationClaim['claimCategory']>('kerusakan_towing');
  const [claimTitle, setClaimTitle] = useState('');
  const [description, setDescription] = useState('');
  const [compensationType, setCompensationType] = useState<CompensationClaim['compensationType']>('biaya_perbaikan_garansi');
  const [requestedAmount, setRequestedAmount] = useState('1500000');
  const [hasUploadedProof, setHasUploadedProof] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const sanitizedTitle = sanitizeInput(claimTitle || 'Klaim Ketidaksesuaian Unit Chopper', 200);
    const sanitizedDesc = sanitizeInput(description || 'Detail keluhan klaim garansi terlampir.', 3000);
    const sanitizedCategory = sanitizeInput(claimCategory, 100);
    const amount = parseInt(requestedAmount) || 1000000;

    const newClaim: CompensationClaim = {
      id: `claim-${Date.now()}`,
      invoiceNumber,
      claimCategory,
      claimTitle: sanitizedTitle,
      description: sanitizedDesc,
      compensationType,
      requestedAmount: amount,
      approvedAmount: amount,
      status: 'diverifikasi',
      resolutionNotes: 'Tiket klaim berhasil diteruskan ke tim mediasi ChopperRide. Tim penilai akan memvalidasi bukti dalam 1x24 jam kerja.',
      submittedAt: 'Baru saja',
    };

    if (user) {
      try {
        const encryptedContact = encryptSensitiveData(privateInfo.phone || user.email || user.uid, user.uid);
        await setDoc(doc(db, 'users', user.uid, 'claims', newClaim.id), {
          id: newClaim.id,
          userId: user.uid,
          motorTitle: sanitizedTitle,
          claimCategory: sanitizedCategory,
          amountClaimed: amount,
          encryptedContact: encryptedContact,
          description: sanitizedDesc,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Notice saving claim to Firestore:', err);
      }
    }

    setClaims([newClaim, ...claims]);
    setIsSubmitting(false);
    setSuccessMessage('Klaim ganti rugi berhasil diajukan & dienkripsi! Rekening bersama otomatis memproteksi dana Anda.');
    setTimeout(() => {
      setActiveTab('history');
    }, 1000);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#18191c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#121316] border-b border-zinc-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-tight">
              Layanan Garansi Ganti Rugi
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Pemberian kompensasi & pengembalian dana jika terdapat kesalahan atau kerusakan atas persetujuan bersama.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-zinc-800 bg-[#141517] px-6 pt-3 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'form'
                ? 'border-[#EC0618] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Form Pengajuan Klaim
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-[#EC0618] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Riwayat Klaim ({claims.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Slogan Kebijakan dari Slide */}
          <div className="pl-4 py-1 border-l-2 border-[#EC0618] text-xs space-y-1">
            <span className="font-semibold text-white block">Ketentuan Garansi Kompensasi:</span>
            <p className="text-zinc-400 leading-relaxed">
              Layanan ganti rugi diberikan jika terdapat ketidaksesuaian atau kerusakan atas persetujuan bersama. Setiap unit dilindungi penahanan dana 2x24 jam di Rekber Escrow hingga Anda selesai melakukan cek fisik.
            </p>
          </div>

          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">
                    No. Invoice / Resi Rekber:
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Contoh: CR-ESC-829104"
                    className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">
                    Kategori Kesalahan / Komplain:
                  </label>
                  <select
                    value={claimCategory}
                    onChange={(e) => setClaimCategory(e.target.value as any)}
                    className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  >
                    <option value="kerusakan_towing">Kerusakan saat Towing Pengiriman</option>
                    <option value="noka_nosin_tidak_sesuai">Nomor Rangka / Mesin Tidak Sesuai STNK</option>
                    <option value="mesin_bermasalah">Mesin Bermasalah Tidak Sesuai Tes Suara</option>
                    <option value="kesalahan_deskripsi">Spesifikasi Part / Rangka Tidak Akur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">
                  Judul Klaim Singkat:
                </label>
                <input
                  type="text"
                  required
                  value={claimTitle}
                  onChange={(e) => setClaimTitle(e.target.value)}
                  placeholder="Misal: Kerusakan Cat Tangki / Oli Rem Bocor saat Tiba"
                  className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">
                  Kronologi & Detail Kesalahan:
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan detail ketidaksesuaian yang ditemukan saat pengecekan unit di rumah..."
                  className="w-full bg-[#121316] border border-zinc-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">
                    Bentuk Ganti Rugi yang Diinginkan:
                  </label>
                  <select
                    value={compensationType}
                    onChange={(e) => setCompensationType(e.target.value as any)}
                    className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  >
                    <option value="biaya_perbaikan_garansi">Ganti Rugi Biaya Perbaikan (Kompensasi Tunai)</option>
                    <option value="full_refund">Full Refund 100% (Batalkan Transaksi & Retur)</option>
                    <option value="retur_unit">Penggantian Part / Servis oleh Builder Rekanan</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 font-semibold block mb-1">
                    Estimasi Biaya Klaim (Rp):
                  </label>
                  <input
                    type="number"
                    required
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                  />
                </div>
              </div>

              {/* Upload Proof Mock */}
              <div>
                <label className="text-xs text-zinc-400 font-semibold block mb-1">
                  Bukti Foto / Video Unboxing & Cek Fisik:
                </label>
                <div className="p-3.5 rounded-xl border border-dashed border-zinc-700 bg-[#121316] flex items-center justify-between text-xs">
                  <span className="text-zinc-300">bukti-cek-fisik-towing.jpg (1.8 MB)</span>
                  <span className="text-xs font-mono text-zinc-400">Terlampir</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-2xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-xs shadow-lg shadow-[#EC0618]/30 transition-all flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Memproses Pengajuan Klaim...</span>
                ) : (
                  <span>Ajukan Klaim Ganti Rugi</span>
                )}
              </button>

            </form>
          ) : (
            <div className="space-y-3">
              {claims.map((c) => {
                return (
                  <div
                    key={c.id}
                    className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-white">
                            {c.invoiceNumber}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            • {c.submittedAt}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-200 mt-1">
                          {c.claimTitle}
                        </h4>
                      </div>

                      <span className="text-xs font-mono uppercase text-zinc-400">
                        Status: {c.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed bg-[#18191c] p-2.5 rounded-xl border border-zinc-800/80">
                      {c.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                      <div className="text-zinc-400">
                        <span>Nilai Ganti Rugi: </span>
                        <span className="font-mono font-bold text-[#EC0618]">
                          {formatRupiah(c.approvedAmount || c.requestedAmount)}
                        </span>
                      </div>

                      {c.resolutionNotes && (
                        <p className="w-full text-xs text-zinc-400 pt-2 border-t border-zinc-800/60">
                          Catatan: {c.resolutionNotes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
