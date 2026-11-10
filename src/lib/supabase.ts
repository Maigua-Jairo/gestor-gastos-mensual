import 'react-native-get-random-values';
import { AppState, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

if (Platform.OS !== 'web' && !globalThis.crypto?.subtle) {
  const subtle: Pick<SubtleCrypto, 'digest'> = {
    async digest(algorithm, data) {
      const algorithmName = typeof algorithm === 'string' ? algorithm : algorithm.name;
      if (algorithmName !== 'SHA-256') {
        throw new Error(`Algoritmo WebCrypto no compatible: ${algorithmName}`);
      }

      return Crypto.digest(Crypto.CryptoDigestAlgorithm.SHA256, data);
    },
  };
  const nativeCrypto = globalThis.crypto;

  if (nativeCrypto) {
    Object.defineProperty(nativeCrypto, 'subtle', { configurable: true, value: subtle });
  } else {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: { getRandomValues: Crypto.getRandomValues, subtle },
    });
  }
}

const WebStorageAdapter = {
  getItem: async (key: string): Promise<string | null> =>
    typeof document === 'undefined' ? null : AsyncStorage.getItem(key),
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof document !== 'undefined') await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof document !== 'undefined') await AsyncStorage.removeItem(key);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: Platform.OS === 'web' ? WebStorageAdapter : AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  }
);
// Control automático para refrescar tokens cuando la app vuelve a primer plano
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});