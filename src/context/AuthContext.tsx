import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { auth, db, googleAuthProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { encryptSensitiveData, decryptSensitiveData, sanitizeInput } from '../utils/security';

export interface RiderProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'rider' | 'verified_seller' | 'collector';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DecryptedPrivateInfo {
  phone: string;
  notes: string;
  bankAccount: string;
}

interface AuthContextType {
  user: User | null;
  riderProfile: RiderProfile | null;
  privateInfo: DecryptedPrivateInfo;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updatePrivateInfo: (info: Partial<DecryptedPrivateInfo>) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [riderProfile, setRiderProfile] = useState<RiderProfile | null>(null);
  const [privateInfo, setPrivateInfo] = useState<DecryptedPrivateInfo>({
    phone: '',
    notes: '',
    bankAccount: ''
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const privateDocRef = doc(db, 'users', currentUser.uid, 'private', 'info');

        try {
          // 1. Fetch or create public user profile document
          const userSnap = await getDoc(userDocRef);
          const nowIso = new Date().toISOString();

          if (!userSnap.exists()) {
            const initialProfile: RiderProfile = {
              userId: currentUser.uid,
              displayName: sanitizeInput(currentUser.displayName || 'Rider Nusantara', 100),
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              role: 'verified_seller',
              isVerified: true,
              createdAt: nowIso,
              updatedAt: nowIso
            };
            await setDoc(userDocRef, initialProfile);
            setRiderProfile(initialProfile);
          } else {
            const data = userSnap.data() as RiderProfile;
            setRiderProfile(data);
          }
        } catch (err) {
          console.error('Error synchronizing user profile:', err);
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        }

        // 2. Fetch and decrypt private sensitive info
        try {
          const privateSnap = await getDoc(privateDocRef);
          if (privateSnap.exists()) {
            const pData = privateSnap.data();
            const decryptedPhone = decryptSensitiveData(pData.encryptedPhone || '', currentUser.uid);
            const decryptedNotes = decryptSensitiveData(pData.encryptedNotes || '', currentUser.uid);
            const decryptedBank = decryptSensitiveData(pData.encryptedBankAccount || '', currentUser.uid);
            setPrivateInfo({
              phone: decryptedPhone,
              notes: decryptedNotes,
              bankAccount: decryptedBank
            });
          }
        } catch (err) {
          console.warn('Notice loading private user info:', err);
        }
      } else {
        setRiderProfile(null);
        setPrivateInfo({ phone: '', notes: '', bankAccount: '' });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In with Popup
  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error: any) {
      console.error('Google Sign In Error:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || 'Gagal masuk dengan Google. Silakan coba lagi.');
      }
    }
  };

  // Sign-Out
  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setRiderProfile(null);
      setPrivateInfo({ phone: '', notes: '', bankAccount: '' });
    } catch (error: any) {
      console.error('Sign Out Error:', error);
    }
  };

  // Update encrypted private info (Phone number, private notes, bank details)
  const updatePrivateInfo = async (info: Partial<DecryptedPrivateInfo>) => {
    if (!user) throw new Error('Pengguna belum terautentikasi.');

    const newPhone = info.phone !== undefined ? info.phone : privateInfo.phone;
    const newNotes = info.notes !== undefined ? info.notes : privateInfo.notes;
    const newBank = info.bankAccount !== undefined ? info.bankAccount : privateInfo.bankAccount;

    const encryptedPhone = encryptSensitiveData(newPhone, user.uid);
    const encryptedNotes = encryptSensitiveData(newNotes, user.uid);
    const encryptedBankAccount = encryptSensitiveData(newBank, user.uid);

    const privateDocRef = doc(db, 'users', user.uid, 'private', 'info');
    const path = `users/${user.uid}/private/info`;

    try {
      await setDoc(privateDocRef, {
        userId: user.uid,
        encryptedPhone,
        encryptedNotes,
        encryptedBankAccount,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setPrivateInfo({
        phone: newPhone,
        notes: newNotes,
        bankAccount: newBank
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        riderProfile,
        privateInfo,
        loading,
        signInWithGoogle,
        logout,
        updatePrivateInfo,
        authError,
        clearAuthError: () => setAuthError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
