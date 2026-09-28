import React from 'react';
import { EscrowTransaction } from '../../types';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Lock, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

interface ScreenEscrowProps {
  transaction: EscrowTransaction;
  onBack: () => void;
  onConfirmSuccess: () => void;
}

export const ScreenEscrow: React.FC<ScreenEscrowProps> = ({
  transaction,
  onBack,
  onConfirmSuccess,
}) => {
  const steps = [
    { num: 1, title: 'Dana Ditampung di Rekber', desc: 'Uang aman 100% di rekening escrow' },
    { num: 2, title: 'Inspeksi Fisik & Noka/Nosin', desc: 'Tim kurator verifikasi fisik di bengkel' },
    { num: 3, title: 'Pengiriman Flatbed Towing', desc: 'Motor dalam perjalanan aman ke pembeli' },
    { num: 4, title: 'Uji Coba 2x24 Jam di Rumah', desc: 'Masa garansi tes mesin & kelistrikan' },
    { num: 5, title: 'Pencairan Dana ke Penjual', desc: 'Transaksi selesai dengan aman' },
  ];

  return (
    <div className="relative flex-1 flex flex-col justify-between bg-[#010101] text-white pb-6 overflow-y-auto no-scrollbar">
      
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-3 sticky top-0 z-30 bg-[#010101]/90 backdrop-blur-md">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#212325] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm font-bold tracking-tight text-white uppercase font-display">
          Status Rekber
        </span>

        <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      <div className="px-5 space-y-4">
        
        {/* Active Transaction Card */}
        <div className="bg-[#212325] rounded-[24px] p-4 border border-zinc-800/80 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <span className="text-[10px] text-zinc-400 font-mono">Invoice</span>
              <p className="text-xs font-mono font-bold text-white">{transaction.id}</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
              Uji Coba 2x24 Jam
            </div>
          </div>

          <div className="pt-3 flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=200&auto=format&fit=crop&q=80"
              alt="Chopper"
              className="w-14 h-14 rounded-xl object-cover border border-zinc-700"
            />
            <div>
              <h4 className="text-xs font-bold text-white line-clamp-1">{transaction.motorTitle}</h4>
              <p className="text-[11px] font-mono text-[#EC0618] font-bold mt-0.5">
                Rp {transaction.totalAmount.toLocaleString('id-ID')}
              </p>
              <p className="text-[10px] text-zinc-400">Pembeli: {transaction.buyerName}</p>
            </div>
          </div>
        </div>

        {/* 5-Step Process */}
        <div className="bg-[#212325] rounded-[24px] p-4 border border-zinc-800/80 space-y-3.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Alur Keamanan Escrow
          </h4>

          <div className="space-y-3">
            {steps.map((st) => {
              const isCompleted = transaction.currentStep > st.num;
              const isCurrent = transaction.currentStep === st.num;
              return (
                <div key={st.num} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    isCompleted 
                      ? 'bg-emerald-500 text-black' 
                      : isCurrent 
                        ? 'bg-[#EC0618] text-white shadow-md shadow-[#EC0618]/40 animate-pulse' 
                        : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    {isCompleted ? '✓' : st.num}
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {st.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Confirm Button */}
      <div className="px-5 pt-3">
        <button
          onClick={onConfirmSuccess}
          className="w-full py-3.5 rounded-full bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#EC0618]/30 transition-all cursor-pointer"
        >
          Konfirmasi Motor Diterima & Sesuai
        </button>
      </div>

    </div>
  );
};
