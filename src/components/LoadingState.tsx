import { Text, View } from 'react-native';
import { FeedbackAnimation } from './FeedbackAnimation';

type LoadingStateProps = {
  screenKey: string;
  message: string;
};

export function LoadingState({ screenKey, message }: LoadingStateProps) {
  return (
    <View
      accessibilityLabel={`Cargando ${screenKey}`}
      className="flex-1 items-center justify-center bg-stone-950"
    >
      <FeedbackAnimation name="loading" size={180} />
      <Text className="mt-1 text-sm text-stone-400">{message}</Text>
    </View>
  );
}
