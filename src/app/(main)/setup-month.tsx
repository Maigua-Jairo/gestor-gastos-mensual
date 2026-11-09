import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useMonthlyBudget } from '../../hooks/useMonthlyBudget';
import { useRouter } from 'expo-router';

export default function SetupMonthScreen() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1 - 12

  const { budgetData, setupMonth, isSettingUp } = useMonthlyBudget(currentYear, currentMonth);
  const router = useRouter();

  const [totalIncome, setTotalIncome] = useState('');
  const [basicNeeds, setBasicNeeds] = useState('');
  const [personalNeeds, setPersonalNeeds] = useState('');
  const [luxuries, setLuxuries] = useState('');
  const [savings, setSavings] = useState('');

  // Rellenar datos existentes si ya configuró el mes
  useEffect(() => {
    if (budgetData && budgetData.income > 0) {
      setTotalIncome(budgetData.income.toString());
      const bMap = new Map(budgetData.budgets.map((b: any) => [b.block, b.allocated_amount.toString()]));
      setBasicNeeds(bMap.get('basic_needs') || '');
      setPersonalNeeds(bMap.get('personal_needs') || '');
      setLuxuries(bMap.get('luxuries') || '');
      setSavings(bMap.get('savings') || '');
    }
  }, [budgetData]);

  // Regla de negocio: Sugerir el 15% de ahorro automáticamente al cambiar el ingreso total
  const handleIncomeChange = (text: string) => {
    setTotalIncome(text);
    const numericIncome = parseFloat(text);
    if (!isNaN(numericIncome) && numericIncome > 0) {
      const suggestedSavings = (numericIncome * 0.15).toFixed(2);
      setSavings(suggestedSavings);
    } else {
      setSavings('');
    }
  };

  // Cálculo en tiempo real del dinero no asignado
  const incomeNum = parseFloat(totalIncome) || 0;
  const basicNum = parseFloat(basicNeeds) || 0;
  const personalNum = parseFloat(personalNeeds) || 0;
  const luxuriesNum = parseFloat(luxuries) || 0;
  const savingsNum = parseFloat(savings) || 0;

  const totalAllocated = basicNum + personalNum + luxuriesNum + savingsNum;
  const unallocatedAmount = incomeNum - totalAllocated;

  const handleSave = async () => {
    if (incomeNum <= 0) {
      Alert.alert('Error', 'Ingresa un monto de ingreso mensual válido.');
      return;
    }

    if (unallocatedAmount < 0) {
      Alert.alert('Presupuesto excedido', 'La suma de los cuatro bloques supera tu ingreso total.');
      return;
    }

    try {
      await setupMonth({
        totalIncome: incomeNum,
        allocations: [
          { block: 'basic_needs', amount: basicNum },
          { block: 'personal_needs', amount: personalNum },
          { block: 'luxuries', amount: luxuriesNum },
          { block: 'savings', amount: savingsNum },
        ],
      });
      Alert.alert('¡Éxito!', 'Presupuesto mensual configurado correctamente.', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    } catch (error: any) {
      Alert.alert('Error al guardar', error.message);
    }
  };

  return (
    <ScrollView className="flex-1 bg-stone-950 px-6 pt-12">
      <Text className="text-2xl font-bold text-amber-400 mb-1">Presupuesto del Mes</Text>
      <Text className="text-sm text-stone-400 mb-6">Distribuye tus ingresos en los 4 bloques obligatorios.</Text>

      {/* Ingreso Total */}
      <View className="mb-6 bg-stone-900 border border-stone-800 p-4 rounded-2xl">
        <Text className="text-stone-300 font-semibold mb-2">Ingreso Total del Mes (USD)</Text>
        <TextInput
          className="bg-stone-950 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl text-lg font-bold"
          placeholder="0.00"
          placeholderTextColor="#78716c"
          keyboardType="numeric"
          value={totalIncome}
          onChangeText={handleIncomeChange}
        />
      </View>

      {/* Bloques de Presupuesto */}
      <View className="space-y-4 mb-6">
        <View>
          <Text className="text-stone-300 text-sm mb-1">1. Necesidades Básicas</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={basicNeeds}
            onChangeText={setBasicNeeds}
          />
        </View>

        <View>
          <Text className="text-stone-300 text-sm mb-1">2. Necesidades Personales</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={personalNeeds}
            onChangeText={setPersonalNeeds}
          />
        </View>

        <View>
          <Text className="text-stone-300 text-sm mb-1">3. Lujos</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-stone-100 px-4 py-3 rounded-xl"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={luxuries}
            onChangeText={setLuxuries}
          />
        </View>

        <View>
          <Text className="text-stone-300 text-sm mb-1">4. Ahorro (Sugerido 15%)</Text>
          <TextInput
            className="bg-stone-900 border border-stone-800 text-amber-400 px-4 py-3 rounded-xl font-bold"
            placeholder="0.00"
            placeholderTextColor="#78716c"
            keyboardType="numeric"
            value={savings}
            onChangeText={setSavings}
          />
        </View>
      </View>

      {/* Indicador de Monto No Asignado */}
      <View className={`p-4 rounded-xl mb-6 border ${unallocatedAmount < 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-stone-900 border-stone-800'}`}>
        <Text className="text-xs text-stone-400">Dinero pendiente por asignar:</Text>
        <Text className={`text-xl font-bold ${unallocatedAmount < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
          ${unallocatedAmount.toFixed(2)} USD
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        disabled={isSettingUp}
        className="bg-amber-500 py-4 rounded-xl items-center mb-12 shadow-lg"
      >
        {isSettingUp ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text className="text-stone-950 font-bold text-base">Guardar Presupuesto</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}