import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link, useRouter } from 'expo-router';
import { getAuthRedirectUrl } from '../../lib/auth';
import { useAnimationFeedback } from '../../provider/AnimationFeedbackProvider';
import { PasswordInput } from '../../components/PasswordInput';
import { BackButton } from '../../components/BackButton';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showAnimation } = useAnimationFeedback();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor llena todos los campos.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: getAuthRedirectUrl('/confirm'),
        },
      });

      if (error) throw error;
      showAnimation(
        'success',
        'Te enviamos un enlace para confirmar tu cuenta. Revisa tu correo.',
      );
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert(
        'Error en Registro',
        error instanceof Error ? error.message : 'No se pudo crear la cuenta. Inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-stone-950 px-6">
      <BackButton fallbackHref="/(auth)/login" />
      <View className="mb-8">
        <Text className="text-3xl font-bold text-amber-400">Crear Cuenta</Text>
        <Text className="text-sm text-stone-400 mt-1">Registra tu correo institucional o personal</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-4"
          placeholder="Correo electrónico"
          placeholderTextColor="#78716c"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <PasswordInput
          containerClassName="mb-6 rounded-xl border border-stone-800 bg-stone-900 px-4"
          className="py-3 text-stone-100"
          placeholder="Contraseña (mínimo 6 caracteres)"
          placeholderTextColor="#78716c"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-amber-500 py-3.5 rounded-xl items-center shadow-lg active:bg-amber-600 mb-6"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-stone-950 font-bold text-base">Registrarse</Text>
          )}
        </TouchableOpacity>

        <Link href="/(auth)/login" className="text-center text-stone-400">
          ¿Ya tienes cuenta? <Text className="text-amber-400 font-bold">Inicia sesión</Text>
        </Link>
      </View>
    </View>
  );
}