import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Modal, FlatList } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FeedbackAnimation } from '../../components/FeedbackAnimation';
import { LoadingState } from '../../components/LoadingState';
import { useAnimationFeedback } from '../../provider/AnimationFeedbackProvider';
import { formatDateLabel } from '../../lib/date-format';
import { BackButton } from '../../components/BackButton';

export default function SavingsScreen() {
  const queryClient = useQueryClient();
  const { showAnimation } = useAnimationFeedback();

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [movementType, setMovementType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [loading, setLoading] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);

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

  if (isLoading) {
    return <LoadingState screenKey="savings" message="Cargando tus ahorros..." />;
  }

  const handleSaveMovement = async () => {
    const numericAmount = parseFloat(amount);
    const savedMovementType = movementType;
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Ingresa un monto válido mayor a 0.');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No se pudo identificar al usuario.');

      const { error } = await supabase.from('savings_movements').insert({
        user_id: user.id,
        type: savedMovementType,
        amount: numericAmount,
        note: note.trim() || (savedMovementType === 'deposit' ? 'Depósito a ahorros' : 'Retiro de emergencia'),
      });
      if (error) throw error;

      setAmount('');
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['savings_movements'] });
      showAnimation(
        savedMovementType === 'deposit' ? 'deposit' : 'withdrawal',
        savedMovementType === 'deposit' ? 'Depósito agregado a tus ahorros.' : 'Retiro de ahorro registrado.',
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'No se pudo registrar el movimiento.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-8 pb-10">
      <BackButton />
      {/* Cabecera */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-amber-400">Fondo de Ahorro</Text>
          <Text className="text-sm text-stone-400">Controla tus depósitos y retiros</Text>
        </View>
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
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl border items-center ${movementType === 'deposit' ? 'bg-emerald-500 border-emerald-500' : 'bg-stone-950 border-stone-800'}`}
          >
            <Text className={`text-xs font-bold ${movementType === 'deposit' ? 'text-stone-950' : 'text-stone-300'}`}>
              Depósito 📥
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMovementType('withdrawal')}
            disabled={loading}
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

        <TouchableOpacity
          accessibilityRole="button"
          onPress={() => setHistoryVisible(true)}
          className="mt-3 min-h-12 flex-row items-center justify-center rounded-xl border border-stone-700 bg-stone-950 px-4 py-3"
        >
          <Text className="text-sm font-semibold text-amber-400">Ver historial de ahorros</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={historyVisible}
        animationType="slide"
        onRequestClose={() => setHistoryVisible(false)}
      >
        <View className="flex-1 bg-stone-950 px-5 pt-12">
          <View className="mb-5 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-amber-400">Historial de Ahorros</Text>
              <Text className="mt-1 text-sm text-stone-400">
                {savingsData.length} {savingsData.length === 1 ? 'movimiento' : 'movimientos'}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Cerrar historial"
              onPress={() => setHistoryVisible(false)}
              className="min-h-11 justify-center rounded-xl border border-stone-700 bg-stone-900 px-4"
            >
              <Text className="text-sm font-semibold text-stone-200">Regresar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={savingsData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 24,
              ...(savingsData.length === 0 ? { justifyContent: 'center' as const } : {}),
            }}
            ListEmptyComponent={
              <View className="items-center">
                <FeedbackAnimation name="empty" size={200} />
                <Text className="mt-2 text-center text-sm text-stone-400">
                  Todavía no hay movimientos de ahorro.
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              const isDeposit = item.type === 'deposit';
              return (
                <View className="mb-3 flex-row items-center justify-between rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <View className="mr-3 flex-1">
                    <Text className="mb-1 text-sm font-bold text-stone-100" numberOfLines={2}>
                      {item.note || (isDeposit ? 'Depósito a ahorros' : 'Retiro de ahorros')}
                    </Text>
                    <View className="mt-1 self-start rounded-full bg-stone-800 px-2 py-1">
                      <Text className="text-xs font-medium text-stone-300">
                        {formatDateLabel(item.created_at)}
                      </Text>
                    </View>
                  </View>
                  <Text className={`font-bold ${isDeposit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isDeposit ? '+' : '-'}${Number(item.amount).toFixed(2)}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}