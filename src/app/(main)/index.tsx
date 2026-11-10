import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter, Link } from 'expo-router';
import { FeedbackAnimation } from '../../components/FeedbackAnimation';
import { LoadingState, useLoadingAnimation } from '../../components/LoadingState';
import { useAnimationFeedback } from '../../provider/AnimationFeedbackProvider';
import { formatMonthLabel } from '../../lib/date-format';
import { BackButton } from '../../components/BackButton';
export default function DashboardScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const previousDate = new Date(currentYear, currentMonth - 2, 1);

  const {
    activeMonth,
    budgetData,
    previousBudgetData,
    previousBudgetError,
    isLoading,
    setupMonth,
    isSettingUp,
  } = useMonthlyBudget(currentYear, currentMonth);
  const { showLoading, onLoadingStarted, onAnimationLoaded } = useLoadingAnimation(isLoading);
  const router = useRouter();
  const { showAnimation } = useAnimationFeedback();
  const [monthChoiceDismissed, setMonthChoiceDismissed] = useState(false);
  const [isCopyingPrevious, setIsCopyingPrevious] = useState(false);
  const monthLabel = formatMonthLabel(currentYear, currentMonth);
  const showPreviousMonthPrompt =
    Boolean(previousBudgetData) && !activeMonth && !monthChoiceDismissed;

  const handleKeepPreviousBudget = async () => {
    if (!previousBudgetData) return;

    setIsCopyingPrevious(true);
    try {
      const previousAllocations = new Map(
        previousBudgetData.budgets.map((budget) => [budget.block, Number(budget.allocated_amount)]),
      );
      await setupMonth({
        totalIncome: previousBudgetData.income,
        allocations: [
          { block: 'basic_needs', amount: previousAllocations.get('basic_needs') ?? 0 },
          { block: 'personal_needs', amount: previousAllocations.get('personal_needs') ?? 0 },
          { block: 'luxuries', amount: previousAllocations.get('luxuries') ?? 0 },
        ],
      });
      setMonthChoiceDismissed(true);
      showAnimation(
        'success',
        `Se reutilizó el presupuesto de ${formatMonthLabel(previousDate.getFullYear(), previousDate.getMonth() + 1)}.`,
      );
    } catch (error) {
      Alert.alert(
        'No se pudo reutilizar el presupuesto',
        error instanceof Error ? error.message : 'Inténtalo de nuevo.',
      );
    } finally {
      setIsCopyingPrevious(false);
    }
  };

  if (showLoading) {
    return (
      <LoadingState
        screenKey="dashboard"
        message="Cargando tu presupuesto..."
        onLoadingStarted={onLoadingStarted}
        onAnimationLoaded={onAnimationLoaded}
      />
    );
  }

  // Si el mes no ha sido configurado, mostrar opción para ir al setup
  if (!activeMonth || !budgetData || budgetData.income === 0) {
    return (
      <View className="flex-1 bg-stone-950 justify-center items-center px-6">
        <Modal
          visible={showPreviousMonthPrompt}
          transparent
          animationType="fade"
          onRequestClose={() => setMonthChoiceDismissed(true)}
        >
          <View className="flex-1 items-center justify-center bg-black/70 px-6">
            <View className="w-full max-w-sm rounded-3xl border border-stone-800 bg-stone-900 p-6">
              <Text className="text-xl font-bold text-stone-100">
                ¡Comienza {monthLabel}!
              </Text>
              <Text className="mt-2 text-sm leading-6 text-stone-400">
                ¿Quieres registrar un presupuesto nuevo o mantener el del mes pasado? Solo se copiarán tus ingresos y bloques, no los gastos.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={handleKeepPreviousBudget}
                disabled={isCopyingPrevious || isSettingUp}
                className="mt-5 min-h-12 items-center justify-center rounded-xl bg-amber-400 px-4 py-3"
              >
                {isCopyingPrevious || isSettingUp ? (
                  <ActivityIndicator color="#0c0a09" />
                ) : (
                  <Text className="text-center font-bold text-stone-950">
                    Mantener presupuesto anterior
                  </Text>
                )}
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setMonthChoiceDismissed(true);
                  router.push('/setup-month');
                }}
                disabled={isCopyingPrevious}
                className="mt-2 min-h-12 items-center justify-center rounded-xl border border-stone-700 px-4 py-3"
              >
                <Text className="text-center font-semibold text-stone-200">
                  Registrar datos nuevos
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => setMonthChoiceDismissed(true)}
                className="mt-2 min-h-10 items-center justify-center"
              >
                <Text className="text-sm text-stone-500">Decidir más tarde</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <FeedbackAnimation name="empty" size={220} />
        <Text className="text-2xl font-bold text-amber-400 mb-2 text-center">Sin Presupuesto Activo</Text>
        <Text className="text-stone-400 text-center mb-6">
          Aún no has configurado los ingresos y bloques para {monthLabel}.
        </Text>
        {previousBudgetError ? (
          <Text className="mb-4 text-center text-sm text-rose-300">
            No se pudo consultar el presupuesto anterior. Puedes configurar uno nuevo.
          </Text>
        ) : null}
        <TouchableOpacity
          onPress={() => {
            if (previousBudgetData) setMonthChoiceDismissed(false);
            else router.push('/setup-month');
          }}
          className="bg-amber-500 py-3.5 px-6 rounded-xl shadow-lg"
        >
          <Text className="text-stone-950 font-bold text-base">
            {previousBudgetData ? 'Elegir presupuesto' : `Configurar ${monthLabel}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { income, budgets, expenses } = budgetData;

  // Calcular el total gastado por bloque sumando los gastos asociados
  const blockTotals: Record<string, number> = {};
  expenses.forEach((exp: any) => {
    blockTotals[exp.block] = (blockTotals[exp.block] || 0) + Number(exp.amount);
  });

  const totalSpent = Object.values(blockTotals).reduce((acc, val) => acc + val, 0);
  const totalAllocated = budgets.reduce((acc: number, b: any) => acc + Number(b.allocated_amount), 0);
  const unallocatedMoney = income - totalAllocated;

  const blockLabels: Record<string, string> = {
    basic_needs: 'Necesidades Básicas',
    personal_needs: 'Necesidades Personales',
    luxuries: 'Lujos',
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12 pb-10">
      <BackButton />
      {/* Cabecera con enlace al Perfil */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Presupuesto mensual
          </Text>
          <Text className="text-2xl font-bold text-amber-400">{monthLabel}</Text>
        </View>
        <Link href="/profile" className="bg-stone-900 border border-stone-800 px-4 py-2 rounded-xl">
          <Text className="text-stone-200 text-xs font-semibold">Perfil</Text>
        </Link>
      </View>

      {/* Tarjeta de Resumen Financiero */}
      <View className="bg-stone-900 border border-stone-800 p-5 rounded-2xl mb-6 shadow-md">
        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-stone-400 text-xs">Ingreso Total</Text>
            <Text className="text-lg font-bold text-stone-100">${Number(income).toFixed(2)}</Text>
          </View>
          <View>
            <Text className="text-stone-400 text-xs">Gasto Total</Text>
            <Text className="text-lg font-bold text-rose-400">${totalSpent.toFixed(2)}</Text>
          </View>
        </View>
        <View className="border-t border-stone-800 pt-3 flex-row justify-between items-center">
          <Text className="text-stone-400 text-xs">Dinero No Asignado:</Text>
          <Text className="text-amber-400 font-bold">${unallocatedMoney.toFixed(2)}</Text>
        </View>
      </View>

      {/* Barra de Acciones Principales */}
      <View className="flex-row gap-3 mb-3">
        <TouchableOpacity
          onPress={() => router.push('/setup-month')}
          className="flex-1 bg-stone-900 border border-stone-800 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-300 font-semibold text-sm">Editar Presupuesto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => router.push('/add-expense')}
          className="flex-1 bg-amber-500 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-950 font-bold text-sm">+ Nuevo Gasto</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de Navegación Secundaria (Ahorros e Historial) */}
      <View className="flex-row gap-3 mb-8">
        <TouchableOpacity
          onPress={() => router.push('/savings')}
          className="flex-1 bg-stone-900 border border-stone-800 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-300 font-semibold text-sm">Ahorros 💰</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/expenses')}
          className="flex-1 bg-stone-900 border border-stone-800 py-3 rounded-xl items-center"
        >
          <Text className="text-stone-300 font-semibold text-sm">Historial 📋</Text>
        </TouchableOpacity>
      </View>

      {/* Listado de Bloques de Presupuesto */}
      <Text className="text-lg font-bold text-stone-200 mb-4">Bloques del Mes</Text>
      <View className="space-y-4 mb-8">
        {budgets.map((b: any) => {
          const spent = blockTotals[b.block] || 0;
          const allocated = Number(b.allocated_amount);
          const percentage = allocated > 0 ? Math.min((spent / allocated) * 100, 100) : 0;
          const isOverBudget = spent > allocated;

          return (
            <View key={b.id} className="bg-stone-900 border border-stone-800 p-4 rounded-2xl mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-stone-200 font-bold text-base">{blockLabels[b.block] || b.block}</Text>
                <Text className="text-xs text-stone-400">
                  <Text className={isOverBudget ? 'text-rose-400 font-bold' : 'text-stone-200'}>${spent.toFixed(2)}</Text> / ${allocated.toFixed(2)}
                </Text>
              </View>

              {/* Barra de Progreso */}
              <View className="w-full bg-stone-950 h-2 rounded-full overflow-hidden">
                <View
                  style={{ width: `${percentage}%` }}
                  className={`h-full ${isOverBudget ? 'bg-rose-500' : 'bg-amber-400'}`}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}