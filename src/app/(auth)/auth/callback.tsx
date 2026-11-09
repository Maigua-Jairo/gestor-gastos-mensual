import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { Link, useRouter } from 'expo-router';
import { createSessionFromUrl } from '../../../lib/auth';

export default function AuthCallbackScreen() {
  const url = Linking.useLinkingURL();
  const router = useRouter();
  const [result, setResult] = useState<{ url: string; error: string | null } | null>(null);

  useEffect(() => {
    if (!url) return;

    let active = true;
    createSessionFromUrl(url)
      .then(() => {
        if (active) router.replace('/');
      })
      .catch((cause: unknown) => {
        if (active) {
          setResult({
            url,
            error: cause instanceof Error
              ? cause.message
              : 'No se pudo completar el inicio de sesión con Google.',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [router, url]);

  const error = result?.url === url ? result.error : null;
  const isProcessing = Boolean(url) && result?.url !== url;

  return (
    <View className="flex-1 items-center justify-center bg-stone-950 px-6">
      {isProcessing || !url ? (
        <>
          <ActivityIndicator size="large" color="#fbbf24" />
          <Text className="mt-4 text-center text-stone-200">
            Esperando la respuesta de Google...
          </Text>
        </>
      ) : error ? (
        <>
          <Text className="text-center text-stone-200">{error}</Text>
          <Link href="/(auth)/login" className="mt-6 text-amber-400">
            Volver al inicio de sesión
          </Link>
        </>
      ) : (
        <Text className="text-center text-stone-200">
          Inicio de sesión completado. Redirigiendo...
        </Text>
      )}
    </View>
  );
}
