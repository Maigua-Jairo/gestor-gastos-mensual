import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Link } from 'expo-router';
import { completeGoogleOAuth } from '../../../lib/auth';

export default function AuthCallbackScreen() {
  const url = Linking.useLinkingURL();
  const [result, setResult] = useState<{ url: string; error: string | null } | null>(null);

  useEffect(() => {
    if (!url) return;

    let isActive = true;

    completeGoogleOAuth(url)
      .then(() => {
        if (isActive) setResult({ url, error: null });
      })
      .catch((cause: unknown) => {
        if (isActive) {
          setResult({
            url,
            error: cause instanceof Error
              ? cause.message
              : 'No se pudo completar el inicio de sesión con Google.',
          });
        }
      });

    return () => {
      isActive = false;
    };
  }, [url]);

  const error = !url
    ? 'No se recibió la respuesta de Google.'
    : result?.url === url
      ? result.error
      : null;
  const isProcessing = Boolean(url) && result?.url !== url;

  return (
    <View className="flex-1 items-center justify-center bg-stone-950 px-6">
      {isProcessing ? (
        <>
          <ActivityIndicator size="large" color="#fbbf24" />
          <Text className="mt-4 text-center text-stone-200">
            Finalizando el inicio de sesión con Google...
          </Text>
        </>
      ) : (
        <>
          <Text className="text-center text-stone-200">
            {error || 'Inicio de sesión completado. Redirigiendo...'}
          </Text>
          {error && (
            <Link href="/(auth)/login" className="mt-6 text-amber-400">
              Volver al inicio de sesión
            </Link>
          )}
        </>
      )}
    </View>
  );
}
