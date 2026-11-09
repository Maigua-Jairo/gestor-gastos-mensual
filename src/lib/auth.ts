import { Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';

const redirectTo = Linking.createURL('auth/callback');
export async function completeGoogleOAuth(url: string): Promise<void> {
  const { params, errorCode } = QueryParams.getQueryParams(url);
  const oauthError = params.error_description || params.error || errorCode;

  if (oauthError) {
    throw new Error(oauthError);
  }

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) throw error;
    return;
  }

  if (params.access_token && params.refresh_token) {
    const { error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (error) throw error;
    return;
  }

  throw new Error('Google no devolvió los datos necesarios para iniciar sesión.');
}

export async function signInWithGoogle(): Promise<void> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== 'web',
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    if (!data.url) {
      throw new Error('No se pudo generar la URL de Google.');
    }

    if (Platform.OS === 'web') {
      return;
    }

    await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  } catch (error: unknown) {
    const message = error instanceof Error
      ? error.message
      : 'Ocurrió un error al iniciar sesión con Google.';
    Alert.alert('Error de Autenticación', message);
  }
}
