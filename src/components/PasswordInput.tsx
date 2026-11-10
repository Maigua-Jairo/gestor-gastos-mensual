import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PasswordInputProps = Omit<TextInputProps, 'secureTextEntry'> & {
  containerClassName?: string;
};

export function PasswordInput({
  containerClassName,
  className,
  ...inputProps
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View className={`flex-row items-center ${containerClassName ?? ''}`}>
      <TextInput
        {...inputProps}
        className={`min-w-0 flex-1 ${className ?? ''}`}
        secureTextEntry={!isVisible}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        accessibilityState={{ selected: isVisible }}
        hitSlop={10}
        onPress={() => setIsVisible((visible) => !visible)}
        className="ml-2 min-h-11 min-w-11 items-center justify-center"
      >
        <Ionicons
          name={isVisible ? 'eye-off-outline' : 'eye-outline'}
          size={21}
          color="#a8a29e"
        />
      </Pressable>
    </View>
  );
}
