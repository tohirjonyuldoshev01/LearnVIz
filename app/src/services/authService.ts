import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { User } from '@/types';

const normalizeUser = (
  uid: string,
  email: string | null,
  fallbackDisplayName: string,
  raw?: Partial<User>
): User => {
  const base: User = {
    id: raw?.id || uid,
    email: raw?.email || email || '',
    displayName: raw?.displayName || fallbackDisplayName,
    createdAt: raw?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (raw?.profilePicture) {
    base.profilePicture = raw.profilePicture;
  }

  return base;
};

export const authService = {
  // Register new user
  register: async (
    email: string,
    password: string,
    displayName: string
  ): Promise<User> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Create user document in Firestore
      const userData: User = {
        id: user.uid,
        email: user.email || '',
        displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      return userData;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<User> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const normalized = normalizeUser(
        user.uid,
        user.email,
        user.displayName || email.split('@')[0] || 'User',
        userDoc.data() as Partial<User>
      );

      // Keep the users collection consistent (fire-and-forget, don't block login).
      setDoc(doc(db, 'users', user.uid), normalized, { merge: true }).catch(() => {});

      return normalized;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Get current user
  getCurrentUser: (): Promise<User | null> => {
    return new Promise((resolve) => {
      // Fallback if Firebase never fires (e.g. no network at all)
      const timer = setTimeout(() => {
        console.warn('onAuthStateChanged timed out');
        resolve(null);
      }, 5000);

      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
          clearTimeout(timer);
          unsubscribe();

          if (!firebaseUser) {
            resolve(null);
            return;
          }

          // Resolve IMMEDIATELY with data Firebase Auth already has locally —
          // no Firestore round-trip needed here. user.id = uid is all the
          // dashboard and diagram queries need.
          const minimal = normalizeUser(
            firebaseUser.uid,
            firebaseUser.email,
            firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          );
          resolve(minimal);

          // Enrich with the full Firestore profile & self-heal in background.
          getDoc(doc(db, 'users', firebaseUser.uid))
            .then((userDoc) => {
              const full = normalizeUser(
                firebaseUser.uid,
                firebaseUser.email,
                minimal.displayName,
                userDoc.exists() ? (userDoc.data() as Partial<User>) : undefined,
              );
              setDoc(doc(db, 'users', firebaseUser.uid), full, { merge: true }).catch(() => {});
            })
            .catch(() => {});
        },
        (error) => {
          clearTimeout(timer);
          unsubscribe();
          console.error('Firebase auth state error:', error);
          resolve(null);
        }
      );
    });
  },

  // Get auth token
  getAuthToken: async (): Promise<string | null> => {
    try {
      return await auth.currentUser?.getIdToken() || null;
    } catch (error) {
      return null;
    }
  },
};
