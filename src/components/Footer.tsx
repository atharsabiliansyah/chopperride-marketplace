import React from 'react';
import { ShieldCheck, Truck, Lock, Wrench, ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#08090b] border-t border-zinc-800/80 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Trust Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-zinc-800/60">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#121316] border border-zinc-800">
            <div className="p-3 rounded-xl bg-[#EC0618]/15 text-[#EC0618] border border-[#EC0618]/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Rekber Escrow Vault</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dana pembeli aman terisolasi di rekening escrow hingga motor tiba dan lolos inspeksi 2x24 jam.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#121316] border border-zinc-800">
            <div className="p-3 rounded-xl bg-[#EC0618]/15 text-[#EC0618] border border-[#EC0618]/30 shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Kurasi Mesin & Surat Akur</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pengecekan fisik nomor rangka (noka), nomor mesin (nosin), uji kompresi, dan video cold start.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#121316] border border-zinc-800">
            <div className="p-3 rounded-xl bg-[#EC0618]/15 text-[#EC0618] border border-[#EC0618]/30 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Towing Kargo Khusus Berasuransi</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pengiriman flatbed hidrolik khusus motor kustom roda dua ke seluruh pulau Jawa, Bali, dan Sumatera.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EC0618] to-[#99040f] flex items-center justify-center text-white font-display font-black text-xl">
                CR
              </div>
              <span className="text-lg font-display font-extrabold text-white">
                CHOPPER<span className="text-[#EC0618]">RIDE</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ekosistem jual-beli, kurasi independen, dan pemesanan kustom chopper terpercaya pertama di Indonesia. Melindungi antusiasme kustom kultur dari motor bodong dan penipuan.
            </p>
            <div className="pt-2 text-xs text-zinc-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#EC0618]" />
              <span>Kawasan Kreatif Kustom Kultur Indonesia</span>
            </div>
          </div>

          {/* Col 2: Navigasi Pasar */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-wider font-mono font-bold text-white">Katalog Motor</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Traditional Chopper Rigid
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Frisco Style & High Tank
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Bobber-Chopper Ban Gambot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Digger & Gooseneck Frame
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">
                  Unit Bersurat BPKB/STNK Akur
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan Kustom */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-wider font-mono font-bold text-white">Layanan & Keamanan</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('custom-order')} className="hover:text-white transition-colors">
                  Custom Build Order (Rakit Baru)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('escrow')} className="hover:text-white transition-colors">
                  Alur Rekening Bersama (Escrow)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('builders')} className="hover:text-white transition-colors">
                  Direktori Bengkel Kustom
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Dasbor Penjual
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Kontak & Komunitas */}
          <div className="space-y-3">
            <h5 className="text-xs uppercase tracking-wider font-mono font-bold text-white">Bantuan & Tim Kurasi</h5>
            <div className="p-4 rounded-xl bg-[#121316] border border-zinc-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Phone className="w-3.5 h-3.5 text-[#EC0618]" />
                <span className="font-mono">+62 811-CHOPPER (24 Jam)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-300">
                <Mail className="w-3.5 h-3.5 text-[#EC0618]" />
                <span className="font-mono">kurasi@chopperride.id</span>
              </div>
              <p className="text-[11px] text-zinc-500 pt-1">
                Layanan mediasi escrow & towing beroperasi Senin–Minggu.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 ChopperRide Indonesia. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">Syarat & Ketentuan Rekber</span>
            <span className="hover:text-zinc-400 cursor-pointer">Standar Inspeksi Kurator</span>
            <span className="hover:text-zinc-400 cursor-pointer">Kebijakan Privasi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
