import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

let lastCode: string | null = null;
let pendingCodeExchange: { code: string; promise: Promise<void> } | null = null;

export function getAuthRedirectUrl(path: '/confirm' | '/reset-password') {
  const configuredUrl = process.env.EXPO_PUBLIC_AUTH_WEB_URL?.trim();
  if (!configuredUrl) {
    throw new Error('Falta configurar EXPO_PUBLIC_AUTH_WEB_URL con la URL del sitio de autenticación en Vercel.');
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredUrl);
  } catch {
    throw new Error('EXPO_PUBLIC_AUTH_WEB_URL debe ser una URL válida del sitio de autenticación en Vercel.');
  }

  if (
    baseUrl.protocol !== 'https:' &&
    !(baseUrl.protocol === 'http:' && baseUrl.hostname === 'localhost')
  ) {
    throw new Error('EXPO_PUBLIC_AUTH_WEB_URL debe usar HTTPS.');
  }

  return new URL(path, baseUrl.origin).toString();
}

export async function createSessionFromUrl(url: string) {
  const { queryParams } = Linking.parse(url);
  const code = queryParams?.code;
  if (typeof code === 'string') {
    if (code === lastCode) return;
    if (pendingCodeExchange?.code === code) {
      await pendingCodeExchange.promise;
      return;
    }

    const exchangePromise = (async () => {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      lastCode = code;
    })();
    pendingCodeExchange = { code, promise: exchangePromise };

    try {
      await exchangePromise;
    } finally {
      if (pendingCodeExchange?.promise === exchangePromise) {
        pendingCodeExchange = null;
      }
    }
    return;
  }

  // Respaldo por si devuelve tokens en el fragmento
  const fragment = url.split('#')[1];
  if (fragment) {
    const params = new URLSearchParams(fragment);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) throw error;
    }
  }
}

export async function signInWithGoogle() {
  try {
    const redirectTo = Linking.createURL('auth/callback');
    if (__DEV__) {
      console.info('[AUTH] Google app redirect URI:', redirectTo);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    if (!data.url) throw new Error('Supabase no devolvió la URL de Google');

    // Abre el navegador OAuth
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    // Si el navegador devuelve la URL de éxito directamente, la procesamos
    if (result && result.type === 'success' && result.url) {
      await createSessionFromUrl(result.url);
    }
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Ocurrió un error al iniciar sesión con Google.',
    );
  }
}