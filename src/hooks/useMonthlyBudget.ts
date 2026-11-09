import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useAuth } from '../provider/AuthProvider';

export function useMonthlyBudget(year: number, month: number) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Obtener o verificar si existe el mes activo para el usuario
  const { data: activeMonth, isLoading: loadingMonth } = useQuery({
    queryKey: ['month', year, month, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('months')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('month', month)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = No rows found
      return data;
    },
    enabled: !!user,
  });

  // 2. Obtener el ingreso y los presupuestos de los 4 bloques si el mes existe
  const { data: budgetData, isLoading: loadingBudgets } = useQuery({
    queryKey: ['budget_details', activeMonth?.id],
    queryFn: async () => {
      if (!activeMonth) return null;

      const [incomeRes, budgetsRes, expensesRes] = await Promise.all([
        supabase.from('incomes').select('*').eq('month_id', activeMonth.id).single(),
        supabase.from('budgets').select('*').eq('month_id', activeMonth.id),
        supabase.from('expenses').select('*').eq('month_id', activeMonth.id),
      ]);

      return {
        income: incomeRes.data?.total_amount || 0,
        budgets: budgetsRes.data || [],
        expenses: expensesRes.data || [],
      };
    },
    enabled: !!activeMonth,
  });

  // 3. Mutación para inicializar el mes, ingreso y los 4 bloques (incluyendo el 15% de ahorro sugerido)
  const setupMonthMutation = useMutation({
    mutationFn: async ({ totalIncome, allocations }: { totalIncome: number; allocations: { block: string; amount: number }[] }) => {
      if (!user) throw new Error('No usuario autenticado');

      // A. Crear o asegurar el mes
      let monthId = activeMonth?.id;
      if (!monthId) {
        const { data: newMonth, error: monthError } = await supabase
          .from('months')
          .insert({ user_id: user.id, year, month, is_active: true })
          .select()
          .single();
        if (monthError) throw monthError;
        monthId = newMonth.id;
      }

      // B. Registrar ingreso total
      const { error: incomeError } = await supabase
        .from('incomes')
        .upsert({ user_id: user.id, month_id: monthId, total_amount: totalIncome }, { onConflict: 'month_id' });
      if (incomeError) throw incomeError;

      // C. Registrar los bloques de presupuesto
      const budgetPayload = allocations.map((item) => ({
        user_id: user.id,
        month_id: monthId,
        block: item.block,
        allocated_amount: item.amount,
      }));

      const { error: budgetsError } = await supabase
        .from('budgets')
        .upsert(budgetPayload, { onConflict: 'month_id,block' });
      if (budgetsError) throw budgetsError;

      return monthId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['month', year, month] });
      queryClient.invalidateQueries({ queryKey: ['budget_details'] });
    },
  });

  return {
    activeMonth,
    budgetData,
    isLoading: loadingMonth || loadingBudgets,
    setupMonth: setupMonthMutation.mutateAsync,
    isSettingUp: setupMonthMutation.isPending,
  };
}