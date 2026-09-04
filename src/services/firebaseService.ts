import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  Firestore
} from 'firebase/firestore';
import { defaultFirebaseConfig } from './firebaseConfig';
import { AppDatabase } from './storageService';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export function initFirebase(customConfig?: any) {
  try {
    const config = customConfig || defaultFirebaseConfig;
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    return { app, auth, db };
  } catch (error) {
    console.error('Lỗi khởi tạo Firebase:', error);
    return null;
  }
}

// Khởi tạo mặc định
initFirebase();

export const firebaseService = {
  getAuthInstance() {
    if (!auth) initFirebase();
    return auth;
  },

  getDbInstance() {
    if (!db) initFirebase();
    return db;
  },

  async loginWithEmail(email: string, pass: string): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const a = this.getAuthInstance();
      if (!a) throw new Error('Firebase Auth chưa sẵn sàng');
      const credential = await signInWithEmailAndPassword(a, email, pass);
      return { success: true, user: credential.user };
    } catch (err: any) {
      // Nếu tài khoản chưa tồn tại và là tài khoản thử nghiệm, tự động đăng ký
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const a = this.getAuthInstance()!;
          const credential = await createUserWithEmailAndPassword(a, email, pass);
          return { success: true, user: credential.user };
        } catch (createErr: any) {
          return { success: false, message: createErr.message };
        }
      }
      return { success: false, message: err.message };
    }
  },

  async loginWithGoogle(): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const a = this.getAuthInstance();
      if (!a) throw new Error('Firebase Auth chưa sẵn sàng');
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(a, provider);
      return { success: true, user: res.user };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  },

  async logout(): Promise<void> {
    const a = this.getAuthInstance();
    if (a) {
      await signOut(a);
    }
  },

  onAuthChanged(callback: (user: User | null) => void) {
    const a = this.getAuthInstance();
    if (!a) return () => {};
    return onAuthStateChanged(a, callback);
  },

  /**
   * Lắng nghe thời gian thực toàn bộ dữ liệu lớp từ Cloud Firestore (onSnapshot)
   */
  subscribeToClass(classId: string, onUpdate: (data: AppDatabase) => void) {
    const firestore = this.getDbInstance();
    if (!firestore) return () => {};

    const classDocRef = doc(firestore, 'classes', classId);
    return onSnapshot(
      classDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as AppDatabase;
          onUpdate(data);
        }
      },
      (error) => {
        console.warn('Lỗi lắng nghe Firestore onSnapshot:', error.message);
      }
    );
  },

  /**
   * Lưu dữ liệu lớp lên Cloud Firestore
   */
  async syncClassToCloud(classId: string, data: AppDatabase): Promise<boolean> {
    try {
      const firestore = this.getDbInstance();
      if (!firestore) return false;
      const classDocRef = doc(firestore, 'classes', classId);
      await setDoc(classDocRef, data, { merge: true });
      return true;
    } catch (error) {
      console.error('Lỗi khi ghi Firestore:', error);
      return false;
    }
  }
};

