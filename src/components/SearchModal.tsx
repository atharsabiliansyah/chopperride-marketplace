import React, { useState } from 'react';
import { Search, X, ShieldCheck, ArrowRight, Wrench } from 'lucide-react';
import { ChopperMotor } from '../types';

interface SearchModalProps {
  motors: ChopperMotor[];
  onSelectMotor: (motor: ChopperMotor) => void;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  motors,
  onSelectMotor,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMotors = motors.filter((m) => {
    const q = searchTerm.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      m.engineConfigLabel.toLowerCase().includes(q) ||
      m.builder.workshopName.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      m.frameTypeLabel.toLowerCase().includes(q)
    );
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-start justify-center p-4 pt-20">
      <div className="w-full max-w-2xl bg-[#18191c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 bg-[#121316] border-b border-zinc-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#EC0618]" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari basis mesin (XS650, Binter, Sportster), builder, rangka..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#18191c] border-b border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-zinc-500 text-[11px]">Tren:</span>
          {['Harley Shovelhead', 'Yamaha XS650', 'Binter Merzy', 'Rigid Hardtail', 'Queenlekha'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-2.5 py-0.5 rounded-full bg-zinc-800 hover:bg-[#212325] text-zinc-300 hover:text-white text-[11px] whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filteredMotors.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Tidak ditemukan unit chopper dengan kata kunci "{searchTerm}".
            </div>
          ) : (
            filteredMotors.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  onSelectMotor(m);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-[#121316] hover:bg-[#212325] border border-zinc-800/80 hover:border-zinc-700 flex items-center gap-3.5 cursor-pointer transition-all"
              >
                <img
                  src={m.mainImage}
                  alt={m.title}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Akur
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {m.builder.workshopName} • {m.location}
                  </p>
                  <span className="text-xs font-mono font-bold text-[#EC0618] block mt-0.5">
                    {formatPrice(m.price)}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
