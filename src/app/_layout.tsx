import '../../global.css';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '../provider/AuthProvider';
import { AnimationFeedbackProvider } from '../provider/AnimationFeedbackProvider';
import { ScreenEntryAnimation } from '../components/ScreenEntryAnimation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SafeAreaView
          edges={['top']}
          style={{ flex: 1, backgroundColor: '#292524' }}
        >
          <StatusBar style="light" />
          <SafeAreaView
            edges={['bottom']}
            style={{ flex: 1, backgroundColor: '#0c0a09' }}
          >
            <NavigationBar hidden />
            <View style={{ flex: 1, backgroundColor: '#0c0a09' }}>
              <AnimationFeedbackProvider>
                <AuthProvider>
                  <>
                    <Slot />
                    <ScreenEntryAnimation />
                  </>
                </AuthProvider>
              </AnimationFeedbackProvider>
            </View>
          </SafeAreaView>
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}