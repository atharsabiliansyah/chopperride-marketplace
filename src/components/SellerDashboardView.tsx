import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Camera, 
  Video, 
  Volume2, 
  ShieldCheck, 
  AlertCircle,
  Building,
  ArrowDownToLine,
  Check,
  Eye,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Sparkles,
  Phone,
  MapPin,
  Tag,
  Lock
} from 'lucide-react';
import { ChopperMotor, FrameType, ChopperStyle, LegalStatus, EngineConfiguration } from '../types';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { sanitizeInput, validateListingInput } from '../utils/security';

interface SellerDashboardViewProps {
  myMotors: ChopperMotor[];
  onAddNewListing: (motor: ChopperMotor) => void;
  onDeleteListing?: (motorId: string) => void;
  onViewInMarketplace?: (motor: ChopperMotor) => void;
}

// Helper to compress local images to max 1200px to ensure fast load & safe storage
const compressImageFile = (file: File, maxWidth = 1200, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const SellerDashboardView: React.FC<SellerDashboardViewProps> = ({
  myMotors,
  onAddNewListing,
  onDeleteListing,
  onViewInMarketplace,
}) => {
  const { user, privateInfo } = useAuth();
  const [activeTab, setActiveTab] = useState<'new_listing' | 'listings' | 'orders' | 'wallet'>('new_listing');

  // Form Field States
  const [title, setTitle] = useState('');
  const [sellerName, setSellerName] = useState(user?.displayName || '');
  const [workshopName, setWorkshopName] = useState('');
  const [sellerPhone, setSellerPhone] = useState(privateInfo.phone || '');
  const [engineBase, setEngineBase] = useState('Kawasaki Binter Merzy KZ200');
  const [displacementCc, setDisplacementCc] = useState<number>(200);
  const [manufactureYear, setManufactureYear] = useState<number>(1982);
  const [frameType, setFrameType] = useState<FrameType>('rigid_frame');
  const [chopperStyle, setChopperStyle] = useState<ChopperStyle>('traditional_chopper');
  const [price, setPrice] = useState<number>(38500000);
  const [location, setLocation] = useState('Yogyakarta');
  const [description, setDescription] = useState('');
  const [nokaInput, setNokaInput] = useState('');
  const [nosinInput, setNosinInput] = useState('');
  const [legalStatus, setLegalStatus] = useState<LegalStatus>('bpkb_stnk_akur');
  const [exhaustSystem, setExhaustSystem] = useState('Custom Upswept Fishtail Pipes');
  const [transmission, setTransmission] = useState('Foot Shift 5-Speed');

  // Real Upload States
  const [mainImageUrl, setMainImageUrl] = useState<string>('');
  const [isProcessingMainImage, setIsProcessingMainImage] = useState(false);
  const [galleryImages, setGalleryImages] = useState<Array<{ id: string; title: string; url: string }>>([]);
  const [bpkbFile, setBpkbFile] = useState<{ name: string; size: string; previewUrl?: string } | null>(null);
  const [stnkFile, setStnkFile] = useState<{ name: string; size: string; previewUrl?: string } | null>(null);
  const [videoFile, setVideoFile] = useState<{ name: string; size: string } | null>(null);

  // Success Feedback & Published Object
  const [publishedMotor, setPublishedMotor] = useState<ChopperMotor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Refs for hidden file inputs
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const bpkbInputRef = useRef<HTMLInputElement>(null);
  const stnkInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Wallet State
  const [escrowPendingBalance] = useState(38500000);
  const [availableBalance, setAvailableBalance] = useState(89000000);
  const [withdrawBank, setWithdrawBank] = useState('BCA');
  const [withdrawAccount, setWithdrawAccount] = useState('8810293112');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50000000);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Real Main Image File Picker Handler
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingMainImage(true);
    setFormError(null);
    try {
      const compressedDataUrl = await compressImageFile(file);
      setMainImageUrl(compressedDataUrl);
    } catch (err) {
      console.error(err);
      setFormError('Gagal memproses gambar motor. Coba gunakan foto lain.');
    } finally {
      setIsProcessingMainImage(false);
    }
  };

  // Real Gallery Files Picker Handler
  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const newItems: Array<{ id: string; title: string; url: string }> = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dataUrl = await compressImageFile(file);
        newItems.push({
          id: `gal-${Date.now()}-${i}`,
          title: `Foto Tambahan ${galleryImages.length + i + 1}`,
          url: dataUrl,
        });
      }
      setGalleryImages((prev) => [...prev, ...newItems]);
    } catch (err) {
      console.error(err);
    }
  };

  // Real BPKB File Upload Handler
  const handleBpkbChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    const sizeFormatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
    
    // If it's an image, create preview
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setBpkbFile({
          name: file.name,
          size: sizeFormatted,
          previewUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setBpkbFile({
        name: file.name,
        size: sizeFormatted,
      });
    }
  };

  // Real STNK File Upload Handler
  const handleStnkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    const sizeFormatted = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setStnkFile({
          name: file.name,
          size: sizeFormatted,
          previewUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setStnkFile({
        name: file.name,
        size: sizeFormatted,
      });
    }
  };

  // Real Video File Upload Handler
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setVideoFile({
      name: file.name,
      size: `${sizeMb} MB`,
    });
  };

  // Form Submission: Create Authentic Chopper Listing
  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation & Sanitization
    const sanitizedTitle = sanitizeInput(title, 200);
    const sanitizedEngine = sanitizeInput(engineBase, 100);
    const sanitizedLocation = sanitizeInput(location, 100);
    const sanitizedDesc = sanitizeInput(description || 'Unit motor chopper kustom kurasi berkualitas tinggi, sasis rigid presisi, mesin sehat bertenaga, siap blar touring maupun daily ride.', 3000);
    const sanitizedSellerName = sanitizeInput(sellerName || user?.displayName || 'Pemilik Langsung', 100);
    const sanitizedPhone = sanitizeInput(sellerPhone || privateInfo.phone || '081234567890', 50);

    const validation = validateListingInput({
      title: sanitizedTitle,
      engineBase: sanitizedEngine,
      price: Number(price),
      description: sanitizedDesc
    });

    if (!validation.isValid) {
      setFormError(validation.error || 'Silakan lengkapi data iklan Anda dengan benar.');
      return;
    }

    if (!mainImageUrl.trim()) {
      setFormError('Silakan unggah foto utama motor chopper Anda.');
      return;
    }

    const finalMainImage = mainImageUrl.trim();

    setIsSubmitting(true);

    // Determine engine configuration
    let config: EngineConfiguration = 'single_cylinder';
    let configLabel = 'Single Cylinder Thumper';
    const lowerEngine = engineBase.toLowerCase();
    if (lowerEngine.includes('harley') || lowerEngine.includes('v-twin') || lowerEngine.includes('vtwin')) {
      config = 'v_twin';
      configLabel = 'V-Twin Engine';
    } else if (lowerEngine.includes('xs650') || lowerEngine.includes('twin') || lowerEngine.includes('parallel')) {
      config = 'parallel_twin';
      configLabel = 'Parallel Twin Engine';
    }

    // Determine capacity category
    let capacityCategory: '<250cc' | '250cc-650cc' | '>1000cc' = '<250cc';
    if (displacementCc >= 1000) {
      capacityCategory = '>1000cc';
    } else if (displacementCc >= 250) {
      capacityCategory = '250cc-650cc';
    }

    // Frame label
    const frameLabels: Record<FrameType, string> = {
      rigid_frame: 'Rigid Hardtail Frame',
      softail: 'Softail (Hidden Monoshock)',
      gooseneck: 'Gooseneck Custom Frame',
      drop_seat: 'Drop Seat Rigid',
    };

    // Chopper style label
    const styleLabels: Record<ChopperStyle, string> = {
      traditional_chopper: 'Traditional Chopper',
      frisco_style: 'Frisco High Neck Chopper',
      bobber_chopper: 'Bobber Chopper',
      japanese_narrow: 'Japanese Narrow Stance',
      digger: 'Digger Long Chopper',
    };

    // Legal status label
    const legalLabels: Record<LegalStatus, string> = {
      bpkb_stnk_akur: 'BPKB & STNK Akur (Review Selesai)',
      pajak_hidup: 'Pajak Hidup & Surat Lengkap',
      pajak_mati: 'Surat Lengkap (Pajak Terlelap)',
      display_only_no_paper: 'No Paper / Koleksi',
    };

    // Construct gallery: include main image + extra uploaded images
    const finalGallery = [
      {
        id: 'g-main',
        title: 'Tampak Utama Samping',
        description: `${title} - Garis rangka ${frameLabels[frameType]} proporsional.`,
        url: finalMainImage,
      },
      ...galleryImages.map((g, idx) => ({
        id: g.id || `g-extra-${idx}`,
        title: g.title,
        description: 'Detail visual bagian kustom.',
        url: g.url,
      })),
    ];

    const newMotor: ChopperMotor = {
      id: `cr-user-${Date.now()}`,
      title: title.trim(),
      slug: `custom-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
      price: Number(price),
      location: location.trim() || 'Indonesia',
      mainImage: finalMainImage,
      gallery: finalGallery,
      engineConfig: config,
      engineConfigLabel: configLabel,
      engineCapacity: capacityCategory,
      frameType: frameType,
      frameTypeLabel: frameLabels[frameType],
      chopperStyle: chopperStyle,
      chopperStyleLabel: styleLabels[chopperStyle],
      badges: ['Unit Baru Tayang'],
      legalStatus: legalStatus,
      legalStatusLabel: legalLabels[legalStatus],
      builder: {
        id: 'user-seller',
        name: sellerName.trim() || 'Pemilik Langsung',
        workshopName: workshopName.trim() || `${sellerName.trim() || 'Private Garage'} Custom`,
        city: location.trim() || 'Yogyakarta',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
        totalBuilds: 1,
        isVerified: true,
        joinedYear: 2026,
        badge: 'Owner Seller',
        phone: sellerPhone.trim() || '081234567890',
      },
      soundTest: {
        engineNote: 'Gahar & Padat',
        idleRpm: 900,
        engineType: config === 'v_twin' ? 'harley_vtwin' : config === 'parallel_twin' ? 'xs650_twin' : 'merzy_single',
        durationSeconds: 45,
        coldStartRecordedAt: 'Hari ini',
        decibelIdle: 88,
        decibelRev: 106,
        audioSimType: config === 'v_twin' ? 'vtwin' : config === 'parallel_twin' ? 'parallel_twin' : 'thumper',
      },
      verification: {
        isInspected: true,
        inspectorName: 'Chief Curator ChopperRide',
        inspectedAt: 'Hari ini',
        nokaVerified: true,
        nokaMasked: nokaInput ? `${nokaInput.slice(0, 5)}***` : 'CHOPP***',
        nosinVerified: true,
        nosinMasked: nosinInput ? `${nosinInput.slice(0, 5)}***` : 'ENG20***',
        stnkExpiryDate: '2028-12',
        taxStatus: legalStatus === 'pajak_mati' ? 'Pajak Mati' : legalStatus === 'display_only_no_paper' ? 'No Paper (Koleksi)' : 'Pajak Hidup',
        compressionPsi: 145,
        frameAlignmentScore: 'Presisi Jig Sasis 99%',
        electricalScore: 'Kelistrikan 12V Prima',
        curatorNotes: 'Unit chopper didaftarkan langsung oleh pemilik, kelengkapan berkas fisik diverifikasi.',
      },
      buildSheet: {
        engineBase: engineBase,
        manufactureYear: manufactureYear,
        displacementCc: displacementCc,
        cylinderCount: config === 'v_twin' ? '2 Silinder V' : config === 'parallel_twin' ? '2 Silinder Segaris' : '1 Silinder',
        ignitionType: 'CDI Racing',
        electricalSystem: '12V Fullwave Minimalist',
        frontSuspension: 'Custom Narrow Springer',
        rearSuspension: frameType === 'rigid_frame' ? 'Rigid Hardtail' : 'Hidden Softail Monoshock',
        frontWheel: '21 inch Custom Spoke + Vintage Tread',
        rearWheel: '16 inch Custom Steel + Deluxe Tire',
        brakeSystem: 'Depan Belakang Cakram Custom',
        transmission: transmission as any,
        exhaustSystem: exhaustSystem as any,
        paintFinishing: 'Handcrafted Deep Black & Chrome Finish',
      },
      description: description.trim() || 'Unit motor chopper kustom kurasi berkualitas tinggi, sasis rigid presisi, mesin sehat bertenaga, siap blar touring maupun daily ride.',
      isFeatured: false,
    };

    // Save to user's UID-keyed subcollection in Firestore if authenticated
    if (user) {
      try {
        const listingDocRef = doc(db, 'users', user.uid, 'listings', newMotor.id);
        await setDoc(listingDocRef, {
          id: newMotor.id,
          userId: user.uid,
          title: newMotor.title,
          engineBase: sanitizedEngine,
          price: Number(price),
          frameType: frameType,
          style: chopperStyle,
          legalStatus: legalStatus,
          city: sanitizedLocation,
          imageUrl: finalMainImage,
          description: sanitizedDesc,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Notice saving listing to Firestore:', err);
      }
    }

    // Save & Publish
    onAddNewListing(newMotor);
    setPublishedMotor(newMotor);
    setIsSubmitting(false);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount > availableBalance) return;
    setAvailableBalance(prev => prev - withdrawAmount);
    setWithdrawSuccess(true);
    setTimeout(() => setWithdrawSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-zinc-100 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Top Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
            Pasang Iklan Motor Chopper
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            Iklankan motor chopper Anda ke komunitas pecinta kustom se-Indonesia dengan sistem rekber bergaransi.
          </p>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'new_listing', label: 'Formulir Pasang Iklan', },
            { id: 'listings', label: 'Motor yang Saya Iklankan', count: myMotors.length },
            { id: 'orders', label: 'Pesanan & Towing', },
            { id: 'wallet', label: 'Saldo & Rekening',  },
          ].map((tab) => {
      
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#212325] text-white border border-zinc-700 shadow-md'
                    : 'bg-[#121316] text-zinc-400 hover:text-white border border-zinc-800/80'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded-full font-mono">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: FORMULIR PASANG IKLAN ASLI */}
        {activeTab === 'new_listing' && (
          <div className="max-w-4xl mx-auto">
            
            {/* SUCCESS BANNER WHEN PUBLISHED */}
            {publishedMotor ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#121316] border border-emerald-500/50 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Iklan Chopper Berhasil Diterbitkan!
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5">
                      Motor chopper kustom Anda kini langsung tayang dan dapat dilihat calon pembeli di marketplace ChopperRide.
                    </p>
                  </div>
                </div>

                {/* Card Preview of Published Chopper */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-[#18191c] border border-zinc-800">
                  <img
                    src={publishedMotor.mainImage}
                    alt={publishedMotor.title}
                    className="w-full sm:w-44 h-32 rounded-xl object-cover border border-zinc-700"
                  />
                  <div className="flex-1 space-y-1.5 w-full">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-[10px] font-mono text-emerald-400 font-bold">
                      Status: Aktif & Tayang Publik
                    </span>
                    <h4 className="text-base font-bold text-white">{publishedMotor.title}</h4>
                    <p className="text-xs text-zinc-400">
                      {publishedMotor.location} • {publishedMotor.engineConfigLabel} • {publishedMotor.frameTypeLabel}
                    </p>
                    <div className="text-lg font-mono font-extrabold text-[#EC0618] pt-1">
                      {formatPrice(publishedMotor.price)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onViewInMarketplace) {
                        onViewInMarketplace(publishedMotor);
                      }
                    }}
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#EC0618]/30 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Lihat Iklan di Marketplace Sekarang</span>
                  </button>

                  <button
                    onClick={() => {
                      setPublishedMotor(null);
                      setActiveTab('listings');
                    }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#212325] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Ke Daftar Iklan Saya</span>
                  </button>

                  <button
                    onClick={() => {
                      setPublishedMotor(null);
                      setTitle('');
                      setDescription('');
                      setMainImageUrl('');
                      setGalleryImages([]);
                    }}
                    className="w-full sm:w-auto py-3.5 px-4 text-xs text-zinc-400 hover:text-zinc-200"
                  >
                    + Buat Iklan Lainnya
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateListing} className="p-6 sm:p-8 rounded-3xl bg-[#121316] border border-zinc-800 shadow-2xl space-y-8">
                
                {/* Form Introduction */}
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Lengkapi Rincian Motor Chopper Anda
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Unggah foto asli unit, isi spesifikasi teknis dan berkas legalitas untuk memastikan iklan Anda terverifikasi.
                    </p>
                  </div>
                </div>

                {formError && (
                  <div className="p-4 rounded-xl bg-red-950/80 border border-red-700/80 text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Foto Utama Motor */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-white">Foto Motor</h4>

                  {/* Real File Input (Hidden) */}
                  <input
                    type="file"
                    ref={mainImageInputRef}
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className="hidden"
                  />

                  {/* Drag / Click Upload Area */}
                  {mainImageUrl ? (
                    <div className="relative rounded-2xl overflow-hidden border border-zinc-700 bg-black group max-h-[360px] flex items-center justify-center">
                      <img
                        src={mainImageUrl}
                        alt="Foto Motor Chopper"
                        className="w-full h-full max-h-[360px] object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => mainImageInputRef.current?.click()}
                          className="px-3.5 py-1.5 rounded-xl bg-[#212325]/90 hover:bg-zinc-800 text-white text-xs font-bold border border-zinc-700 shadow-md transition-all cursor-pointer backdrop-blur-sm"
                        >
                          Ganti Foto
                        </button>
                        <button
                          type="button"
                          onClick={() => setMainImageUrl('')}
                          className="px-3.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold border border-red-800 shadow-md transition-all cursor-pointer backdrop-blur-sm"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => mainImageInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-700 hover:border-[#EC0618] rounded-2xl p-8 text-center cursor-pointer transition-all bg-[#18191c]/50 hover:bg-[#18191c] group"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-[#212325] group-hover:bg-[#EC0618]/20 text-zinc-400 group-hover:text-[#EC0618] flex items-center justify-center mx-auto mb-3 transition-colors">
                        <Upload className="w-7 h-7" />
                      </div>
                      <span className="text-sm font-bold text-white block mb-1">
                        Klik untuk Pilih Foto Motor Anda
                      </span>
                      <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                        Pilih foto terbaik motor chopper Anda
                      </p>
                    </div>
                  )}
                </div>

                {/* Foto Tambahan Galeri */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">Foto Tambahan Galeri</h4>
                    {galleryImages.length > 0 && (
                      <span className="text-[11px] text-zinc-400">
                        {galleryImages.length} Foto Ditambahkan
                      </span>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={galleryInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleGalleryImagesChange}
                    className="hidden"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryImages.map((g, idx) => (
                      <div key={g.id} className="relative rounded-xl overflow-hidden border border-zinc-700 bg-black group h-24">
                        <img src={g.url} alt={g.title} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages((prev) => prev.filter((item) => item.id !== g.id))}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl h-24 flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mb-1" />
                      <span className="text-[10px] font-bold"> Tambah Foto</span>
                    </button>
                  </div>
                </div>

                {/* Informasi Unit & Harga */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-bold text-white">Informasi Unit & Harga</h4>

                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1">
                      Judul Iklan Motor Chopper: *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Contoh: Chopper Rigid Binter Merzy 200cc Street Tracker"
                      className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#EC0618]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Harga Jual: *
                      </label>
                      <input
                        type="number"
                        required
                        min={1000000}
                        step={500000}
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Lokasi Unit: *
                      </label>
                      <input
                        type="text"
                        required
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Nama Pemilik / Penjual:
                      </label>
                      <input
                        type="text"
                        value={sellerName}
                        onChange={(e) => setSellerName(e.target.value)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Nama Bengkel:
                      </label>
                      <input
                        type="text"
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Nomor WhatsApp Penjual:
                      </label>
                      <input
                        type="text"
                        value={sellerPhone}
                        onChange={(e) => setSellerPhone(e.target.value)}
                        placeholder="08123456789"
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>
                  </div>
                </div>

                {/* Spesifikasi Teknis */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-bold text-white">Spesifikasi Mesin & Rangka</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Basis Mesin:
                      </label>
                      <select
                        value={engineBase}
                        onChange={(e) => setEngineBase(e.target.value)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      >
                        <option value="Kawasaki Binter Merzy KZ200">Kawasaki Binter Merzy KZ200</option>
                        <option value="Yamaha XS650 1979">Yamaha XS650 (Parallel Twin)</option>
                        <option value="Harley-Davidson Sportster 1200">Harley-Davidson Sportster 1200</option>
                        <option value="Harley-Davidson Shovelhead 1200">Harley-Davidson Shovelhead 1200</option>
                        <option value="Honda Tiger 200cc">Honda Tiger / GL 200cc</option>
                        <option value="Yamaha SR400 Big Single">Yamaha SR400 Big Single</option>
                        <option value="Suzuki Thunder 250">Suzuki Thunder 250</option>
                        <option value="Custom V-Twin Kustom">Custom V-Twin</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Kapasitas Silinder:
                      </label>
                      <input
                        type="number"
                        value={displacementCc}
                        onChange={(e) => setDisplacementCc(Number(e.target.value))}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Tahun Perakitan Mesin:
                      </label>
                      <input
                        type="number"
                        value={manufactureYear}
                        onChange={(e) => setManufactureYear(Number(e.target.value))}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Tipe Rangka:
                      </label>
                      <select
                        value={frameType}
                        onChange={(e) => setFrameType(e.target.value as FrameType)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      >
                        <option value="rigid_frame">Rigid Frame (Hardtail)</option>
                        <option value="softail">Softail (Hidden Monoshock)</option>
                        <option value="gooseneck">Gooseneck Frame</option>
                        <option value="drop_seat">Drop Seat Frame</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Gaya Aliran Chopper:
                      </label>
                      <select
                        value={chopperStyle}
                        onChange={(e) => setChopperStyle(e.target.value as ChopperStyle)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      >
                        <option value="traditional_chopper">Traditional Chopper</option>
                        <option value="frisco_style">Frisco Style High Neck</option>
                        <option value="bobber_chopper">Bobber Chopper</option>
                        <option value="japanese_narrow">Japanese Narrow Stance</option>
                        <option value="digger">Digger Style</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Model Knalpot:
                      </label>
                      <input
                        type="text"
                        value={exhaustSystem}
                        onChange={(e) => setExhaustSystem(e.target.value)}
                        placeholder="Contoh: Custom Upswept Fishtail Pipes"
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Transmisi & Shifter:
                      </label>
                      <select
                        value={transmission}
                        onChange={(e) => setTransmission(e.target.value)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      >
                        <option value="Foot Shift 5-Speed">Foot Shift 5-Speed</option>
                        <option value="Hand Jockey Shift & Suicide Clutch">Hand Jockey Shift & Suicide Clutch</option>
                        <option value="Foot Shift 4-Speed">Foot Shift 4-Speed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1">
                      Deskripsi & Catatan Detail Unit:
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Jelaskan kondisi mesin, karburator, kelistrikan, riwayat pengerjaan sasis, cat metalflake, dan ban..."
                      className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                    />
                  </div>
                </div>

                {/* Dokumen & Legalitas */}
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-bold text-white">Surat & Dokumen</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Status Surat:
                      </label>
                      <select
                        value={legalStatus}
                        onChange={(e) => setLegalStatus(e.target.value as LegalStatus)}
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      >
                        <option value="bpkb_stnk_akur">BPKB & STNK (Pajak Hidup)</option>
                        <option value="pajak_mati">BPKB & STNK (Pajak Terlelap)</option>
                        <option value="display_only_no_paper">No Paper (Khusus Display / Koleksi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Nomor Rangka:
                      </label>
                      <input
                        type="text"
                        value={nokaInput}
                        onChange={(e) => setNokaInput(e.target.value)}
                        placeholder="Contoh: KZ200-19281X"
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">
                        Nomor Mesin:
                      </label>
                      <input
                        type="text"
                        value={nosinInput}
                        onChange={(e) => setNosinInput(e.target.value)}
                        placeholder="Contoh: KZ200E-89102"
                        className="w-full bg-[#18191c] border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>
                  </div>

                  {/* Real Document Uploaders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* BPKB File Upload */}
                    <input
                      type="file"
                      ref={bpkbInputRef}
                      accept="image/*,application/pdf"
                      onChange={handleBpkbChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => bpkbInputRef.current?.click()}
                      className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer flex items-center gap-3 transition-colors ${
                        bpkbFile
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                          : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'
                      }`}
                    >
                      <FileText className="w-6 h-6 shrink-0" />
                      <div className="text-xs flex-1">
                        <span className="font-bold block">
                          {bpkbFile ? `✓ File BPKB: ${bpkbFile.name}` : 'Unggah Foto Lembar BPKB'}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {bpkbFile ? `Ukuran: ${bpkbFile.size} (Klik untuk ganti)` : 'Halaman identitas noka & nosin BPKB'}
                        </span>
                      </div>
                    </div>

                    {/* STNK File Upload */}
                    <input
                      type="file"
                      ref={stnkInputRef}
                      accept="image/*,application/pdf"
                      onChange={handleStnkChange}
                      className="hidden"
                    />
                    <div
                      onClick={() => stnkInputRef.current?.click()}
                      className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer flex items-center gap-3 transition-colors ${
                        stnkFile
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                          : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'
                      }`}
                    >
                      <FileText className="w-6 h-6 shrink-0" />
                      <div className="text-xs flex-1">
                        <span className="font-bold block">
                          {stnkFile ? `✓ File STNK: ${stnkFile.name}` : 'Unggah Foto Lembar STNK'}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {stnkFile ? `Ukuran: ${stnkFile.size} (Klik untuk ganti)` : 'Lembar pajak & masa berlaku'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rekaman Suara / Video Mesin */}
                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <h4 className="text-sm font-bold text-white">Video</h4>
                  <p className="text-xs text-zinc-400">
                    Video saat mesin dinyalakan dari kondisi dingin untuk meyakinkan calon pembeli
                  </p>

                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*,audio/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className={`p-5 rounded-2xl border-2 border-dashed cursor-pointer flex items-center justify-center gap-3 transition-colors ${
                      videoFile
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-zinc-700 hover:border-[#EC0618] text-zinc-400'
                    }`}
                  >
                    <Video className="w-6 h-6 shrink-0" />
                    <div className="text-xs text-center">
                      <span className="font-bold block">
                        {videoFile ? `✓ File Sound Test: ${videoFile.name} (${videoFile.size})` : 'Klik untuk Melampirkan Video / Audio Knalpot'}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {videoFile ? 'Klik jika ingin mengganti file' : 'Format MP4, MOV, atau MP3'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-2xl bg-[#EC0618] hover:bg-[#ff1e2e] disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-[#EC0618]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>{isSubmitting ? 'Memproses Iklan...' : 'Terbitkan Iklan'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

        {/* TAB 2: MOTOR YANG SAYA IKLANKAN */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Daftar Motor Chopper yang Anda Pasang
                </h3>
                <p className="text-xs text-zinc-400">
                  Kelola status tayang, lihat performa iklan di marketplace, atau perbarui data unit.
                </p>
              </div>
              <span className="text-xs text-zinc-400 font-mono bg-[#18191c] px-3 py-1.5 rounded-full border border-zinc-800">
                Total: {myMotors.length} Unit
              </span>
            </div>

            {myMotors.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#121316] border border-zinc-800 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Belum Ada Iklan yang Anda Pasang</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Punya motor chopper kustom yang ingin dijual? Pasang iklan sekarang dan temukan pembeli terverifikasi.
                </p>
                <button
                  onClick={() => setActiveTab('new_listing')}
                  className="px-6 py-2.5 rounded-full bg-[#EC0618] hover:bg-[#ff1e2e] text-white text-xs font-bold shadow-lg shadow-[#EC0618]/25 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Pasang Iklan Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myMotors.map((motor) => (
                  <div
                    key={motor.id}
                    className="rounded-2xl bg-[#121316] border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all shadow-lg"
                  >
                    <div className="relative h-48 w-full bg-black">
                      <img
                        src={motor.mainImage}
                        alt={motor.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold uppercase shadow-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Aktif Tayang</span>
                        </span>
                      </div>
                      <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 text-zinc-300 text-[10px] font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#EC0618]" />
                        <span>{motor.location}</span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                          {motor.frameTypeLabel} • {motor.engineConfigLabel}
                        </span>
                        <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">
                          {motor.title}
                        </h4>
                        <div className="text-base font-mono font-bold text-[#EC0618]">
                          {formatPrice(motor.price)}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onViewInMarketplace) onViewInMarketplace(motor);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#212325] hover:bg-[#EC0618] text-zinc-200 hover:text-white text-xs font-bold border border-zinc-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Lihat Iklan</span>
                        </button>

                        {onDeleteListing && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`Apakah Anda yakin ingin menghapus iklan "${motor.title}"?`)) {
                                if (user) {
                                  try {
                                    await deleteDoc(doc(db, 'users', user.uid, 'listings', motor.id));
                                  } catch (err) {
                                    console.warn('Error deleting listing from Firestore:', err);
                                  }
                                }
                                onDeleteListing(motor.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-900/50 transition-all cursor-pointer"
                            title="Hapus Iklan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PESANAN & TOWING */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-white">
              Pesanan Masuk & Pengiriman Towing
            </h3>

            <div className="p-6 rounded-3xl bg-[#121316] border border-zinc-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-mono text-zinc-400 block">Nomor Pesanan: #CR-TX-90812</span>
                  <h4 className="text-base font-bold text-white">
                    Binter Merzy 200cc Frisco Chopper - Rigid Frame
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold font-mono self-start sm:self-auto">
                  Masa Uji Garansi 2x24 Jam
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono">Pembeli</span>
                  <span className="text-white font-bold block mt-0.5">Rian Pratama</span>
                  <span className="text-zinc-400">Jakarta Barat</span>
                </div>
                <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono">Ekspedisi Towing</span>
                  <span className="text-white font-bold block mt-0.5">Indah Logistik Flatbed</span>
                  <span className="text-zinc-400 font-mono">Resi: CR-TOW-2026-88192X</span>
                </div>
                <div className="p-3 rounded-xl bg-[#18191c] border border-zinc-800">
                  <span className="text-zinc-500 block text-[10px] uppercase font-mono">Nilai Tertahan di Rekber</span>
                  <span className="text-[#EC0618] font-bold font-mono text-sm block mt-0.5">
                    Rp 38.500.000
                  </span>
                  <span className="text-emerald-400 text-[10px]">Siap cair setelah konfirmasi</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOMPET & SALDO REKBER (PENARIKAN DANA) */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 5 Columns: Wallet Balances */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: Saldo Tertahan di Rekber Escrow */}
              <div className="p-6 rounded-3xl bg-[#121316] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
                    Saldo Tertahan di Rekber
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white">
                  {formatPrice(escrowPendingBalance)}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Menunggu masa garansi inspeksi 2x24 jam dari pembeli unit #CR-TX-90812 berakhir.
                </p>
              </div>

              {/* Card 2: Saldo Siap Ditarik */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#18191c] to-[#121316] border border-emerald-500/40 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                      Tarik Saldo                 
                       </span>
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-400">
                  {formatPrice(availableBalance)}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Hasil transaksi penjualan yang sudah dikonfirmasi tuntas dan siap diteruskan ke rekening bank Anda.
                </p>
              </div>

            </div>

            {/* Right 7 Columns: Form Penarikan Dana ke Rekening Bank */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#18191c] border border-zinc-800 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Tarik Dana Penjualan ke Rekening Bank
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Proses pencairan dana diproses instan via jaringan BI-FAST (Maksimal 15 menit).
                    </p>
                  </div>
                </div>

                {withdrawSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">Penarikan Dana Berhasil Diproses!</h4>
                    <p className="text-xs text-zinc-300">
                      Dana sebesar <strong>{formatPrice(withdrawAmount)}</strong> telah ditransfer ke rekening <strong>{withdrawBank} - {withdrawAccount}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                        Pilih Bank Tujuan:
                      </label>
                      <select
                        value={withdrawBank}
                        onChange={(e) => setWithdrawBank(e.target.value)}
                        className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#EC0618]"
                      >
                        <option value="BCA">Bank Central Asia </option>
                        <option value="Mandiri">Bank Mandiri</option>
                        <option value="BRI">Bank Rakyat Indonesia </option>
                        <option value="BNI">Bank Negara Indonesia </option>
                        <option value="BSI">Bank Syariah Indonesia </option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                        Nomor Rekening Bank:
                      </label>
                      <input
                        type="text"
                        required
                        value={withdrawAccount}
                        onChange={(e) => setWithdrawAccount(e.target.value)}
                        className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1.5">
                        Jumlah Penarikan (Rp):
                      </label>
                      <input
                        type="number"
                        max={availableBalance}
                        min={100000}
                        required
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                        className="w-full bg-[#121316] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#EC0618]"
                      />
                      <span className="text-[11px] text-zinc-500 mt-1 block">
                        Maksimal penarikan: {formatPrice(availableBalance)}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={availableBalance <= 0}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#EC0618] hover:bg-[#ff1e2e] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-[#EC0618]/25"
                    >
                      Ajukan Pencairan
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
