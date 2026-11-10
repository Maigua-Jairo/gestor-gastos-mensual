import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PasswordInput } from '../../components/PasswordInput';
import { FeedbackAnimation } from '../../components/FeedbackAnimation';
import { BackButton } from '../../components/BackButton';
import { signInWithGoogle } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export default function LoginScreen() {
  const { height } = useWindowDimensions();
  const isCompact = height < 780;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || !password) {
      Alert.alert('Datos incompletos', 'Ingresa tu correo y contraseña para continuar.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      if (error) throw error;
    } catch (error) {
      Alert.alert(
        'No se pudo iniciar sesión',
        error instanceof Error ? error.message : 'Comprueba tus datos e inténtalo de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert(
        'Error con Google',
        error instanceof Error ? error.message : 'Intenta de nuevo.',
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-stone-950"
      contentContainerClassName={`flex-grow justify-center px-5 ${isCompact ? 'py-3' : 'py-6'}`}
      keyboardShouldPersistTaps="handled"
    >
      <View className="w-full max-w-md self-center">
        <BackButton />
        <View className={`items-center ${isCompact ? 'mb-3' : 'mb-5'}`}>
          <FeedbackAnimation name="budget" size={isCompact ? 68 : 84} loop={false} />
          <Text className={`font-semibold uppercase tracking-[3px] text-amber-400 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
            Control de Gastos
          </Text>
          <Text className={`text-center font-bold text-stone-50 ${isCompact ? 'mt-1 text-2xl' : 'mt-2 text-3xl'}`}>
            Qué bueno verte
          </Text>
          <Text className={`text-center text-stone-400 ${isCompact ? 'mt-1 text-xs leading-5' : 'mt-1 text-sm leading-6'}`}>
            Inicia sesión y sigue al tanto de tu presupuesto mensual.
          </Text>
        </View>

        <View className={`rounded-3xl border border-stone-800 bg-stone-900/80 shadow-xl shadow-black/20 ${isCompact ? 'p-4' : 'p-5'}`}>
          <Text className="mb-1 text-lg font-bold text-stone-100">Iniciar sesión</Text>
          <Text className={`text-sm text-stone-400 ${isCompact ? 'mb-3' : 'mb-4'}`}>
            Usa el correo asociado a tu cuenta.
          </Text>

          <View className={isCompact ? 'mb-3' : 'mb-4'}>
            <Text className="mb-1 text-sm font-medium text-stone-300">Correo electrónico</Text>
            <TextInput
              className={`rounded-xl border border-stone-700 bg-stone-950 px-4 text-base text-stone-100 ${isCompact ? 'min-h-11 py-2' : 'min-h-12 py-3'}`}
              placeholder="nombre@correo.com"
              placeholderTextColor="#78716c"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
            />
          </View>

          <View className={isCompact ? 'mb-2' : 'mb-3'}>
            <Text className="mb-1 text-sm font-medium text-stone-300">Contraseña</Text>
            <PasswordInput
              containerClassName={`rounded-xl border border-stone-700 bg-stone-950 px-4 ${isCompact ? 'min-h-11' : 'min-h-12'}`}
              className={`text-base text-stone-100 ${isCompact ? 'py-2' : 'py-3'}`}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#78716c"
              value={password}
              onChangeText={setPassword}
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={handleEmailLogin}
            />
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleEmailLogin}
            disabled={loading || googleLoading}
            className={`items-center justify-center rounded-xl bg-amber-400 px-5 active:bg-amber-300 ${isCompact ? 'min-h-11 py-2' : 'min-h-12 py-3'}`}
          >
            {loading ? (
              <ActivityIndicator color="#0c0a09" />
            ) : (
              <Text className="text-base font-bold text-stone-950">Iniciar sesión</Text>
            )}
          </TouchableOpacity>

          <Link
            href="./forgot-password"
            className={`self-end px-1 text-sm font-semibold text-amber-400 ${isCompact ? 'py-1.5' : 'py-2'}`}
          >
            ¿Olvidaste tu contraseña?
          </Link>

          <View className={`flex-row items-center ${isCompact ? 'my-2' : 'my-3'}`}>
            <View className="h-px flex-1 bg-stone-800" />
            <Text className="px-3 text-xs text-stone-500">o continúa con</Text>
            <View className="h-px flex-1 bg-stone-800" />
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleGoogleLogin}
            disabled={googleLoading || loading}
            className={`flex-row items-center justify-center gap-3 rounded-xl border border-stone-700 bg-stone-950 px-5 active:bg-stone-800 ${isCompact ? 'min-h-11 py-2' : 'min-h-12 py-3'}`}
          >
            {googleLoading ? (
              <ActivityIndicator color="#e7e5e4" />
            ) : (
              <>
                <Ionicons name="logo-google" size={19} color="#e7e5e4" />
                <Text className="text-sm font-semibold text-stone-100">Continuar con Google</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View className={`flex-row flex-wrap items-center justify-center ${isCompact ? 'mt-2' : 'mt-4'}`}>
          <Text className="text-sm text-stone-400">¿No tienes cuenta? </Text>
          <Link href="/(auth)/register" className="py-2 text-sm font-bold text-amber-400">
            Regístrate
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
