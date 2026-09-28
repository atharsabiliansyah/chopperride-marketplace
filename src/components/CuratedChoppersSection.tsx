import React, { useState, useMemo } from 'react';
import { ChopperMotor } from '../types';
import { MotorCard } from './MotorCard';
import { ShieldCheck, Search } from 'lucide-react';

interface CuratedChoppersSectionProps {
  motors: ChopperMotor[];
  onSelectMotor: (motor: ChopperMotor) => void;
  onExploreMore?: () => void;
}

export const CuratedChoppersSection: React.FC<CuratedChoppersSectionProps> = ({
  motors,
  onSelectMotor,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMotors = useMemo(() => {
    return motors.filter((motor) => {
      // Filter tab
      if (activeTab === 'rigid' && motor.frameType !== 'rigid_frame') return false;
      if (activeTab === 'merzy' && !motor.title.toLowerCase().includes('merzy') && !motor.buildSheet.engineBase.toLowerCase().includes('merzy')) return false;
      if (activeTab === 'xs650' && !motor.title.toLowerCase().includes('xs650') && !motor.buildSheet.engineBase.toLowerCase().includes('xs650')) return false;
      if (activeTab === 'harley' && !motor.title.toLowerCase().includes('harley') && !motor.buildSheet.engineBase.toLowerCase().includes('harley') && !motor.buildSheet.engineBase.toLowerCase().includes('sportster')) return false;
      if (activeTab === 'honda' && !motor.title.toLowerCase().includes('tiger') && !motor.title.toLowerCase().includes('gl') && !motor.buildSheet.engineBase.toLowerCase().includes('honda')) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = motor.title.toLowerCase().includes(q);
        const matchEngine = motor.buildSheet.engineBase.toLowerCase().includes(q);
        const matchLocation = motor.location.toLowerCase().includes(q);
        if (!matchTitle && !matchEngine && !matchLocation) return false;
      }

      return true;
    });
  }, [motors, activeTab, searchQuery]);

  return (
    <section id="katalog-chopper" className="py-14 bg-[#010101] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
              Katalog Motor Chopper
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Pilih unit kustom impian Anda dengan jaminan surat akur dan transaksi rekber.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari basis mesin atau lokasi..."
              className="w-full bg-[#18191c] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0618] transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {[
            { id: 'all', label: 'Semua Chopper' },
            { id: 'merzy', label: 'Binter Merzy 200' },
            { id: 'xs650', label: 'Yamaha XS650' },
            { id: 'harley', label: 'Harley-Davidson' },
            { id: 'honda', label: 'Honda GL / Tiger' },
            { id: 'rigid', label: 'Rangka Rigid' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#EC0618] text-white shadow-lg shadow-[#EC0618]/30'
                  : 'bg-[#18191c] text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Motors Grid */}
        {filteredMotors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredMotors.map((motor) => (
              <MotorCard
                key={motor.id}
                motor={motor}
                onSelect={onSelectMotor}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#121316] rounded-2xl border border-zinc-800">
            <p className="text-zinc-400 text-sm">Tidak ada motor chopper yang sesuai dengan pencarian.</p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-[#EC0618] font-bold hover:underline cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
