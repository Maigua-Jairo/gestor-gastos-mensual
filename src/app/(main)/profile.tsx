import React, { useState } from 'react';
import { Image, ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../provider/AuthProvider';
import { useAnimationFeedback } from '../../provider/AnimationFeedbackProvider';
import { PasswordInput } from '../../components/PasswordInput';
import { BackButton } from '../../components/BackButton';

const motivationalMessages = [
  'Cada pequeño ahorro construye grandes oportunidades.',
  'Tus metas financieras empiezan con las decisiones de hoy.',
  'La constancia convierte tus planes en logros.',
  'Organizar tu dinero es invertir en tu tranquilidad.',
  'Un paso a la vez también te lleva lejos.',
  'El progreso financiero se construye día a día.',
  'Tú decides el rumbo de tus metas.',
];

function getMetadataText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { showAnimation } = useAnimationFeedback();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const isGoogleUser = user?.app_metadata?.provider === 'google';
  const metadata = user?.user_metadata;
  const displayName =
    getMetadataText(metadata?.full_name) ||
    getMetadataText(metadata?.name) ||
    getMetadataText(metadata?.preferred_username) ||
    getMetadataText(metadata?.user_name) ||
    user?.email?.split('@')[0] ||
    'Usuario';
  const avatarUrl =
    getMetadataText(metadata?.avatar_url) ||
    getMetadataText(metadata?.picture);
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0]?.toLocaleUpperCase() ?? '')
    .join('');
  const phraseIndex =
    Array.from(displayName).reduce((sum, character) => sum + character.charCodeAt(0), 0) %
    motivationalMessages.length;

  const handleUpdatePassword = async () => {
    if (isGoogleUser) {
      Alert.alert('Acceso restringido', 'Iniciaste sesión con Google. No tienes una contraseña asociada en el sistema.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      showAnimation('success', 'Contraseña actualizada correctamente.');
      setNewPassword('');
    } catch (error) {
      Alert.alert(
        'Error al actualizar',
        error instanceof Error ? error.message : 'No se pudo actualizar la contraseña.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-stone-950"
      contentContainerClassName="px-6 pt-12 pb-10"
      keyboardShouldPersistTaps="handled"
    >
      <BackButton />
      <View className="mb-6 items-center rounded-3xl border border-amber-400/15 bg-stone-900 px-5 py-7">
        <Text className="mb-5 text-xs font-semibold uppercase tracking-[2px] text-stone-500">
          Mi perfil
        </Text>

        <View className="mb-4 h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-amber-400/60 bg-amber-400/10">
          {avatarUrl && !avatarFailed ? (
            <Image
              source={{ uri: avatarUrl }}
              onError={() => setAvatarFailed(true)}
              className="h-full w-full"
              accessibilityLabel={`Foto de perfil de ${displayName}`}
            />
          ) : (
            <Text className="text-3xl font-bold text-amber-300">{initials}</Text>
          )}
        </View>

        <Text className="text-2xl font-bold text-stone-100">{displayName}</Text>
        <Text className="mt-1 text-sm text-stone-400">{user?.email}</Text>
        <Text className="mt-5 text-center text-sm leading-6 text-amber-200">
          {motivationalMessages[phraseIndex]}
        </Text>
      </View>

      <View className="mb-6 rounded-2xl border border-stone-800 bg-stone-900 p-5">
        <Text className="mb-2 text-base font-semibold text-stone-100">Cuenta</Text>
        <Text className="mb-4 text-sm text-stone-400">
          {isGoogleUser ? 'Google OAuth' : 'Correo y contraseña'}
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={signOut}
          className="min-h-12 flex-row items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3"
        >
          <Ionicons name="log-out-outline" size={19} color="#fb7185" />
          <Text className="font-semibold text-rose-300">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6 rounded-2xl border border-stone-800 bg-stone-900 p-5">
        <Text className="mb-4 text-base font-semibold text-stone-100">
          Seguridad
        </Text>
        {!isGoogleUser ? (
          <>
            <Text className="text-stone-300 text-sm mb-2">Cambiar Contraseña</Text>
            <PasswordInput
              containerClassName="mb-4 rounded-xl border border-stone-800 bg-stone-950 px-4"
              className="py-3 text-stone-100"
              placeholder="Nueva contraseña"
              placeholderTextColor="#78716c"
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={handleUpdatePassword}
              disabled={loading}
              className="bg-amber-500 py-3 rounded-xl items-center"
            >
              {loading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text className="text-stone-950 font-bold">Actualizar Contraseña</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View className="bg-stone-950/50 p-4 rounded-xl border border-amber-500/20">
            <Text className="text-amber-400 text-xs font-semibold">
              Tu cuenta está vinculada a Google. La gestión de credenciales depende de tu proveedor externo.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}