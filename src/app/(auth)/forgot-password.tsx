import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Link } from 'expo-router';
import { getAuthRedirectUrl } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetRequest = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      Alert.alert('Correo no válido', 'Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: getAuthRedirectUrl('/reset-password'),
      });

      if (error) throw error;
      setEmailSent(true);
    } catch (error) {
      Alert.alert(
        'No se pudo enviar el enlace',
        error instanceof Error ? error.message : 'Comprueba tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-stone-950 px-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-amber-400">Recuperar contraseña</Text>
        <Text className="mt-2 text-sm text-stone-400">
          {emailSent
            ? 'Si existe una cuenta con ese correo, recibirás un enlace para crear una nueva contraseña.'
            : 'Ingresa el correo de tu cuenta y te enviaremos un enlace seguro.'}
        </Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="mb-4 rounded-xl border border-stone-800 bg-stone-900 px-4 py-3 text-stone-100"
          placeholder="Correo electrónico"
          placeholderTextColor="#78716c"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setEmailSent(false);
          }}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
        />

        <TouchableOpacity
          onPress={handleResetRequest}
          disabled={loading}
          className="mb-4 items-center rounded-xl bg-amber-500 py-3.5 shadow-lg active:bg-amber-600"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-base font-bold text-stone-950">
              {emailSent ? 'Enviar otro enlace' : 'Enviar enlace de recuperación'}
            </Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" className="text-center text-stone-400">
          Volver a <Text className="font-bold text-amber-400">iniciar sesión</Text>
        </Link>
      </View>
    </View>
  );
}
