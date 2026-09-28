import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Truck, 
  CheckCircle2, 
  CreditCard, 
  Building, 
  QrCode,
  ArrowRight
} from 'lucide-react';
import { ChopperMotor, EscrowTransaction } from '../types';

interface CheckoutModalProps {
  motor: ChopperMotor;
  options: { addInspection: boolean; addTowingInsurance: boolean };
  onClose: () => void;
  onSuccess: (tx: EscrowTransaction) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  motor,
  options,
  onClose,
  onSuccess,
}) => {
  const [buyerName, setBuyerName] = useState('Bambang Wicaksono');
  const [buyerPhone, setBuyerPhone] = useState('0812-9876-5432');
  const [buyerCity, setBuyerCity] = useState('Jakarta Selatan');
  const [shippingAddress, setShippingAddress] = useState('Jl. Senopati No. 45, Kebayoran Baru');
  const [paymentMethod, setPaymentMethod] = useState<'bca_va' | 'mandiri_va' | 'qris' | 'cod'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const INSPECTION_FEE = 450000;
  const TOWING_INSURANCE_FEE = 750000;
  const COD_DP_AMOUNT = 1500000;

  const totalAmount = 
    motor.price + 
    (options.addInspection ? INSPECTION_FEE : 0) + 
    (options.addTowingInsurance ? TOWING_INSURANCE_FEE : 0);

  const codRemaining = Math.max(0, totalAmount - COD_DP_AMOUNT);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newTransaction: EscrowTransaction = {
        id: `tx-${Date.now()}`,
        invoiceNumber: `CR-ESC-${Math.floor(100000 + Math.random() * 900000)}`,
        motorId: motor.id,
        motorTitle: motor.title,
        motorImage: motor.mainImage,
        motorPrice: motor.price,
        includeInspection: options.addInspection,
        inspectionFee: options.addInspection ? INSPECTION_FEE : 0,
        includeTowingInsurance: options.addTowingInsurance,
        towingFee: options.addTowingInsurance ? TOWING_INSURANCE_FEE : 0,
        escrowAdminFee: 0,
        totalAmount,
        buyerName,
        buyerCity,
        sellerName: motor.builder.workshopName,
        paymentMethod,
        codDownPayment: paymentMethod === 'cod' ? COD_DP_AMOUNT : undefined,
        codRemainingAmount: paymentMethod === 'cod' ? codRemaining : undefined,
        currentStep: 1, // Dana berhasil masuk Escrow Vault!
        isDisputed: false,
        inspectionHoursLeft: 48,
        trackingNumber: `TOW-${Date.now().toString().slice(-6)}`,
        towingCourier: 'Indah Logistik Flatbed Towing (Covered)',
        createdAt: new Date().toLocaleDateString('id-ID'),
      };
      onSuccess(newTransaction);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#18191c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 bg-[#121316] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EC0618]/15 text-[#EC0618]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Checkout Rekber Escrow ChopperRide
              </h3>
              <p className="text-xs text-zinc-400">
                Perlindungan garansi 100% aman hingga unit teruji di garasi Anda.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handlePay} className="p-6 overflow-y-auto space-y-6">
          
          {/* Motor Mini Summary */}
          <div className="p-3.5 rounded-2xl bg-[#121316] border border-zinc-800 flex items-center gap-3.5">
            <img
              src={motor.mainImage}
              alt={motor.title}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Unit Terpilih</span>
              <h4 className="text-xs font-bold text-white truncate">{motor.title}</h4>
              <span className="text-xs font-mono font-bold text-[#EC0618] block mt-0.5">
                {formatPrice(motor.price)}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-zinc-300 tracking-wider">
              Data Penerima & Alamat Kirim (Towing Khusus)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                  Nama Penerima:
                </label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                  Nomor Telepon:
                </label>
                <input
                  type="tel"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                Kota Pengiriman:
              </label>
              <input
                type="text"
                required
                value={buyerCity}
                onChange={(e) => setBuyerCity(e.target.value)}
                className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
              />
            </div>

            <div>
              <label className="text-[11px] text-zinc-400 font-semibold block mb-1">
                Alamat Lengkap Garasi Rumah:
              </label>
              <input
                type="text"
                required
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-3 border-t border-zinc-800">
            <h4 className="text-xs font-mono uppercase font-bold text-zinc-300 tracking-wider">
              Metode Pembayaran ke Rekening Bersama (Escrow)
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cod', label: 'COD (Bayar di Tempat)', icon: Truck, badge: 'Rekomendasi' },
                { id: 'bca_va', label: 'BCA Virtual Account', icon: Building },
                { id: 'mandiri_va', label: 'Mandiri VA', icon: CreditCard },
                { id: 'qris', label: 'QRIS Realtime', icon: QrCode },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`relative p-3 rounded-2xl border text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#212325] border-[#EC0618] text-white ring-1 ring-[#EC0618]/50'
                        : 'bg-[#121316] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {m.badge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#EC0618] text-[9px] font-bold text-white uppercase tracking-wider">
                        {m.badge}
                      </span>
                    )}
                    <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-[#EC0618]' : 'text-zinc-500'}`} />
                    <span className="text-[10px] font-bold block">{m.label}</span>
                  </div>
                );
              })}
            </div>

            {paymentMethod === 'cod' && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-800/40 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Layanan COD: Pesan Langsung dari Rumah</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Cukup bayar DP Uang Jalan Towing sebesar <strong>{formatPrice(COD_DP_AMOUNT)}</strong> ke Rekber ChopperRide. Sisa pelunasan <strong>{formatPrice(codRemaining)}</strong> dibayar di tempat setelah armada towing tiba dan Anda selesai cek fisik motor.
                </p>
                <div className="text-[10px] text-zinc-400 pt-1 border-t border-emerald-900/40 flex items-center justify-between">
                  <span>Garansi Ganti Rugi: DP kembali 100% jika unit tidak sesuai deskripsi.</span>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Unit Chopper:</span>
              <span className="font-mono text-white">{formatPrice(motor.price)}</span>
            </div>
            {options.addInspection && (
              <div className="flex justify-between text-zinc-400">
                <span>Inspeksi Mekanik Independen:</span>
                <span className="font-mono text-white">{formatPrice(INSPECTION_FEE)}</span>
              </div>
            )}
            {options.addTowingInsurance && (
              <div className="flex justify-between text-zinc-400">
                <span>Asuransi Towing Flatbed:</span>
                <span className="font-mono text-white">{formatPrice(TOWING_INSURANCE_FEE)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-400">
              <span>Biaya Penanganan Rekber:</span>
              <span className="text-emerald-400 font-bold">GRATIS (Promo Beta)</span>
            </div>

            {paymentMethod === 'cod' ? (
              <div className="pt-2 border-t border-zinc-700 space-y-1.5">
                <div className="flex justify-between font-bold text-xs text-amber-400">
                  <span>DP Dibayar Sekarang (Rekber):</span>
                  <span className="font-mono text-sm">{formatPrice(COD_DP_AMOUNT)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs text-zinc-300">
                  <span>Sisa Pelunasan Saat Towing Tiba (COD):</span>
                  <span className="font-mono text-sm">{formatPrice(codRemaining)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t border-zinc-800">
                  <span className="text-white">Total Keseluruhan:</span>
                  <span className="font-mono text-base font-black text-[#EC0618]">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-zinc-700 flex justify-between font-bold text-sm">
                <span className="text-white">Total Tagihan:</span>
                <span className="font-mono text-base font-black text-[#EC0618]">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-sm shadow-xl shadow-[#EC0618]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Mengunci Dana ke Escrow Vault...</span>
            ) : paymentMethod === 'cod' ? (
              <>
                <Truck className="w-4 h-4" />
                <span>Pesan COD & Kunci DP Towing ({formatPrice(COD_DP_AMOUNT)})</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Bayar & Kunci Dana ke Rekber ChopperRide</span>
              </>
            )}
          </button>

          <p className="text-[10px] text-zinc-500 text-center">
            *Dana 100% aman dan baru akan dilepaskan ke penjual setelah masa uji 2x24 jam disetujui oleh Anda.
          </p>

        </form>

      </div>
    </div>
  );
};
