import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Zap, 
  HelpCircle, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  User,
  Clock,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { ChopperMotor } from '../types';

interface ConsultationSolutionModalProps {
  motors: ChopperMotor[];
  onClose: () => void;
  onSelectMotor: (motor: ChopperMotor) => void;
}

export const ConsultationSolutionModal: React.FC<ConsultationSolutionModalProps> = ({
  motors,
  onClose,
  onSelectMotor,
}) => {
  const [activeTab, setActiveTab] = useState<'finder' | 'chat'>('finder');

  // Solution Finder State
  const [budgetRange, setBudgetRange] = useState<'low' | 'mid' | 'high'>('mid');
  const [ridingExperience, setRidingExperience] = useState<'beginner' | 'daily' | 'touring'>('beginner');
  const [bodyHeight, setBodyHeight] = useState<'short' | 'medium' | 'tall'>('medium');
  const [hasSolved, setHasSolved] = useState(false);

  // Fast Response Chat State
  const [messages, setMessages] = useState<Array<{ sender: 'cs' | 'user'; text: string; time: string }>>([
    {
      sender: 'cs',
      text: 'Halo Bro! Selamat datang di ChopperRide Customer Solution. Ada kendala seputar pemilihan mesin, cek surat noka-nosin, atau pengiriman COD ke rumah?',
      time: '12:10'
    },
    {
      sender: 'cs',
      text: 'Kami melayani dengan ramah dan respon super cepat untuk membantu Anda menemukan chopper impian tanpa ragu.',
      time: '12:11'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text: inputMessage,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Fast response simulation (SLA < 1 detik)
    setTimeout(() => {
      let reply = 'Terima kasih telah berkonsultasi! Untuk kebutuhan tersebut, tim kurator kami siap mendampingi pengecekan nomor rangka & mesin resmi, serta menyiapkan opsi pengiriman COD dengan towing bergaransi penuh.';
      if (inputMessage.toLowerCase().includes('budget') || inputMessage.toLowerCase().includes('harga')) {
        reply = 'Untuk budget hemat terjangkau, kami rekomendasikan basis Binter Merzy 200cc atau Honda GL/Tiger dengan kisaran Rp 28jt - Rp 45jt, surat BPKB/STNK akur terjamin!';
      } else if (inputMessage.toLowerCase().includes('cod')) {
        reply = 'Bisa banget Bro! Kami melayani sistem COD: Anda cukup bayar DP uang jalan towing ke Rekber, unit meluncur ke rumah, dan sisa pelunasan dibayar setelah cek fisik di garasi Anda.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'cs',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 600);
  };

  // Find matching motor recommendation
  const recommendedMotor = motors.find((m) => {
    if (budgetRange === 'low') return m.price <= 45000000;
    if (budgetRange === 'high') return m.price >= 70000000;
    return m.price > 45000000 && m.price < 70000000;
  }) || motors[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#18191c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#121316] border-b border-zinc-800 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white font-display tracking-tight">
              Layanan Konsultasi & Solusi Cepat
            </h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Ramah, fast response, dan berfokus memberikan solusi tepat untuk kebutuhan chopper Anda.
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

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-[#141517] px-6 pt-3 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('finder')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'finder'
                ? 'border-[#EC0618] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Solusi Kustom Sesuai Kebutuhan</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'chat'
                ? 'border-[#EC0618] text-white'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Live Fast-Response CS (SLA &lt; 1 Menit)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Slogan Layanan */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
            <div className="p-2.5 rounded-xl bg-[#212325] border border-zinc-800 text-zinc-300 flex items-center justify-center">
              <span>Pelayanan Ramah</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#212325] border border-zinc-800 text-zinc-300 flex items-center justify-center">
              <span>Respon Super Cepat</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#212325] border border-zinc-800 text-zinc-300 flex items-center justify-center">
              <span>Solusi Permasalahan</span>
            </div>
          </div>

          {activeTab === 'finder' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 space-y-4">
                <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider block font-bold">
                  Karakteristik & Kebutuhan Anda:
                </span>

                {/* Question 1: Budget */}
                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1.5">
                    1. Rencana Budget Pembelian:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'low', label: 'Rp 25 - 45 Juta', desc: 'Pemula / Hemat' },
                      { id: 'mid', label: 'Rp 45 - 70 Juta', desc: 'Twin & Merzy' },
                      { id: 'high', label: '> Rp 70 Juta', desc: 'Vintage & Harley' },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudgetRange(b.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          budgetRange === b.id
                            ? 'bg-[#EC0618]/20 border-[#EC0618] text-white'
                            : 'bg-[#18191c] border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <span className="text-xs font-bold block">{b.label}</span>
                        <span className="text-[10px] text-zinc-500">{b.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Experience */}
                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1.5">
                    2. Tujuan Penggunaan Utama:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'beginner', label: 'Pertama Kali Punya Chopper' },
                      { id: 'daily', label: 'Komuter Santai Akhir Pekan' },
                      { id: 'touring', label: 'Touring Luar Kota & Riding Jauh' },
                    ].map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setRidingExperience(exp.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          ridingExperience === exp.id
                            ? 'bg-[#EC0618]/20 border-[#EC0618] text-white'
                            : 'bg-[#18191c] border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <span className="text-[11px] font-bold block">{exp.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Height */}
                <div>
                  <label className="text-xs text-zinc-300 font-semibold block mb-1.5">
                    3. Postur / Tinggi Badan Pengendara:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'short', label: '< 165 cm', desc: 'Low Seat Rigid' },
                      { id: 'medium', label: '165 - 175 cm', desc: 'Standard Frisco' },
                      { id: 'tall', label: '> 175 cm', desc: 'High Neck Long Fork' },
                    ].map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setBodyHeight(h.id as any)}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                          bodyHeight === h.id
                            ? 'bg-[#EC0618]/20 border-[#EC0618] text-white'
                            : 'bg-[#18191c] border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <span className="text-xs font-bold block">{h.label}</span>
                        <span className="text-[10px] text-zinc-500">{h.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHasSolved(true)}
                  className="w-full py-3 rounded-xl bg-[#EC0618] text-white font-bold text-xs shadow-lg shadow-[#EC0618]/30 flex items-center justify-center cursor-pointer"
                >
                  <span>Dapatkan Solusi Chopper Terbaik Saya</span>
                </button>
              </div>

              {/* Solution Result Card */}
              {hasSolved && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#212325] to-[#161719] border border-zinc-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-300 font-bold">
                      Rekomendasi Sesuai Kriteria Anda:
                    </span>
                  </div>

                  <div className="flex items-center gap-4 bg-[#121316] p-3 rounded-2xl border border-zinc-800">
                    <img
                      src={recommendedMotor.mainImage}
                      alt={recommendedMotor.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">
                        {recommendedMotor.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {recommendedMotor.buildSheet.engineBase} • {recommendedMotor.frameTypeLabel}
                      </p>
                      <div className="text-sm font-poppins font-bold text-[#EC0618] mt-1">
                        Rp {recommendedMotor.price.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 text-xs text-zinc-300 space-y-1">
                    <span className="font-bold text-white block">Kenapa ini solusi yang tepat untuk Anda?</span>
                    <p className="text-[11px] leading-relaxed text-zinc-400">
                      Unit ini memiliki ergonomi tempat duduk rendah yang sangat bersahabat untuk postur Anda, didukung mesin yang bandel dan perawatan mudah bagi pemula. Dokumen BPKB dan STNK telah diverifikasi akur serta siap dikirim via COD langsung ke garasi Anda.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectMotor(recommendedMotor);
                      onClose();
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Pilih & Lihat Detail Motor Ini</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="space-y-4">
              {/* Chat Thread */}
              <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-2xl bg-[#121316] border border-zinc-800">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                        m.sender === 'user'
                          ? 'bg-[#EC0618] text-white rounded-br-none'
                          : 'bg-[#212325] text-zinc-200 rounded-bl-none border border-zinc-700/60'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                      <span
                        className={`text-[9px] block text-right ${
                          m.sender === 'user' ? 'text-white/70' : 'text-zinc-500'
                        }`}
                      >
                        {m.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Box */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pertanyaan seputar motor, surat, atau pengiriman COD..."
                  className="flex-1 bg-[#121316] border border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#EC0618]"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-[#EC0618] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#EC0618]/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kirim</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
