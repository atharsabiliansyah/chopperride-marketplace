export type LegalStatus = 'bpkb_stnk_akur' | 'pajak_hidup' | 'pajak_mati' | 'display_only_no_paper';

export type FrameType = 'rigid_frame' | 'softail' | 'gooseneck' | 'drop_seat';

export type EngineConfiguration = 'v_twin' | 'parallel_twin' | 'single_cylinder';

export type EngineCapacity = '<250cc' | '250cc-650cc' | '>1000cc';

export type ChopperStyle = 
  | 'traditional_chopper'
  | 'frisco_style'
  | 'bobber_chopper'
  | 'digger'
  | 'japanese_narrow';

export interface ChopperDetailImage {
  id: string;
  title: string;
  description: string;
  url: string;
}

export interface SoundTestProfile {
  engineNote: string;
  idleRpm: number;
  engineType: 'harley_vtwin' | 'xs650_twin' | 'merzy_single' | 'tiger_single';
  durationSeconds: number;
  coldStartRecordedAt: string;
  decibelIdle: number;
  decibelRev: number;
  audioSimType: 'vtwin' | 'parallel_twin' | 'thumper';
}

export interface VerificationRecord {
  isInspected: boolean;
  inspectorName: string;
  inspectedAt: string;
  nokaVerified: boolean;
  nokaMasked: string;
  nosinVerified: boolean;
  nosinMasked: string;
  stnkExpiryDate: string;
  taxStatus: 'Pajak Hidup' | 'Pajak Mati' | 'No Paper (Koleksi)';
  compressionPsi: number;
  frameAlignmentScore: string;
  electricalScore: string;
  curatorNotes: string;
}

export interface BuildSheet {
  engineBase: string;
  manufactureYear: number;
  cylinderCount: string;
  displacementCc: number;
  ignitionType: 'Platina' | 'CDI Racing' | 'Electronic TCI';
  electricalSystem: '12V Fullwave Minimalist' | '12V Custom Loom' | '6V Vintage';
  frontSuspension: 'Custom Narrow Springer' | 'Girder Fork' | '33mm Telescopic Shaved' | 'Ceriani Style';
  rearSuspension: 'Rigid Hardtail' | 'Hidden Softail Monoshock' | 'Short Struts';
  frontWheel: string;
  rearWheel: string;
  brakeSystem: 'Depan Spool Hub (No Brake) / Belakang Cakram' | 'Depan Belakang Cakram Custom' | 'Vintage Drum Brake';
  transmission: 'Foot Shift 5-Speed' | 'Hand Jockey Shift & Suicide Clutch' | 'Hand Jockey Shift' | 'Foot Shift 4-Speed' | string;
  exhaustSystem: 'Custom Upswept Fishtail Pipes' | 'Shotgun Straight Pipes' | 'Drag Pipes Dual';
  paintFinishing: string;
}

export interface BuilderInfo {
  id: string;
  name: string;
  workshopName: string;
  city: string;
  avatar: string;
  rating: number;
  totalBuilds: number;
  isVerified: boolean;
  joinedYear: number;
  badge: string;
  phone: string;
}

export interface ChopperMotor {
  id: string;
  title: string;
  slug: string;
  price: number;
  location: string;
  mainImage: string;
  gallery: ChopperDetailImage[];
  soundTest: SoundTestProfile;
  legalStatus: LegalStatus;
  legalStatusLabel: string;
  frameType: FrameType;
  frameTypeLabel: string;
  engineConfig: EngineConfiguration;
  engineConfigLabel: string;
  engineCapacity: EngineCapacity;
  chopperStyle: ChopperStyle;
  chopperStyleLabel: string;
  badges: string[];
  verification: VerificationRecord;
  buildSheet: BuildSheet;
  builder: BuilderInfo;
  description: string;
  isFeatured?: boolean;
}

export interface CustomBuildOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  style: ChopperStyle;
  engineBase: string;
  engineSource: 'provided_by_client' | 'sourced_by_builder';
  frameType: FrameType;
  selectedBuilderId: string;
  estimatedBudget: number;
  conceptNotes: string;
  status: 'draft' | 'submitted' | 'builder_accepted' | 'milestone_1' | 'milestone_2' | 'milestone_3' | 'completed';
  createdAt: string;
}

export interface EscrowMilestone {
  stage: number;
  percentage: number;
  title: string;
  description: string;
  amount: number;
  status: 'completed' | 'in_progress' | 'pending';
  proofImages?: string[];
  approvedAt?: string;
}

export type EscrowStep = 1 | 2 | 3 | 4 | 5;

export interface CompensationClaim {
  id: string;
  invoiceNumber: string;
  claimCategory: 'noka_nosin_tidak_sesuai' | 'kerusakan_towing' | 'mesin_bermasalah' | 'kesalahan_deskripsi';
  claimTitle: string;
  description: string;
  compensationType: 'full_refund' | 'biaya_perbaikan_garansi' | 'retur_unit';
  requestedAmount: number;
  approvedAmount?: number;
  status: 'diajukan' | 'diverifikasi' | 'disetujui' | 'dicairkan';
  resolutionNotes?: string;
  submittedAt: string;
}

export interface EscrowTransaction {
  id: string;
  invoiceNumber: string;
  motorId: string;
  motorTitle: string;
  motorImage: string;
  motorPrice: number;
  includeInspection: boolean;
  inspectionFee: number;
  includeTowingInsurance: boolean;
  towingFee: number;
  escrowAdminFee: number;
  totalAmount: number;
  buyerName: string;
  buyerCity: string;
  sellerName: string;
  paymentMethod?: 'bca_va' | 'mandiri_va' | 'qris' | 'cod';
  codDownPayment?: number;
  codRemainingAmount?: number;
  currentStep: EscrowStep;
  inspectionHoursLeft: number;
  towingCourier: string;
  trackingNumber: string;
  isDisputed: boolean;
  disputeReason?: string;
  createdAt: string;
}

export interface ChopperFilterState {
  engineCategory: string;
  frameType: string;
  legalStatus: string;
  minPrice: number;
  maxPrice: number;
  builderId: string;
  searchQuery: string;
  sortBy: string;
}
