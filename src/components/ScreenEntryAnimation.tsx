import { useCallback, useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import { usePathname } from 'expo-router';
import { FeedbackAnimation } from './FeedbackAnimation';

const animatedScreens = new Set<string>();
const animationFallbackMs = 5000;

export function ScreenEntryAnimation() {
  const pathname = usePathname();
  const [, refresh] = useState(0);
  const isLoginScreen = /\/login\/?$/.test(pathname);
  const shouldShowAnimation = !isLoginScreen && !animatedScreens.has(pathname);

  const finishAnimation = useCallback(() => {
    animatedScreens.add(pathname);
    refresh((value) => value + 1);
  }, [pathname]);

  useEffect(() => {
    if (!shouldShowAnimation) return;

    const timer = setTimeout(finishAnimation, animationFallbackMs);
    return () => clearTimeout(timer);
  }, [finishAnimation, shouldShowAnimation]);

  if (!shouldShowAnimation) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={finishAnimation}
    >
      <View className="flex-1 items-center justify-center bg-stone-950">
        <FeedbackAnimation
          name="loading"
          size={220}
          loop={false}
          onAnimationFinish={(isCancelled) => {
            if (!isCancelled) finishAnimation();
          }}
        />
        <Text className="mt-2 text-sm text-stone-400">Preparando tu pantalla...</Text>
      </View>
    </Modal>
  );
}
