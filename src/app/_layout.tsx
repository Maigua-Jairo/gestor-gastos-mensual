import "../../global.css";
import { Slot } from 'expo-router';
import { AuthProvider } from '../provider/AuthProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Instancia global del cliente de caché de TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </QueryClientProvider>
  );
}