import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

export default function AddExpenseScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth } = useMonthlyBudget(currentYear, currentMonth);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('basic_needs');
  const [loading, setLoading] = useState(false);

  const blocks = [
    { key: 'basic_needs', label: 'Necesidades Básicas' },
    { key: 'personal_needs', label: 'Necesidades Personales' },
    { key: 'luxuries', label: 'Lujos' },
    { key: 'savings', label: 'Ahorro' },
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

    // 1. Obtener el usuario autenticado actual para satisfacer el RLS de Supabase
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      Alert.alert('Error de Sesión', 'No se pudo identificar al usuario autenticado.');
      return;
    }

    // 2. Insertar enviando explícitamente el user_id y la nota
    const { error } = await supabase.from('expenses').insert({
      user_id: user.id, // <-- Crítico para superar el RLS
      month_id: activeMonth.id,
      block: selectedBlock,
      note: note.trim(),
      amount: numericAmount,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error al registrar gasto', error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ['budget_details'] });
      Alert.alert('Éxito', 'Gasto registrado correctamente.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12">
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