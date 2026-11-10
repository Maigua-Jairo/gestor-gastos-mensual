import { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { FeedbackAnimation } from './FeedbackAnimation';

const minimumVisibleMs = 900;
const animationLoadFallbackMs = 5000;

export function useLoadingAnimation(isLoading: boolean) {
  const [loadingStarted, setLoadingStarted] = useState(false);
  const [minimumElapsed, setMinimumElapsed] = useState(false);

  const handleLoadingStarted = useCallback(() => {
    setLoadingStarted(true);
    setMinimumElapsed(false);
  }, []);

  const handleAnimationLoaded = useCallback(() => {
    setTimeout(() => setMinimumElapsed(true), minimumVisibleMs);
  }, []);

  return {
    showLoading: isLoading || (loadingStarted && !minimumElapsed),
    onLoadingStarted: handleLoadingStarted,
    onAnimationLoaded: handleAnimationLoaded,
  };
}

type LoadingStateProps = {
  screenKey: string;
  message: string;
  onLoadingStarted?: () => void;
  onAnimationLoaded?: () => void;
};

export function LoadingState({
  screenKey,
  message,
  onLoadingStarted,
  onAnimationLoaded,
}: LoadingStateProps) {
  useEffect(() => {
    onLoadingStarted?.();
    const timer = setTimeout(() => onAnimationLoaded?.(), animationLoadFallbackMs);
    return () => clearTimeout(timer);
  }, [onAnimationLoaded, onLoadingStarted]);

  return (
    <View
      accessibilityLabel={`Cargando ${screenKey}`}
      className="flex-1 items-center justify-center bg-stone-950"
    >
      <FeedbackAnimation
        name="loading"
        size={180}
        onAnimationLoaded={onAnimationLoaded}
      />
      <Text className="mt-1 text-sm text-stone-400">{message}</Text>
    </View>
  );
}
