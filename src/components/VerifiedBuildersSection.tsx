import React from 'react';
import { BuilderInfo } from '../types';
import { 
  Wrench, 
  Star, 
  MapPin, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  Hammer,
  ExternalLink 
} from 'lucide-react';

interface VerifiedBuildersSectionProps {
  builders: BuilderInfo[];
  onOrderCustomBuild: (builderId?: string) => void;
  onContactBuilder: (builder: BuilderInfo) => void;
}

export const VerifiedBuildersSection: React.FC<VerifiedBuildersSectionProps> = ({
  builders,
  onOrderCustomBuild,
  onContactBuilder,
}) => {
  return (
    <section className="py-20 bg-[#08090b] border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EC0618]/15 border border-[#EC0618]/30 text-[#EC0618] text-xs font-bold uppercase tracking-wider mb-3">
              <Wrench className="w-4 h-4" />
              <span>Certified Custom Workshops</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
              Sorotan Bengkel (Verified Builder Spotlight)
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Bengkel kustom rekanan resmi ChopperRide dengan rekam jejak teruji, standar jig sasis presisi, dan jaminan pengerjaan bergaransi.
            </p>
          </div>

          <button
            onClick={() => onOrderCustomBuild()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EC0618] hover:bg-[#ff1e2e] text-white text-xs font-bold transition-all shadow-lg shadow-[#EC0618]/25 cursor-pointer"
          >
            <Hammer className="w-4 h-4" />
            <span>Pesan Rakit Baru (Custom Order)</span>
          </button>
        </div>

        {/* Builders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builders.map((builder) => (
            <div
              key={builder.id}
              className="relative rounded-2xl bg-[#121316] border border-zinc-800/90 p-6 flex flex-col justify-between hover:border-[#EC0618]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-black/70 group"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={builder.avatar}
                      alt={builder.workshopName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-zinc-700 group-hover:border-[#EC0618] transition-colors"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white shadow-md">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-lg font-bold text-white group-hover:text-zinc-100">
                        {builder.workshopName}
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">{builder.name}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#EC0618]" />
                      <span>{builder.city}</span>
                    </div>
                  </div>
                </div>

                {/* Badge Tag */}
                <div className="mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#212325] text-zinc-300 border border-zinc-700/60 text-[11px] font-bold">
                    <Award className="w-3.5 h-3.5 text-[#EC0618]" />
                    <span>{builder.badge}</span>
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#18191c] border border-zinc-800/80 mb-5">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">Reputasi</span>
                    <div className="flex items-center gap-1 text-sm font-bold text-white">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{builder.rating.toFixed(1)}</span>
                      <span className="text-xs text-zinc-500 font-normal">/ 5.0</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase font-mono block">Kustom Selesai</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {builder.totalBuilds}+ Unit
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                <button
                  onClick={() => onContactBuilder(builder)}
                  className="py-2.5 px-3 rounded-xl bg-[#212325] hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-zinc-700/50"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#EC0618]" />
                  <span>Tanya Builder</span>
                </button>

                <button
                  onClick={() => onOrderCustomBuild(builder.id)}
                  className="py-2.5 px-3 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#EC0618]/20"
                >
                  <Hammer className="w-3.5 h-3.5" />
                  <span>Pesan Rakit</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
