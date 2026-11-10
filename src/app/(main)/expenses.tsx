import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FeedbackAnimation } from '../../components/FeedbackAnimation';
import { LoadingState, useLoadingAnimation } from '../../components/LoadingState';
import { useAnimationFeedback } from '../../provider/AnimationFeedbackProvider';
import { formatDateLabel, formatMonthLabel } from '../../lib/date-format';
import { BackButton } from '../../components/BackButton';

type EditableExpense = {
  id: string;
  note: string | null;
  amount: number;
  block: string;
};

export default function ExpensesScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth, budgetData, isLoading } = useMonthlyBudget(currentYear, currentMonth);
  const { showLoading, onLoadingStarted, onAnimationLoaded } = useLoadingAnimation(isLoading);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showAnimation } = useAnimationFeedback();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<EditableExpense | null>(null);
  const [editNote, setEditNote] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editBlock, setEditBlock] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const blocks = [
    { key: 'basic_needs', label: 'Necesidades Básicas' },
    { key: 'personal_needs', label: 'Necesidades Personales' },
    { key: 'luxuries', label: 'Lujos' },
  ];

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

  const openEditExpense = (expense: EditableExpense) => {
    setEditingExpense(expense);
    setEditNote(expense.note ?? '');
    setEditAmount(String(expense.amount));
    setEditBlock(expense.block);
  };

  const handleUpdateExpense = async () => {
    if (!editingExpense) return;

    const numericAmount = Number(editAmount.trim().replace(',', '.'));
    const allowedBlocks = blocks.map(({ key }) => key);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      Alert.alert('Monto no válido', 'Ingresa un monto mayor a cero.');
      return;
    }
    if (!allowedBlocks.includes(editBlock) && editBlock !== 'savings') {
      Alert.alert('Bloque no válido', 'Selecciona un bloque disponible.');
      return;
    }

    setIsSavingEdit(true);
    try {
      const { error } = await supabase
        .from('expenses')
        .update({
          note: editNote.trim() || null,
          amount: numericAmount,
          block: editBlock,
        })
        .eq('id', editingExpense.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['budget_details'] });
      setEditingExpense(null);
      showAnimation('success', 'Gasto actualizado correctamente.');
    } catch (error) {
      Alert.alert(
        'No se pudo actualizar el gasto',
        error instanceof Error ? error.message : 'Inténtalo de nuevo.',
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  if (showLoading) {
    return (
      <LoadingState
        screenKey="expenses"
        message="Cargando tus gastos..."
        onLoadingStarted={onLoadingStarted}
        onAnimationLoaded={onAnimationLoaded}
      />
    );
  }

  // Extraer los gastos del presupuesto actual (asumiendo que budgetData incluye la relación o lista de expenses)
  const expenses = budgetData?.expenses || [];

  return (
    <View className="flex-1 bg-stone-950 px-6 pt-8">
      <Modal
        visible={editingExpense !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isSavingEdit) setEditingExpense(null);
        }}
      >
        <View className="flex-1 justify-center bg-black/70 px-5 py-8">
          <View className="w-full max-w-md self-center rounded-3xl border border-stone-800 bg-stone-900 p-5">
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-stone-100">Editar gasto</Text>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Cerrar edición"
                onPress={() => setEditingExpense(null)}
                disabled={isSavingEdit}
                className="rounded-lg bg-stone-800 p-2"
              >
                <Ionicons name="close" size={20} color="#e7e5e4" />
              </TouchableOpacity>
            </View>

            <Text className="mb-2 text-sm font-medium text-stone-300">Descripción</Text>
            <TextInput
              className="mb-4 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100"
              placeholder="Descripción del gasto"
              placeholderTextColor="#78716c"
              value={editNote}
              onChangeText={setEditNote}
              editable={!isSavingEdit}
              maxLength={120}
            />

            <Text className="mb-2 text-sm font-medium text-stone-300">Monto (USD)</Text>
            <TextInput
              className="mb-4 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-lg font-bold text-stone-100"
              placeholder="0.00"
              placeholderTextColor="#78716c"
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="decimal-pad"
              editable={!isSavingEdit}
            />

            <Text className="mb-2 text-sm font-medium text-stone-300">Bloque</Text>
            <View className="mb-5 flex-row flex-wrap gap-2">
              {[
                ...(editingExpense?.block === 'savings'
                  ? [{ key: 'savings', label: blockLabels.savings }]
                  : []),
                ...blocks,
              ].map((block) => (
                <TouchableOpacity
                  key={block.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected: editBlock === block.key }}
                  onPress={() => setEditBlock(block.key)}
                  disabled={isSavingEdit}
                  className={`rounded-xl border px-3 py-2 ${
                    editBlock === block.key
                      ? 'border-amber-400 bg-amber-400'
                      : 'border-stone-700 bg-stone-950'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      editBlock === block.key ? 'text-stone-950' : 'text-stone-300'
                    }`}
                  >
                    {block.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              accessibilityRole="button"
              onPress={handleUpdateExpense}
              disabled={isSavingEdit}
              className="min-h-12 items-center justify-center rounded-xl bg-amber-400 px-4 py-3"
            >
              {isSavingEdit ? (
                <ActivityIndicator color="#0c0a09" />
              ) : (
                <Text className="font-bold text-stone-950">Guardar cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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

              <View className="flex-row items-center gap-2">
                <Text className="text-stone-100 font-bold text-base">
                  ${Number(item.amount).toFixed(2)}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Editar gasto ${item.note || ''}`}
                  onPress={() => openEditExpense(item)}
                  disabled={deletingId === item.id || isSavingEdit}
                  className="rounded-lg bg-stone-800/60 p-2"
                >
                  <Ionicons name="create-outline" size={18} color="#fbbf24" />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar gasto ${item.note || ''}`}
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