'use client';

import { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { getAuth, getGoogleProvider } from '@/lib/firebase';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub: () => void;
    (async () => {
      const auth = await getAuth();
      const { onAuthStateChanged } = await import('firebase/auth');
      unsub = onAuthStateChanged(auth, (currentUser: User | null) => {
        setUser(currentUser);
        setLoading(false);
      });
    })();
    return () => unsub?.();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const auth = await getAuth();
      const provider = await getGoogleProvider();
      const { signInWithPopup } = await import('firebase/auth');
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const signOut = async () => {
    try {
      const auth = await getAuth();
      const mod = await import('firebase/auth');
      await mod.signOut(auth);
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  return { user, loading, signInWithGoogle, signOut };
}
