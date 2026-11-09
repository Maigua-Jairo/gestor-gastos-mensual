import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link } from 'expo-router';
import { signInWithGoogle } from '../../lib/auth';
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // 1. Login con Correo y Contraseña
  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Error de Autenticación', error.message);
  };

const handleGoogleLogin = async () => {
  setGoogleLoading(true);
  try {
    await signInWithGoogle();
  } catch (e) {
    Alert.alert(
      'Error con Google',
      e instanceof Error ? e.message : 'Intenta de nuevo.'
    );
  } finally {
    setGoogleLoading(false);
  }
};
  return (
    <View className="flex-1 justify-center bg-stone-950 px-6">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-amber-400">Control de Gastos</Text>
        <Text className="text-sm text-stone-400 mt-1">Inicia sesión para gestionar tus bloques del mes</Text>
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

        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-6"
          placeholder="Contraseña"
          placeholderTextColor="#78716c"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleEmailLogin}
          disabled={loading}
          className="bg-amber-500 py-3.5 rounded-xl items-center shadow-lg active:bg-amber-600 mb-4"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-stone-950 font-bold text-base">Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          disabled={googleLoading}
          className="bg-stone-900 border border-stone-800 py-3.5 rounded-xl items-center flex-row justify-center gap-3"
        >
          {googleLoading ? (
            <ActivityIndicator color="#e7e5e4" />
          ) : (
            <Text className="text-stone-200 font-bold text-sm">Continuar con Google</Text>
          )}
        </TouchableOpacity>

        <Link href="./forgot-password" className="text-center text-amber-400">
          ¿Olvidaste tu contraseña?
        </Link>

        <Link href="/(auth)/register" className="text-center text-stone-400">
          ¿No tienes cuenta? <Text className="text-amber-400 font-bold">Regístrate aquí</Text>
        </Link>
      </View>
    </View>
  );
}