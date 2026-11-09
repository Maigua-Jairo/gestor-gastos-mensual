import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useRouter, useSegments } from 'expo-router';
import * as Linking from 'expo-linking';
import { createSessionFromUrl } from '../lib/auth';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ session: null, user: null, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Manejar deep links cuando la app recibe la redirección del navegador OAuth
    const handleDeepLink = async (event: { url: string }) => {
      try {
        await createSessionFromUrl(event.url);
      } catch (error) {
        console.error('Error al procesar el deep link:', error);
      }
    };

    const urlListener = Linking.addEventListener('url', handleDeepLink);

    // 2. Verificar si la app se abrió inicialmente mediante una URL de redirección
    Linking.getInitialURL().then(async (url) => {
      if (url) {
        try {
          await createSessionFromUrl(url);
        } catch (error) {
          console.error('Error al procesar initial URL:', error);
        }
      }
    });

    // 3. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // 4. Suscribirse a cambios de estado de autenticación en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      urlListener.remove();
      subscription.unsubscribe();
    };
  }, []);

  // 5. Protección y redirección de rutas con Expo Router
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(main)');
    }
  }, [session, segments, isLoading]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);