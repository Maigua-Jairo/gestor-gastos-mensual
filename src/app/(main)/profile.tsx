import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../provider/AuthProvider';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si el usuario ingresó por proveedor externo (Google)
  const isGoogleUser = user?.app_metadata?.provider === 'google';

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
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      Alert.alert('Error al actualizar', error.message);
    } else {
      Alert.alert('¡Éxito!', 'Contraseña actualizada correctamente.');
      setNewPassword('');
    }
  };

  return (
    <View className="flex-1 bg-stone-950 px-6 pt-16">
      <View className="mb-8">
        <Text className="text-2xl font-bold text-amber-400">Perfil de Usuario</Text>
        <Text className="text-sm text-stone-400 mt-1">{user?.email}</Text>
      </View>

      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6">
        <Text className="text-stone-200 font-semibold mb-2">Método de Autenticación:</Text>
        <Text className="text-stone-400 text-sm mb-4">
          {isGoogleUser ? 'Google OAuth (Sin contraseña local)' : 'Correo y Contraseña'}
        </Text>

        {!isGoogleUser ? (
          <>
            <Text className="text-stone-300 text-sm mb-2">Cambiar Contraseña</Text>
            <TextInput
              className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl mb-4"
              placeholder="Nueva contraseña"
              placeholderTextColor="#78716c"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
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

      <TouchableOpacity
        onPress={signOut}
        className="bg-rose-500/10 border border-rose-500/30 py-3.5 rounded-xl items-center mt-auto mb-8"
      >
        <Text className="text-rose-400 font-bold text-base">Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}