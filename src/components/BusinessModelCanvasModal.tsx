import React, { useState } from 'react';
import { 
  Briefcase, 
  X, 
  Users, 
  Sparkles, 
  Share2, 
  HeartHandshake, 
  Wallet, 
  Layers, 
  Activity, 
  Handshake, 
  CreditCard,
  Building2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Home,
  Truck,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface BusinessModelCanvasModalProps {
  onClose: () => void;
  onOpenCODInfo?: () => void;
  onOpenClaimInfo?: () => void;
  onOpenConsultation?: () => void;
}

export const BusinessModelCanvasModal: React.FC<BusinessModelCanvasModalProps> = ({
  onClose,
  onOpenCODInfo,
  onOpenClaimInfo,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'bmc' | 'deskripsi'>('bmc');
  const [activeElementId, setActiveElementId] = useState<string>('value_prop');

  const bmcElements = [
    {
      id: 'customer_segments',
      title: '1. Customer Segments',
      subtitle: 'Segmentasi Pelanggan',
      icon: Users,
      color: 'from-blue-600 to-indigo-600',
      points: [
        'Penghobi & kolektor motor kustom chopper di seluruh Indonesia.',
        'Pengendara pemula yang ingin chopper bergaransi resmi tanpa rasa was-was surat palsu.',
        'Pecinta gaya hidup kustom kultur (Kustomfest, BBQ Ride, event roda dua).',
        'Bengkel builder lokal yang membutuhkan platform pemasaran jangkauan nasional.'
      ]
    },
    {
      id: 'value_prop',
      title: '2. Value Proposition',
      subtitle: 'Proposisi Nilai & Keunggulan',
      icon: Sparkles,
      color: 'from-[#EC0618] to-amber-600',
      points: [
        '100% Surat Akur: Cek fisik nomor rangka & mesin terverifikasi resmi Samsat.',
        'Rekening Bersama (Escrow): Dana dikunci aman 2x24 jam hingga unit diuji.',
        'Metode Pembayaran COD: Pesan dari rumah, pelunasan saat flatbed towing tiba.',
        'Layanan Garansi Ganti Rugi: Kompensasi jika ada cacat/kesalahan yang tidak sesuai.',
        'Sound Test Engine Synthesizer: Uji suara dingin (cold start) sebelum membeli.'
      ]
    },
    {
      id: 'channels',
      title: '3. Channels',
      subtitle: 'Saluran Distribusi & Penjualan',
      icon: Share2,
      color: 'from-emerald-600 to-teal-600',
      points: [
        'Aplikasi Web Responsif ChopperRide (Desktop & Mobile Luxury UX).',
        'Armada Flatbed Towing Ekspedisi Door-to-Door langsung ke garasi rumah pembeli.',
        'Komunitas Otomotif Kustom & Kolaborasi Event Kreatif Nasional.',
        'Media Sosial & Channel Showcase Builder Terkurasi.'
      ]
    },
    {
      id: 'customer_rel',
      title: '4. Customer Relationship',
      subtitle: 'Hubungan & Retensi Pelanggan',
      icon: HeartHandshake,
      color: 'from-rose-600 to-pink-600',
      points: [
        'Pelayanan Ramah & Berkelanjutan bagi sesama penghobi motor kustom.',
        'Respon Cepat (Fast Response SLA < 1 Menit melalui CS siaga).',
        'Pusat Solusi: Konsultasi gratis pemilihan basis mesin & postur tubuh pengendara.',
        'Mediasi Transparan & Pusat Layanan Klaim Ganti Rugi.'
      ]
    },
    {
      id: 'revenue',
      title: '5. Revenue Streams',
      subtitle: 'Arus Pendapatan Usaha',
      icon: Wallet,
      color: 'from-amber-600 to-orange-600',
      points: [
        'Biaya Administrasi Rekber Escrow (1.5% - 2.5% dari nominal transaksi unit).',
        'Biaya Layanan Inspeksi Fisik Mekanik Independen (Rp 450.000 per unit).',
        'Komisi Premi Asuransi Pengiriman Flatbed Towing (Rp 750.000 per perjalanan).',
        'Listing Premium & Badge Verifikasi untuk Workshop Builder Terdaftar.'
      ]
    },
    {
      id: 'key_resources',
      title: '6. Key Resources',
      subtitle: 'Sumber Daya Kunci',
      icon: Layers,
      color: 'from-cyan-600 to-blue-600',
      points: [
        'Database Kurasi Chopper & Jaringan Builder Terpercaya se-Indonesia.',
        'Infrastruktur Web Marketplace & Sistem Otomasi Vault Rekening Bersama.',
        'Tim Mekanik Inspektur Ahli Rangka Rigid/Softail & Mesin Kustom.',
        'Brand Equity "ChopperRide" sebagai pionir marketplace motor kustom aman.'
      ]
    },
    {
      id: 'key_activities',
      title: '7. Key Activities',
      subtitle: 'Aktivitas Kunci Bisnis',
      icon: Activity,
      color: 'from-purple-600 to-violet-600',
      points: [
        'Kurasi kualitas unit kustom & audit nomor rangka serta nomor mesin (Noka/Nosin).',
        'Pengelolaan transaksi Rekber Escrow & pencairan dana aman 2x24 jam.',
        'Koordinasi logistik flatbed towing dan pelaksanaan sistem pembayaran COD.',
        'Customer Care ramah, fast-response, dan penanganan klaim ganti rugi.'
      ]
    },
    {
      id: 'key_partnerships',
      title: '8. Key Partnerships',
      subtitle: 'Kemitraan Strategis',
      icon: Handshake,
      color: 'from-yellow-600 to-amber-700',
      points: [
        'Jaringan Bengkel Builder Kustom (Yogyakarta, Bandung, Bali, Solo, Jakarta, Surabaya).',
        'Penyedia Jasa Ekspedisi Towing Khusus Moge/Chopper (Indah Logistik, Flatbed Towing).',
        'Mitra Cek Fisik Samsat & Kepolisian untuk Verifikasi Legalitas Surat.',
        'Bank Nasional & Payment Gateway untuk Keamanan Rekber Escrow.'
      ]
    },
    {
      id: 'cost_structure',
      title: '9. Cost Structure',
      subtitle: 'Struktur Biaya Operasional',
      icon: CreditCard,
      color: 'from-red-600 to-rose-700',
      points: [
        'Biaya Pemeliharaan Server Cloud & Keamanan Data Platform Web.',
        'Honorarium & Biaya Operasional Tim Inspeksi Mekanik di Lapangan.',
        'Premi Asuransi Towing & Alokasi Dana Cadangan Garansi Ganti Rugi.',
        'Operasional Layanan Pelanggan, Mediasi Sengketa, & Pemasaran Komunitas.'
      ]
    }
  ];

  const selectedElement = bmcElements.find((e) => e.id === activeElementId) || bmcElements[1];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-4xl bg-[#18191c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#121316] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EC0618] flex items-center justify-center text-white shadow-lg shadow-[#EC0618]/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Rancangan Bisnis & 9 Elements BMC
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Dokumentasi Business Model Canvas & Deskripsi Usaha Terintegrasi pada Platform.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-zinc-800 bg-[#141517] px-6 pt-3 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('bmc')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'bmc'
                ? 'border-[#EC0618] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4 text-[#EC0618]" />
            <span>9 Elements Business Model Canvas</span>
          </button>

          <button
            onClick={() => setActiveTab('deskripsi')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'deskripsi'
                ? 'border-[#EC0618] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Deskripsi Usaha, Manfaat & 5 Pilar Layanan</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {activeTab === 'bmc' ? (
            <div className="space-y-6">
              
              {/* Grid 9 Elements */}
              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider block font-bold mb-3">
                  Pilih Blok BMC untuk Melihat Detail Analisis:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {bmcElements.map((elem) => {
                    const Icon = elem.icon;
                    const isSelected = activeElementId === elem.id;
                    return (
                      <button
                        key={elem.id}
                        onClick={() => setActiveElementId(elem.id)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#212325] border-[#EC0618] ring-1 ring-[#EC0618]/50 text-white shadow-lg'
                            : 'bg-[#121316] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className={`p-1.5 rounded-lg bg-zinc-800/80 ${isSelected ? 'text-[#EC0618]' : 'text-zinc-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold truncate block">{elem.title}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 block truncate">{elem.subtitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Active Element Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#212325] to-[#161719] border border-zinc-700/80 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-700/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#EC0618]/20 border border-[#EC0618]/40 text-[#EC0618]">
                      <selectedElement.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                        {selectedElement.title}
                      </h4>
                      <span className="text-xs text-zinc-400">{selectedElement.subtitle}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {selectedElement.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Action Buttons to Test the Features in App */}
              <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-zinc-400">
                  Uji langsung implementasi fitur sesuai pilar BMC:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCODInfo?.();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Coba Fitur COD
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenClaimInfo?.();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Coba Klaim Ganti Rugi
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenConsultation?.();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Coba Solusi & CS Ramah
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* TAB DESKRIPSI USAHA */
            <div className="space-y-6 text-xs">
              
              {/* Filosofi Nama Usaha (4 Sudut yang Sama Besar) */}
              <div className="p-5 rounded-3xl bg-[#212325] border border-zinc-700 space-y-3">
                <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                  <Building2 className="w-5 h-5" />
                  <span>Filosofi & Nilai Inti Organisasi</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Mengadopsi prinsip <strong>"Keseimbangan 4 Sudut"</strong>: Setiap sudut memiliki ukuran dan sudut yang sama besar, melambangkan bahwa seluruh 4 anggota tim pendiri memiliki <strong>hak dan tanggung jawab yang setara</strong> untuk saling bahu-membahu membangun usaha ini menjadi semakin maju, terpercaya, dan profesional.
                </p>
              </div>

              {/* Manfaat Usaha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Untuk Pemilik Usaha */}
                <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>Manfaat Untuk Pemilik Usaha</span>
                  </div>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Mendapatkan keuntungan:</strong> Monetisasi dari biaya rekber, inspeksi independen, dan premi asuransi pengiriman.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Membangkitkan jiwa kewirausahaan:</strong> Mengasah kepekaan bisnis, negosiasi dengan builder, dan kepemimpinan tim.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Menambah wawasan dan pengalaman:</strong> Pemahaman mendalam mengenai legalitas kendaraan, rantai pasok logistik, dan mediasi sengketa.</span>
                    </li>
                  </ul>
                </div>

                {/* Untuk Customer */}
                <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Manfaat Untuk Customer</span>
                  </div>
                  <ul className="space-y-2 text-zinc-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Memberikan kemudahan bagi customer:</strong> Satu pintu untuk cari motor, dengar suara mesin, cek legalitas, hingga bayar rekber.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Customer lebih cepat mendapatkan barang:</strong> Jaringan armada flatbed towing terhubung langsung siap jalan tanpa perantara berbelit.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><strong>Customer dapat memesan dari rumah:</strong> Cukup pilih unit lewat gadget, bayar DP, dan tunggu chopper tiba di garasi.</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* 5 Jenis Layanan Sesuai Slide */}
              <div className="p-5 rounded-3xl bg-[#121316] border border-zinc-800 space-y-4">
                <h4 className="text-xs font-mono uppercase font-bold text-zinc-200 tracking-wider">
                  5 Standar Layanan Emas yang Diberikan:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800/80 flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#EC0618] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      1
                    </div>
                    <div>
                      <span className="font-bold text-white block">Melayani customer dengan ramah</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Komunikasi kekeluargaan khas komunitas roda dua yang bersahabat dan transparan.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800/80 flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#EC0618] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-white block">Memberikan respon yang cepat</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">SLA tanggap pesan instan di bawah 1 menit via live chat dan WhatsApp official.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800/80 flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#EC0618] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-white block">Memberikan solusi atas permasalahan</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Membantu konsultasi budget, rekomendasi postur tubuh, serta bantuan cek fisik legalitas.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800/80 flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#EC0618] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      4
                    </div>
                    <div>
                      <span className="font-bold text-white block">Melayani pembayaran metode COD</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Cash on Delivery di tempat setelah armada towing tiba dan customer selesai inspeksi fisik di rumah.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800/80 flex items-start gap-2.5 sm:col-span-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      5
                    </div>
                    <div>
                      <span className="font-bold text-white block">Memberikan layanan ganti rugi jika ada kesalahan atas persetujuan sebelumnya</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Jaminan 100% uang kembali atau kompensasi biaya servis jika unit mengalami kerusakan towing atau tidak akur dengan deskripsi.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
