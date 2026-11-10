import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';

type BackButtonProps = {
  fallbackHref?: Href;
};

export function BackButton({ fallbackHref }: BackButtonProps) {
  const router = useRouter();
  const canGoBack = router.canGoBack();

  const handlePress = () => {
    if (canGoBack) {
      router.back();
    } else if (fallbackHref) {
      router.replace(fallbackHref);
    }
  };

  if (!canGoBack && !fallbackHref) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Regresar a la pantalla anterior"
      onPress={handlePress}
      className="mb-4 min-h-11 flex-row self-start items-center gap-2 rounded-xl border border-stone-700 bg-stone-900 px-4 py-2 active:bg-stone-800"
    >
      <Ionicons name="arrow-back" size={18} color="#e7e5e4" />
      <Text className="text-sm font-semibold text-stone-200">Regresar</Text>
    </Pressable>
  );
}
