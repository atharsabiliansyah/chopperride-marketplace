import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Check } from 'lucide-react';

interface SlideToBookButtonProps {
  price: number;
  onConfirm: () => void;
  className?: string;
}

export const SlideToBookButton: React.FC<SlideToBookButtonProps> = ({
  price,
  onConfirm,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(240);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const x = useMotionValue(0);

  // Measure container width to determine drag constraint
  useEffect(() => {
    const updateMaxDrag = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const knobWidth = 56; // 48-56px knob
        const padding = 16; // 8px left and right
        setMaxDrag(Math.max(100, containerWidth - knobWidth - padding));
      }
    };

    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, []);

  // Text opacity fades out as knob moves to the right
  const textOpacity = useTransform(x, [0, maxDrag * 0.7], [1, 0.15]);
  // Track fill width
  const trackWidth = useTransform(x, (val) => `${Math.max(0, val + 28)}px`);

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (isConfirmed) return;

    // Trigger if dragged more than 60% of the distance or flicked with high velocity
    const threshold = maxDrag * 0.6;
    if (x.get() >= threshold || (info.offset.x >= threshold && info.velocity.x > 0)) {
      triggerSuccess();
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  const triggerSuccess = () => {
    setIsConfirmed(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(50);
      } catch {}
    }
    // Animate knob to end
    animate(x, maxDrag, {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      onComplete: () => {
        setTimeout(() => {
          onConfirm();
          // Reset after short delay so if modal closes it resets
          setTimeout(() => {
            setIsConfirmed(false);
            animate(x, 0, { duration: 0.2 });
          }, 600);
        }, 150);
      },
    });
  };

  // Allow click on text / container as alternative
  const handleClickTrack = (e: React.MouseEvent) => {
    // If clicked near the right half of the track, trigger smooth slide to confirm
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && !isConfirmed) {
      const clickX = e.clientX - rect.left;
      if (clickX > rect.width * 0.4) {
        triggerSuccess();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClickTrack}
      className={`relative w-full h-16 sm:h-18 rounded-full bg-[#212325] hover:bg-[#26282c] border border-zinc-700/80 overflow-hidden select-none p-1.5 flex items-center shadow-2xl touch-none cursor-pointer ${className}`}
      role="slider"
      aria-label="Geser ke kanan untuk konfirmasi pemesanan"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={isConfirmed ? 100 : 0}
    >
      {/* Background Track Fill while sliding */}
      <motion.div
        style={{ width: trackWidth }}
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#EC0618]/15 via-[#EC0618]/30 to-[#EC0618]/45 pointer-events-none rounded-full"
      />

      {/* Center Label & Price */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="absolute inset-0 flex items-center justify-between px-16 sm:px-20 pointer-events-none"
      >
        <div className="flex-1 text-center">
          <span className="text-xs sm:text-sm font-bold text-white tracking-wider uppercase font-display block">
            {isConfirmed ? 'Mengonfirmasi...' : 'Geser Untuk Book Now'}
          </span>
          <span className="text-[11px] sm:text-xs font-mono text-zinc-400 font-semibold block mt-0.5">
            Rp {price.toLocaleString('id-ID')}
          </span>
        </div>

        <div className="flex items-center text-[#EC0618] font-mono text-sm sm:text-base font-black tracking-tighter shrink-0 animate-pulse">
          &gt;&gt;&gt;
        </div>
      </motion.div>

      {/* Draggable Knob */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.05}
        dragMomentum={false}
        dragSnapToOrigin={!isConfirmed}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ scale: 1.05 }}
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#EC0618] flex items-center justify-center text-white shadow-lg shadow-[#EC0618]/50 cursor-grab active:cursor-grabbing z-10 shrink-0 select-none touch-none"
      >
        <Check className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[3] transition-transform ${isConfirmed ? 'scale-125' : ''}`} />
      </motion.div>
    </div>
  );
};
