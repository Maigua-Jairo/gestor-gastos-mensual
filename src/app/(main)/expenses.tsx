import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

export default function ExpensesScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth, budgetData, isLoading } = useMonthlyBudget(currentYear, currentMonth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const blockLabels: Record<string, string> = {
    basic_needs: 'Necesidades Básicas',
    personal_needs: 'Necesidades Personales',
    luxuries: 'Lujos',
    savings: 'Ahorro',
  };

  const blockColors: Record<string, string> = {
    basic_needs: 'text-amber-400',
    personal_needs: 'text-sky-400',
    luxuries: 'text-purple-400',
    savings: 'text-emerald-400',
  };

  const handleDeleteExpense = (expenseId: string, expenseNote: string) => {
    Alert.alert(
      'Eliminar Gasto',
      `¿Estás seguro de que deseas eliminar "${expenseNote}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(expenseId);
            const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
            setDeletingId(null);

            if (error) {
              Alert.alert('Error', 'No se pudo eliminar el gasto: ' + error.message);
            } else {
              // Invalidar caché para refrescar totales en el dashboard y listado
              queryClient.invalidateQueries({ queryKey: ['budget_details'] });
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-stone-950 justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  const expenses = budgetData?.expenses || [];

  return (
    <View className="flex-1 bg-stone-950 px-6 pt-12">
      {/* Cabecera */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-2xl font-bold text-amber-400">Historial de Gastos</Text>
          <Text className="text-sm text-stone-400">Transacciones del mes en curso</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl"
        >
          <Text className="text-stone-200 text-xs font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Listado de Gastos */}
      {expenses.length === 0 ? (
        <View className="flex-1 justify-center items-center pb-20">
          <Text className="text-stone-400 text-center text-base mb-2">No hay gastos registrados este mes.</Text>
          <Text className="text-stone-600 text-center text-xs">Usa el botón "+ Nuevo Gasto" desde el dashboard para empezar.</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => {
            const isDeleting = deletingId === item.id;
            return (
              <View className="bg-stone-900 border border-stone-800 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
                <View className="flex-1 mr-4">
                  <Text className="text-stone-100 font-bold text-base mb-0.5">{item.note}</Text>
                  <View className="flex-row items-center gap-2">
                    <Text className={`text-xs font-semibold ${blockColors[item.block] || 'text-stone-400'}`}>
                      {blockLabels[item.block] || item.block}
                    </Text>
                    <Text className="text-stone-600 text-xs">•</Text>
                    <Text className="text-stone-500 text-xs">{item.expense_date}</Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-rose-400 font-bold text-base mb-1">-${Number(item.amount).toFixed(2)}</Text>
                  <TouchableOpacity
                    onPress={() => handleDeleteExpense(item.id, item.note)}
                    disabled={isDeleting}
                    className="bg-stone-950 border border-stone-800 px-2.5 py-1 rounded-lg"
                  >
                    {isDeleting ? (
                      <ActivityIndicator size="small" color="#f43f5e" />
                    ) : (
                      <Text className="text-rose-500 text-xs font-semibold">Eliminar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}