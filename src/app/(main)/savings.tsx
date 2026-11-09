import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export default function SavingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [movementType, setMovementType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [loading, setLoading] = useState(false);

  // Consultar los movimientos de ahorro del usuario autenticado
  const { data: savingsData = [], isLoading } = useQuery({
    queryKey: ['savings_movements'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No usuario autenticado');

      const { data, error } = await supabase
        .from('savings_movements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Calcular el balance total de ahorros
  const totalSavings = savingsData.reduce((acc: number, item: any) => {
    const val = Number(item.amount);
    return item.type === 'deposit' ? acc + val : acc - val;
  }, 0);

  const handleSaveMovement = async () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a 0.');
      return;
    }

    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    const { error } = await supabase.from('savings_movements').insert({
      user_id: user.id,
      type: movementType,
      amount: numericAmount,
      note: note.trim() || (movementType === 'deposit' ? 'Depósito a ahorros' : 'Retiro de emergencia'),
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setAmount('');
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['savings_movements'] });
      Alert.alert('Éxito', 'Movimiento registrado correctamente.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12 pb-10">
      {/* Cabecera */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-amber-400">Fondo de Ahorro</Text>
          <Text className="text-sm text-stone-400">Controla tus depósitos y retiros</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl"
        >
          <Text className="text-stone-200 text-xs font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Tarjeta de Balance Total de Ahorros */}
      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6 shadow-md items-center">
        <Text className="text-stone-400 text-xs mb-1">Ahorro Acumulado Total</Text>
        <Text className={`text-3xl font-bold ${totalSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          ${totalSavings.toFixed(2)}
        </Text>
      </View>

      {/* Formulario de Nuevo Movimiento */}
      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6">
        <Text className="text-stone-200 font-bold text-base mb-4">Registrar Movimiento</Text>

        {/* Selector de Tipo (Depósito / Retiro) */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={() => setMovementType('deposit')}
            className={`flex-1 py-2.5 rounded-xl border items-center ${movementType === 'deposit' ? 'bg-emerald-500 border-emerald-500' : 'bg-stone-950 border-stone-800'}`}
          >
            <Text className={`text-xs font-bold ${movementType === 'deposit' ? 'text-stone-950' : 'text-stone-300'}`}>
              Depósito 📥
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMovementType('withdrawal')}
            className={`flex-1 py-2.5 rounded-xl border items-center ${movementType === 'withdrawal' ? 'bg-rose-500 border-rose-500' : 'bg-stone-950 border-stone-800'}`}
          >
            <Text className={`text-xs font-bold ${movementType === 'withdrawal' ? 'text-stone-950' : 'text-stone-300'}`}>
              Retiro 📤
            </Text>
          </TouchableOpacity>
        </View>

        {/* Monto */}
        <View className="mb-4">
          <Text className="text-stone-300 text-sm mb-1">Monto (USD)</Text>
          <TextInput
            className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl text-lg font-bold"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Nota opcional */}
        <View className="mb-6">
          <Text className="text-stone-300 text-sm mb-1">Motivo / Nota (Opcional)</Text>
          <TextInput
            className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="Ej. Aporte quincenal, emergencia médica..."
            placeholderTextColor="#78716c"
            value={note}
            onChangeText={setNote}
          />
        </View>

        <TouchableOpacity
          onPress={handleSaveMovement}
          disabled={loading}
          className="bg-amber-500 py-3.5 rounded-xl items-center shadow-lg"
        >
          {loading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-stone-950 font-bold text-base">Guardar Movimiento</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Historial de Movimientos de Ahorro */}
      <Text className="text-lg font-bold text-stone-200 mb-3">Historial de Ahorros</Text>
      {isLoading ? (
        <ActivityIndicator size="small" color="#fbbf24" />
      ) : savingsData.length === 0 ? (
        <Text className="text-stone-500 text-xs">No hay movimientos de ahorro registrados.</Text>
      ) : (
        savingsData.map((item: any) => {
          const isDeposit = item.type === 'deposit';
          return (
            <View key={item.id} className="bg-stone-900 border border-stone-800 p-4 rounded-xl mb-3 flex-row justify-between items-center">
              <View className="flex-1 mr-3">
                <Text className="text-stone-100 font-bold text-sm mb-0.5">{item.note}</Text>
                <Text className="text-stone-500 text-xs">{item.created_at.split('T')[0]}</Text>
              </View>
              <Text className={`font-bold text-base ${isDeposit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isDeposit ? '+' : '-'}${Number(item.amount).toFixed(2)}
              </Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}