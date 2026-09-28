import React from 'react';
import { 
  MapPin, 
} from 'lucide-react';
import { ChopperMotor } from '../types';

interface MotorCardProps {
  motor: ChopperMotor;
  onSelect: (motor: ChopperMotor) => void;
  onTestSound?: (motor: ChopperMotor) => void;
}

export const MotorCard: React.FC<MotorCardProps> = ({
  motor,
  onSelect,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div
      id={`motor-card-${motor.id}`}
      onClick={() => onSelect(motor)}
      className="group relative rounded-2xl sm:rounded-3xl bg-[#18191c] border border-zinc-800/90 overflow-hidden hover:border-[#EC0618]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/70 cursor-pointer"
    >
      {/* Top Image Section */}
      <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-zinc-950">
        <img
          src={motor.mainImage}
          alt={motor.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out brightness-90"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#18191c] via-transparent to-black/30" />

        {/* Builder Watermark at bottom of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <img
            src={motor.builder.avatar}
            alt={motor.builder.workshopName}
            className="w-5 h-5 rounded-full border border-zinc-700 object-cover"
          />
          <span className="text-[11px] font-medium text-zinc-300 drop-shadow-md">
            {motor.builder.workshopName}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Subtitle instead of cluttered mini cards */}
          <p className="text-xs font-mono text-zinc-400 font-medium mb-1.5">
            {motor.frameTypeLabel} • {motor.buildSheet.engineBase}
          </p>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-zinc-100 transition-colors leading-snug line-clamp-2 mb-2">
            {motor.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
            <span className="truncate">{motor.location}</span>
          </div>
        </div>

        {/* Bottom Price & "Cek Detail >>>" action (styled like the reference image) */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-mono text-zinc-400 block">Harga Unit</span>
            <span className="text-lg sm:text-xl font-poppins font-bold text-white tracking-tight">
              {formatPrice(motor.price)}
            </span>
          </div>

          {/* Red pill button with >>> from reference image */}
          <button
            id={`btn-detail-${motor.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(motor);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#212325] group-hover:bg-[#EC0618] text-zinc-200 group-hover:text-white text-xs font-bold transition-all shadow-md group-hover:shadow-[#EC0618]/40"
          >
            <span>Cek Detail</span>
            <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-[10px] font-mono font-black">
              &gt;&gt;&gt;
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
