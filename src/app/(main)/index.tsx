import React from 'react';
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter, Link } from 'expo-router';
export default function DashboardScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { activeMonth, budgetData, isLoading } = useMonthlyBudget(currentYear, currentMonth);
  const router = useRouter();

  if (isLoading) {
    return (
      <View className="flex-1 bg-stone-950 justify-center items-center">
        <ActivityIndicator size="large" color="#fbbf24" />
      </View>
    );
  }

  // Si el mes no ha sido configurado, mostrar opción para ir al setup
  if (!activeMonth || !budgetData || budgetData.income === 0) {
    return (
      <View className="flex-1 bg-stone-950 justify-center items-center px-6">
        <Text className="text-2xl font-bold text-amber-400 mb-2 text-center">Sin Presupuesto Activo</Text>
        <Text className="text-stone-400 text-center mb-6">
          Aún no has configurado los ingresos y bloques para este mes.
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/setup-month')}
          className="bg-amber-500 py-3.5 px-6 rounded-xl shadow-lg"
        >
          <Text className="text-stone-950 font-bold text-base">Configurar Mes Actual</Text>
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
    savings: 'Ahorro',
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12 pb-10">
      {/* Cabecera con enlace al Perfil */}
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-sm text-stone-400">Mes en curso ({currentMonth}/{currentYear})</Text>
          <Text className="text-2xl font-bold text-amber-400">Gestor de Gastos</Text>
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