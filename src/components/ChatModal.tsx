import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCheck, Sparkles } from 'lucide-react';
import { BuilderInfo } from '../types';

interface ChatModalProps {
  builder: BuilderInfo;
  motorTitle?: string;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  builder,
  motorTitle,
  onClose,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'builder'; text: string; time: string }>>([
    {
      sender: 'builder',
      text: `Halo mas! Saya ${builder.name} dari ${builder.workshopName}. Ada yang ingin ditanyakan seputar unit ${motorTitle || 'kustom'} kami?`,
      time: '11:15',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickPrompts = [
    'Bisa test ride langsung di bengkel?',
    'Surat BPKB/STNK akur sampai nomor mesin?',
    'Bisa dibantu balik nama STNK/BPKB?',
    'Kondisi kompresi mesin berapa PSI?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Simulated builder reply after 1 second
    setTimeout(() => {
      let reply = 'Bisa banget mas! Semua unit kami bergaransi lolos inspeksi fisik ChopperRide.';
      if (text.includes('test ride')) {
        reply = `Boleh banget mas, silakan mampir ke garasi kami di ${builder.city}. Nanti kita rolling bareng sekitaran bengkel!`;
      } else if (text.includes('Surat') || text.includes('BPKB')) {
        reply = 'Surat 100% akur tembus BPKB & STNK, noka dan nosin sudah dicocokkan sama kurator ChopperRide mas.';
      } else if (text.includes('kompresi')) {
        reply = 'Kompresi padat di atas 140 PSI mas, piston dan ring masih segar siap blar luar kota.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'builder',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#18191c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[560px]">
        
        {/* Chat Header */}
        <div className="p-4 sm:p-5 bg-[#121316] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={builder.avatar}
                alt={builder.workshopName}
                className="w-10 h-10 rounded-full object-cover border border-zinc-700"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-[#121316]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-none">
                {builder.workshopName}
              </h4>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                {builder.name} • {builder.city}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0d0e11]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#EC0618] text-white rounded-br-none'
                    : 'bg-[#212325] text-zinc-200 border border-zinc-700/60 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 bg-[#121316] border-t border-zinc-800 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[10px] bg-zinc-800 hover:bg-[#212325] text-zinc-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-zinc-700/50 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-3 bg-[#18191c] border-t border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tulis pesan ke builder..."
            className="flex-1 bg-[#121316] border border-zinc-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
