import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Modal, Pressable, Text } from 'react-native';
import { FeedbackAnimation } from '../components/FeedbackAnimation';
import type { FeedbackAnimationName } from '../components/feedback-animations';

type AnimationFeedback = {
  id: number;
  name: Exclude<FeedbackAnimationName, 'loading'>;
  message: string;
};

type AnimationFeedbackContextValue = {
  showAnimation: (
    name: Exclude<FeedbackAnimationName, 'loading'>,
    message: string,
  ) => void;
};

const AnimationFeedbackContext = createContext<AnimationFeedbackContextValue | null>(null);

export function AnimationFeedbackProvider({ children }: { children: React.ReactNode }) {
  const animationId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [feedback, setFeedback] = useState<AnimationFeedback | null>(null);

  const dismissAnimation = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setFeedback(null);
  }, []);

  const showAnimation = useCallback(
    (name: Exclude<FeedbackAnimationName, 'loading'>, message: string) => {
      if (timer.current) clearTimeout(timer.current);

      const nextAnimation = { id: ++animationId.current, name, message };
      setFeedback(nextAnimation);

      timer.current = setTimeout(dismissAnimation, 5000);
    },
    [dismissAnimation],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const contextValue = useMemo(() => ({ showAnimation }), [showAnimation]);
  const currentFeedback = feedback;

  return (
    <AnimationFeedbackContext.Provider value={contextValue}>
      {children}
      <Modal
        visible={currentFeedback !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={dismissAnimation}
      >
        {currentFeedback && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cerrar aviso"
            onPress={dismissAnimation}
            className="flex-1 items-center justify-center bg-black/70 px-6"
          >
            <Pressable
              onPress={(event) => event.stopPropagation()}
              className="w-full max-w-sm items-center rounded-3xl border border-stone-800 bg-stone-900 px-6 py-7"
            >
              <FeedbackAnimation
                key={currentFeedback.id}
                name={currentFeedback.name}
                size={220}
                loop={false}
                onAnimationFinish={(isCancelled) => {
                  if (!isCancelled) dismissAnimation();
                }}
              />
              <Text
                accessibilityRole="text"
                className="mt-2 text-center text-base font-semibold text-stone-100"
              >
                {currentFeedback.message}
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={dismissAnimation}
                className="mt-3 rounded-lg px-4 py-2"
              >
                <Text className="text-center text-xs font-semibold text-amber-400">
                  Continuar
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        )}
      </Modal>
    </AnimationFeedbackContext.Provider>
  );
}

export function useAnimationFeedback() {
  const context = useContext(AnimationFeedbackContext);
  if (!context) {
    throw new Error('useAnimationFeedback debe usarse dentro de AnimationFeedbackProvider.');
  }
  return context;
}
