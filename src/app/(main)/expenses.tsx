import React, { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FeedbackAnimation } from '../../components/FeedbackAnimation';
import { LoadingState } from '../../components/LoadingState';
import { useAnimationFeedback } from '../../provider/AnimationFeedbackProvider';
import { formatDateLabel, formatMonthLabel } from '../../lib/date-format';
import { BackButton } from '../../components/BackButton';

export default function ExpensesScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth, budgetData, isLoading } = useMonthlyBudget(currentYear, currentMonth);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAnimation } = useAnimationFeedback();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const blockLabels: Record<string, string> = {
    basic_needs: 'Necesidades Básicas',
    personal_needs: 'Necesidades Personales',
    luxuries: 'Lujos',
    savings: 'Ahorro',
  };

  // Función para eliminar un gasto
  const handleDeleteExpense = async (expenseId: string) => {
    Alert.alert(
      'Eliminar Gasto',
      '¿Estás seguro de que deseas eliminar este registro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(expenseId);
            try {
              const { error } = await supabase
                .from('expenses')
                .delete()
                .eq('id', expenseId);

              if (error) throw error;

              // Invalidar la caché para refrescar los montos y la lista automáticamente
              queryClient.invalidateQueries({ queryKey: ['budget_details'] });
              showAnimation('success', 'Gasto eliminado correctamente.');
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'No se pudo eliminar el gasto.'
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingState screenKey="expenses" message="Cargando tus gastos..." />;
  }

  // Extraer los gastos del presupuesto actual (asumiendo que budgetData incluye la relación o lista de expenses)
  const expenses = budgetData?.expenses || [];

  return (
    <View className="flex-1 bg-stone-950 px-6 pt-8">
      <BackButton />
      {/* Cabecera y Botón de Agregar */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-2xl font-bold text-amber-400">Gastos del Mes</Text>
          <Text className="mt-1 text-sm font-medium text-stone-300">
            {activeMonth ? formatMonthLabel(activeMonth.year, activeMonth.month) : 'Sin mes activo'}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/(main)/add-expense')}
          className="bg-amber-500 px-4 py-2.5 rounded-xl flex-row items-center gap-2 shadow-lg"
        >
          <Ionicons name="add" size={20} color="#0f172a" />
          <Text className="text-stone-950 font-bold text-sm">Nuevo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Gastos */}
      {expenses.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-20">
          <FeedbackAnimation name="empty" size={220} />
          <Text className="text-stone-400 text-base mt-4 text-center">
            No tienes gastos registrados este mes.
          </Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View className="bg-stone-900 border border-stone-800 p-4 rounded-xl mb-3 flex-row items-center justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-stone-100 font-bold text-base" numberOfLines={1}>
                  {item.note || 'Sin descripción'}
                </Text>
                <View className="flex-row items-center gap-2 mt-1">
                  <View className="bg-stone-800 px-2 py-0.5 rounded-md">
                    <Text className="text-amber-400 text-xs font-medium">
                      {blockLabels[item.block] || item.block}
                    </Text>
                  </View>
                  <View className="flex-row items-center rounded-full bg-stone-800 px-2 py-1">
                    <Ionicons name="calendar-outline" size={12} color="#a8a29e" />
                    <Text className="ml-1 text-xs font-medium text-stone-300">
                      {formatDateLabel(item.expense_date || item.created_at)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className=" flex-row gap-3 items-center">
                <Text className="text-stone-100 font-bold text-base">
                  ${Number(item.amount).toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleDeleteExpense(item.id)}
                  disabled={deletingId === item.id}
                  className="p-2 bg-stone-800/60 rounded-lg"
                >
                  {deletingId === item.id ? (
                    <ActivityIndicator size="small" color="#ef4444" />
                  ) : (
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}