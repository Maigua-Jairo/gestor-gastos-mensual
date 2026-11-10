import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAnimationFeedback } from '../../provider/AnimationFeedbackProvider';
import { BackButton } from '../../components/BackButton';

export default function AddExpenseScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth, isLoading: isLoadingBudget } = useMonthlyBudget(currentYear, currentMonth);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showAnimation } = useAnimationFeedback();

  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('basic_needs');
  const [loading, setLoading] = useState(false);

  const blocks = [
    { key: 'basic_needs', label: 'Necesidades Básicas' },
    { key: 'personal_needs', label: 'Necesidades Personales' },
    { key: 'luxuries', label: 'Lujos' },
  ];

  const handleAddExpense = async () => {
    if (!activeMonth) {
      Alert.alert('Error', 'No hay un mes activo configurado.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (!note.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Ingresa una descripción válida y un monto mayor a 0.');
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No se pudo identificar al usuario autenticado.');

      const { error } = await supabase.from('expenses').insert({
        user_id: user.id,
        month_id: activeMonth.id,
        block: selectedBlock,
        note: note.trim(),
        amount: numericAmount,
      });
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['budget_details'] });
      showAnimation('success', 'Gasto registrado correctamente.');
      router.back();
    } catch (error) {
      Alert.alert(
        'Error al registrar gasto',
        error instanceof Error ? error.message : 'No se pudo registrar el gasto.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingBudget) {
    return (
      <View className="flex-1 items-center justify-center bg-stone-950">
        <ActivityIndicator size="large" color="#fbbf24" />
        <Text className="mt-2 text-sm text-stone-400">Cargando el presupuesto...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12">
      <BackButton />
      <Text className="text-2xl font-bold text-amber-400 mb-1">Registrar Gasto</Text>
      <Text className="text-sm text-stone-400 mb-6">Asigna el consumo a uno de tus bloques presupuestarios.</Text>

      {/* Selector de Bloques */}
      <Text className="text-stone-300 font-semibold mb-2 text-sm">Seleccionar Bloque</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {blocks.map((b) => (
          <TouchableOpacity
            key={b.key}
            onPress={() => setSelectedBlock(b.key)}
            className={`py-2 px-4 rounded-xl border ${selectedBlock === b.key ? 'bg-amber-500 border-amber-500' : 'bg-stone-900 border-stone-800'}`}
          >
            <Text className={`text-xs font-bold ${selectedBlock === b.key ? 'text-stone-950' : 'text-stone-300'}`}>
              {b.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input de Descripción / Nota */}
      <View className="mb-6">
        <Text className="text-stone-300 text-sm mb-1">Descripción del Gasto</Text>
        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
          placeholder="Ej. Almuerzo universitario, pasajes..."
          placeholderTextColor="#78716c"
          value={note}
          onChangeText={setNote}
        />
      </View>

      {/* Input de Monto */}
      <View className="mb-8">
        <Text className="text-stone-300 text-sm mb-1">Monto (USD)</Text>
        <TextInput
          className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl text-lg font-bold"
          placeholder="0.00"
          placeholderTextColor="#78716c"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <TouchableOpacity
        onPress={handleAddExpense}
        disabled={loading}
        className="bg-amber-500 py-4 rounded-xl items-center shadow-lg"
      >
        {loading ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text className="text-stone-950 font-bold text-base">Guardar Gasto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}