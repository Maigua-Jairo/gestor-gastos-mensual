import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import {
  feedbackAnimationSources,
  feedbackAnimationSpeeds,
  type FeedbackAnimationName,
} from './feedback-animations';

type FeedbackAnimationProps = {
  name: FeedbackAnimationName;
  size?: number;
  loop?: boolean;
  onAnimationFinish?: (isCancelled: boolean) => void;
};

export function FeedbackAnimation({
  name,
  size = 180,
  loop = name === 'loading',
  onAnimationFinish,
}: FeedbackAnimationProps) {
  return (
    <View
      accessible
      accessibilityLabel="Animación de estado"
      className="items-center justify-center"
    >
      <LottieView
        source={feedbackAnimationSources[name]}
        autoPlay
        loop={loop}
        speed={feedbackAnimationSpeeds[name]}
        onAnimationFinish={onAnimationFinish}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}
