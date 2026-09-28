import React, { useState } from 'react';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Lock, 
  Phone, 
  CreditCard, 
  FileText, 
  LogOut, 
  X, 
  Check, 
  Copy, 
  KeyRound, 
  AlertCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, riderProfile, privateInfo, signInWithGoogle, logout, updatePrivateInfo, authError, clearAuthError } = useAuth();
  
  const [phoneInput, setPhoneInput] = useState(privateInfo.phone || '');
  const [bankInput, setBankInput] = useState(privateInfo.bankAccount || '');
  const [notesInput, setNotesInput] = useState(privateInfo.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Sync inputs when privateInfo updates
  React.useEffect(() => {
    setPhoneInput(privateInfo.phone || '');
    setBankInput(privateInfo.bankAccount || '');
    setNotesInput(privateInfo.notes || '');
  }, [privateInfo]);

  if (!isOpen) return null;

  const handleSavePrivateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updatePrivateInfo({
        phone: phoneInput.trim(),
        bankAccount: bankInput.trim(),
        notes: notesInput.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const copyUidToClipboard = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#18191c] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 bg-[#121316] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EC0618]/15 text-[#EC0618] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Profil & Keamanan Akun
              </h3>
              <p className="text-xs text-zinc-400">
                Terautentikasi Firebase & Terisolasi Berdasarkan UID
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
              <button onClick={clearAuthError} className="ml-auto text-red-300 hover:text-white">✕</button>
            </div>
          )}

          {!user ? (
            /* Unauthenticated State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#212325] border border-zinc-700 flex items-center justify-center mx-auto text-zinc-400">
                <UserIcon className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Belum Masuk Akun</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Masuk dengan akun Google Anda untuk menyimpan motor chopper dan bertransaksi dengan aman.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Lanjutkan dengan Google</span>
                </button>
              </div>
            </div>
          ) : (
            /* Authenticated User Profile */
            <div className="space-y-6">
              
              {/* User Avatar & Info Card */}
              <div className="p-4 rounded-2xl bg-[#121316] border border-zinc-800 flex items-center gap-4">
                <img
                  src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={user.displayName || 'Rider'}
                  className="w-14 h-14 rounded-full object-cover border-2 border-zinc-700 ring-2 ring-[#EC0618]/30"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white truncate">
                      {user.displayName || 'Rider Nusantara'}
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-mono text-zinc-400 truncate">
                      UID: {user.uid.slice(0, 10)}...{user.uid.slice(-4)}
                    </span>
                    <button
                      type="button"
                      onClick={copyUidToClipboard}
                      className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Salin UID"
                    >
                      {copiedUid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Encrypted Sensitive Data Form */}
              <form onSubmit={handleSavePrivateInfo} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Lock className="w-4 h-4 text-[#EC0618]" />
                    <span>Data Pribadi Terenkripsi (AES-256)</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Hanya Anda yang dapat membaca
                  </span>
                </div>

                <div className="space-y-3 bg-[#141517] p-4 rounded-2xl border border-zinc-800">
                  {/* Phone Input */}
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Nomor WhatsApp / HP:</span>
                    </label>
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="Contoh: 0812-3456-7890"
                      className="w-full bg-[#1c1e22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                    />
                    <span className="text-[10px] text-zinc-400 mt-1 block">
                      Enkripsi otomatis sebelum disimpan ke Firestore
                    </span>
                  </div>

                  {/* Bank Account Input */}
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Nomor Rekening Bank (Untuk Rekber / Pencairan):</span>
                    </label>
                    <input
                      type="text"
                      value={bankInput}
                      onChange={(e) => setBankInput(e.target.value)}
                      placeholder="Contoh: BCA 1234567890 a.n Anda"
                      className="w-full bg-[#1c1e22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                    />
                  </div>

                  {/* Private Notes */}
                  <div>
                    <label className="text-xs text-zinc-400 block mb-1 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Catatan Pembeli / Penjual:</span>
                    </label>
                    <textarea
                      rows={2}
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      placeholder="Catatan garasi, lokasi pickup pribadi, dll..."
                      className="w-full bg-[#1c1e22] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-2.5 rounded-xl bg-[#212325] hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <span>Mengenkripsi & Menyimpan...</span>
                    ) : saveSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Tersimpan & Terenkripsi Aman!</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan Terenkripsi</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Aturan Keamanan Berbasis UID Aktif</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-300 text-xs font-bold border border-red-800/60 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar Akun</span>
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
